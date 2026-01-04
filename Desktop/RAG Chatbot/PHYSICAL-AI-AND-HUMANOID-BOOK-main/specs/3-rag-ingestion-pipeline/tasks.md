# Tasks for Feature: RAG Ingestion Pipeline

## 1. Phase 1: Setup
- [X] T001 Create the backend directory for the Python script at `backend/`
- [X] T002 [P] Initialize a Python project using `uv` in the `backend/` directory.
- [X] T003 [P] Create a `requirements.txt` file in `backend/` with initial dependencies: `cohere`, `qdrant-client`, `beautifulsoup4`, `requests`, `python-dotenv`, `langchain`.
- [X] T004 [P] Create a `.env.example` file in `backend/` with placeholders for `COHERE_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, and `BOOK_URL`.
- [X] T005 [P] Create the main script file at `backend/main.py`.

## 2. Phase 2: Foundational
- [X] T006 Implement configuration loading in `backend/main.py` to load environment variables from a `.env` file.
- [X] T007 Initialize the Cohere and Qdrant clients in `backend/main.py` using the loaded configuration.
- [X] T008 Implement a function `create_qdrant_collection()` in `backend/main.py` to set up the Qdrant collection `physical_ai_humanoid_book` if it doesn't exist, using the schema from `data-model.md`.

## 3. Phase 3: User Story 1 - Automate the full ingestion process
### 3.1. Acceptance Criteria
- Running `python backend/main.py` successfully ingests content from the deployed Docusaurus book into the specified Qdrant collection.
- A sample semantic query to the Qdrant collection returns relevant text chunks with correct metadata (URL, page_title).

### 3.2. Tasks
- [X] T009 [US1] Implement a function `get_all_book_urls()` in `backend/main.py` that parses the `sitemap.xml` of the `BOOK_URL` to return a list of all page URLs.
- [X] T010 [US1] Implement a function `fetch_page_content()` in `backend/main.py` that takes a URL and returns the parsed main text content using BeautifulSoup.
- [X] T011 [US1] Implement a function `chunk_text()` in `backend/main.py` that uses `langchain.text_splitter.RecursiveCharacterTextSplitter` to split a given text into smaller documents.
- [X] T012 [US1] Implement a function `get_embeddings()` in `backend/main.py` that takes a list of text chunks and returns a list of vector embeddings using the Cohere client.
- [X] T013 [US1] Implement a function `upsert_to_qdrant()` in `backend/main.py` that takes a list of texts, embeddings, and metadata, and batch-uploads them as points to the Qdrant collection.
- [X] T014 [US1] Implement the `main()` function in `backend/main.py` to orchestrate the entire pipeline: get URLs, loop through them to fetch, chunk, embed, and upsert the content.

## 4. Final Phase: Polish & Cross-Cutting Concerns
- [X] T015 [P] Add logging (using Python's `logging` module) to all functions in `backend/main.py` to provide visibility into the pipeline's progress and status.
- [X] T016 [P] Add comprehensive error handling (e.g., try-except blocks for network requests and API calls) to all functions in `backend/main.py`.
- [X] T017 Update the root `README.md` to include a section on the RAG Ingestion Pipeline, referencing the quickstart guide in `specs/3-rag-ingestion-pipeline/quickstart.md`.

## 5. Dependencies
- User Story 1 is dependent on the completion of the Setup and Foundational phases. The Polish phase can begin after User Story 1 is complete.

## 6. Parallel Execution Examples
- During the setup phase, tasks T002, T003, T004, and T005 can be performed in parallel after T001 is complete.
- During the polish phase, tasks T015 and T016 can be performed in parallel with each other.

## 7. Implementation Strategy
- The implementation will follow the phases outlined above. First, the project structure and foundational code will be established. Then, the core logic for the single user story will be implemented function by function. Finally, polish and documentation will be added. This constitutes the Minimum Viable Product (MVP) for this feature.
