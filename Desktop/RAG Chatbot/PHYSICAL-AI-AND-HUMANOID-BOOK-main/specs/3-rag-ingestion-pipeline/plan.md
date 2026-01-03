# Implementation Plan: RAG Ingestion Pipeline

## 1. Technical Context
- **Objective**: Implement a Python-based ingestion pipeline for a RAG system, as defined in the feature specification.
- **Architecture**: A monolithic script located in a new `backend/` directory. This approach is chosen for simplicity as requested by the user.
- **Core Components**:
  - **Python Environment**: Managed by `uv` for fast dependency installation and virtual environment creation.
  - **Deployment**: The Docusaurus book will be built and deployed to GitHub Pages using GitHub Actions to provide a stable, public URL for crawling.
  - **Data Fetching**: A web crawler will be built using `requests` and `BeautifulSoup4`. It will start from the root URL and recursively find all linked pages, or preferably, parse the `sitemap.xml` for a comprehensive list of pages.
  - **Text Processing**: Content will be extracted from the main content area of each page. The extracted text will be chunked using `langchain.text_splitter.RecursiveCharacterTextSplitter` to create semantically coherent chunks.
  - **Embedding Generation**: The `cohere` Python client will be used to generate `embed-english-v3.0` embeddings for each text chunk.
  - **Vector Storage**: The `qdrant-client` will be used to connect to a Qdrant Cloud instance and store the text chunks, their embeddings, and associated metadata (URL, page title).
- **Execution Flow**: The entire process will be orchestrated from a single `main.py` file, executed as a Python script.
- **Configuration**: API keys for Cohere and Qdrant, along with the Qdrant URL, will be managed via environment variables. A `.env` file will be used for local development, loaded by the `python-dotenv` library.

## 2. Constitution Check
- Adherence to **Constitution Version 0.1.0** principles:
  - **Technical accuracy**: Compliant. The plan uses established, modern libraries for each step of the pipeline.
  - **Educational clarity (CS/AI students)**: Compliant. The resulting pipeline code will be documented and serve as a clear educational example of a RAG ingestion system.
  - **Reproducibility**: Compliant. The use of `uv` for environment management and a script-based approach ensures high reproducibility.
  - **Spec-driven development**: Compliant. This plan is derived directly from the approved specification.
  - **Embodied intelligence focus**: Not Directly Applicable. This is an infrastructure feature supporting the main project goal.
- **Justified Deviations**: The user's directive to place all logic into a single `main.py` file deviates from the principle of modularity. This is a justified deviation to meet the explicit implementation detail in the prompt, favoring simplicity for this specific task.

## 3. Gates
- **Research Phase Completion**: Complete
- **Design & Contracts Completion**: Complete

## 4. Phase 0: Outline & Research
### 4.1. Research Tasks
- [X] Research best practices for deploying a Docusaurus v3 site to GitHub Pages using GitHub Actions.
- [X] Research robust methods for web scraping a Docusaurus site, focusing on extracting main content while excluding headers, footers, and sidebars (e.g., targeting specific CSS classes or landmarks).
- [X] Confirm the latest API usage patterns for the `cohere` Python client, especially for batch embedding generation.
- [X] Confirm the latest API usage patterns for the `qdrant-client`, specifically for creating collections and batch-uploading points (vectors + payload).
- [X] Document the steps to create a Python virtual environment and install dependencies using `uv`.

### 4.2. Research Findings
- See [research.md](research.md).

## 5. Phase 1: Design & Contracts
### 5.1. Data Model
- See [data-model.md](data-model.md).

### 5.2. API Contracts
- See [contracts/README.md](contracts/README.md).

### 5.3. Quickstart Guide
- See [quickstart.md](quickstart.md).

### 5.4. Agent Context Update
- Skipped. The PowerShell script for this action failed due to security policies, and no manual alternative is defined.

## 6. Phase 2: Implementation (Not part of this plan generation)

## 7. Re-evaluated Constitution Check (Post-Design)
- This section will be filled upon completion of the design phase artifacts.
