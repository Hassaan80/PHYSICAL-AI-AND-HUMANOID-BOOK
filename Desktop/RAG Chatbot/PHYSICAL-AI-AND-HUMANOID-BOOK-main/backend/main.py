import os
import logging
from dotenv import load_dotenv
import cohere
from qdrant_client import QdrantClient, models
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any

# --- Configure Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Constants ---
COLLECTION_NAME = "physical_ai_humanoid_book"
COHERE_MODEL = "embed-english-v3.0"
VECTOR_SIZE = 1024  # For Cohere's embed-english-v3.0

def load_config():
    """Load environment variables from .env file."""
    load_dotenv()
    logger.info("Loading configuration from .env file.")
    return {
        "cohere_api_key": os.getenv("COHERE_API_KEY"),
        "qdrant_url": os.getenv("QDRANT_URL"),
        "qdrant_api_key": os.getenv("QDRANT_API_KEY"),
        "book_url": os.getenv("BOOK_URL"),
    }

def initialize_clients(config):
    """Initialize Cohere and Qdrant clients."""
    logger.info("Initializing Cohere and Qdrant clients.")
    co_client = cohere.Client(api_key=config["cohere_api_key"])
    qdrant_client = QdrantClient(
        url=config["qdrant_url"],
        api_key=config["qdrant_api_key"],
    )
    logger.info("Clients initialized.")
    return co_client, qdrant_client

def create_qdrant_collection(qdrant_client: QdrantClient):
    """Create the Qdrant collection if it doesn't exist."""
    try:
        qdrant_client.get_collection(collection_name=COLLECTION_NAME)
        logger.info(f"Collection '{COLLECTION_NAME}' already exists.")
    except Exception as e:
        logger.info(f"Collection '{COLLECTION_NAME}' not found or error accessing: {e}. Attempting to create collection...")
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=VECTOR_SIZE,
                distance=models.Distance.COSINE,
            ),
        )
        logger.info(f"Collection '{COLLECTION_NAME}' created successfully.")

def get_all_book_urls(book_url: str):
    """Get all URLs from the sitemap."""
    logger.info(f"Fetching sitemap from {book_url}")
    sitemap_url = urljoin(book_url, "sitemap.xml")
    try:
        response = requests.get(sitemap_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "xml")
        urls = [loc.text for loc in soup.find_all("loc")]
        logger.info(f"Found {len(urls)} URLs in sitemap.")
        return urls
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching sitemap from {sitemap_url}: {e}")
        return []

def fetch_page_content(url: str):
    """Fetch and parse the main text content of a given URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        soup = BeautifulSoup(response.text, "html.parser")

        # Prioritize semantic <main> tag or Docusaurus specific content selectors
        main_content_div = soup.find("main") or \
                           soup.find("div", class_="theme-doc-markdown") or \
                           soup.find("article", class_="markdown")
        
        page_title = soup.title.string if soup.title else "No Title"

        if main_content_div:
            return main_content_div.get_text(separator="\n", strip=True), page_title
        else:
            logger.warning(f"Could not find main content for {url}. Returning full body text.")
            return soup.body.get_text(separator="\n", strip=True), page_title
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching {url}: {e}")
        return None, None

def chunk_text(text: str):
    """Split a given text into smaller, semantically meaningful chunks."""
    logger.info("Chunking text.")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    # The create_documents method expects a list of texts
    chunks = text_splitter.create_documents([text])
    logger.info(f"Split into {len(chunks)} chunks.")
    return [chunk.page_content for chunk in chunks]

def get_embeddings(texts: List[str], co_client: cohere.Client):
    """Generate embeddings for a list of text chunks using Cohere client."""
    logger.info(f"Generating embeddings for {len(texts)} text chunks.")
    try:
        response = co_client.embed(
            texts=texts,
            model=COHERE_MODEL,
            input_type="search_document"
        )
        logger.info("Embeddings generated successfully.")
        return response.embeddings
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        return []

def upsert_to_qdrant(
    qdrant_client: QdrantClient,
    texts: List[str],
    embeddings: List[List[float]],
    urls: List[str],
    page_titles: List[str],
):
    """Batch upload points (embeddings + metadata) to Qdrant."""
    logger.info(f"Upserting {len(texts)} points to Qdrant collection '{COLLECTION_NAME}'.")
    points = []
    for i, (text, embedding, url, page_title) in enumerate(zip(texts, embeddings, urls, page_titles)):
        points.append(
            models.PointStruct(
                id=f"{url}-{i}",  # Unique ID for each point based on URL and chunk index
                vector=embedding,
                payload={
                    "text": text,
                    "url": url,
                    "page_title": page_title,
                    "chunk_index": i,
                },
            )
        )
    try:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points,
        )
        logger.info(f"Successfully upserted {len(points)} points to Qdrant collection '{COLLECTION_NAME}'.")
    except Exception as e:
        logger.error(f"Error upserting points to Qdrant: {e}")

if __name__ == "__main__":
    logger.info("Starting RAG Ingestion Pipeline.")
    config = load_config()
    if not all([config["cohere_api_key"], config["qdrant_url"], config["book_url"]]):
        logger.error("Error: Missing required environment variables. Please check your .env file.")
    else:
        logger.info("Configuration loaded successfully.")
        cohere_client, qdrant_client = initialize_clients(config)
        logger.info("Clients initialized successfully.")
        
        create_qdrant_collection(qdrant_client)
        
        urls = get_all_book_urls(config["book_url"])
        logger.info(f"Found {len(urls)} URLs in sitemap.")

        all_chunks_text = []
        all_embeddings_vectors = []
        all_chunk_urls = []
        all_chunk_page_titles = []

        for url in urls:
            logger.info(f"Processing URL: {url}")
            content, page_title = fetch_page_content(url)
            if content:
                chunks = chunk_text(content)
                embeddings = get_embeddings(chunks, cohere_client)
                
                all_chunks_text.extend(chunks)
                all_embeddings_vectors.extend(embeddings)
                all_chunk_urls.extend([url] * len(chunks))
                all_chunk_page_titles.extend([page_title] * len(chunks))
            else:
                logger.warning(f"Skipping {url} due to failed content fetch.")
        
        if all_chunks_text:
            upsert_to_qdrant(
                qdrant_client,
                all_chunks_text,
                all_embeddings_vectors,
                all_chunk_urls,
                all_chunk_page_titles
            )
            logger.info("Ingestion pipeline completed successfully.")
        else:
            logger.warning("No content to ingest.")
    logger.info("RAG Ingestion Pipeline finished.")
