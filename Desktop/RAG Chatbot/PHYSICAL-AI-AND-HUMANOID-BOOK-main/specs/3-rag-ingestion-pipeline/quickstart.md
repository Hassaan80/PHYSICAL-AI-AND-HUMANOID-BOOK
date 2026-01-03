# Quickstart Guide: RAG Ingestion Pipeline

This guide explains how to set up and run the RAG ingestion pipeline.

## 1. Prerequisites

- Python 3.9+ installed.
- `uv` installed. You can install it with `curl -LsSf https://astral.sh/uv/install.sh | sh`.
- Git installed.

## 2. Setup

### Step 1: Clone the Repository
Clone the project repository to your local machine.

```bash
git clone <repository-url>
cd <repository-name>
```

### Step 2: Create the Python Environment
The `backend` directory contains the Python project for the pipeline. Use `uv` to create a virtual environment and install the dependencies.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
uv venv

# Activate the virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```
*(Note: The `backend` directory and `requirements.txt` will be created during the implementation phase).*

### Step 3: Configure Environment Variables
The pipeline requires API keys and other configuration details to be set as environment variables.

Create a file named `.env` in the `backend/` directory and add the following, replacing the placeholder values with your actual credentials:

```env
# Cohere API Key
COHERE_API_KEY="YOUR_COHERE_API_KEY"

# Qdrant Cloud Configuration
QDRANT_URL="YOUR_QDRANT_CLOUD_URL"
QDRANT_API_KEY="YOUR_QDRANT_API_KEY"

# The URL of the deployed Docusaurus book
# This will be available after the GitHub Actions deployment is set up.
BOOK_URL="https://<your-github-user>.github.io/<your-repo-name>/"
```

## 3. Running the Pipeline

Once the environment is set up and configured, you can run the ingestion pipeline by executing the `main.py` script.

```bash
# Make sure you are in the backend/ directory with the venv activated
python main.py
```

The script will perform the following steps:
1.  Fetch all page URLs from the `BOOK_URL`.
2.  Extract content from each page.
3.  Chunk the content.
4.  Generate embeddings using Cohere.
5.  Upsert the documents and embeddings into your Qdrant collection.

The script will log its progress to the console.
