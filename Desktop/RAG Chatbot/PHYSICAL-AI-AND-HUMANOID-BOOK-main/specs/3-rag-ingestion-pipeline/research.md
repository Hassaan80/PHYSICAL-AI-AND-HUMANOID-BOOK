# Research & Decisions

This document records the research and key technical decisions for the RAG ingestion pipeline.

## 1. Docusaurus Deployment to GitHub Pages

- **Decision**: Use a GitHub Actions workflow to build and deploy the Docusaurus site.
- **Rationale**: This is the official, recommended approach by Docusaurus. It automates the deployment process, ensuring that the live book content is always in sync with the main branch. The `peaceiris/actions-gh-pages` action is a well-maintained and standard choice for this task.
- **Alternatives Considered**: Manual deployment (error-prone), other CI/CD platforms (unnecessary complexity for this project).

## 2. Web Content Scraping Strategy

- **Decision**: Use `requests` to fetch page HTML and `BeautifulSoup4` to parse it. The primary content will be extracted by searching for the `<main>` HTML5 element or a Docusaurus-specific CSS class like `.theme-doc-markdown`. The pipeline will also attempt to parse `/sitemap.xml` to discover all available pages programmatically.
- **Rationale**: Targeting semantic elements or stable theme classes is more robust than relying on brittle, specific CSS selectors. Using the sitemap is the most reliable way to ensure all pages are discovered without needing a complex recursive crawler.
- **Alternatives Considered**: A full recursive crawler (more complex to build and maintain), using a headless browser like Playwright/Selenium (overkill for a static site).

## 3. Python Environment Management

- **Decision**: Use `uv` to create the virtual environment and manage dependencies.
- **Rationale**: `uv` is a modern, extremely fast tool that simplifies Python project setup. It acts as a replacement for `venv`, `pip`, and `pip-tools`, providing a superior developer experience. This aligns with the principle of using current best practices.
- **Alternatives Considered**: Standard `venv` + `pip` (slower, more verbose), `conda` (heavier, not necessary for this project), Poetry (good, but `uv` is chosen for its speed and simplicity).

## 4. Embedding and Vector Storage Clients

- **Decision**: Use the official `cohere` and `qdrant-client` Python libraries.
- **Rationale**: Both libraries provide batching capabilities which are essential for efficient ingestion. `cohere.embed()` can handle lists of texts, and `qdrant_client.upsert()` can handle lists of points. This is critical for performance and for staying within API rate limits.
- **Alternatives Considered**: Making raw HTTP requests to the APIs (more complex, loses the benefit of the SDKs' features like automatic retries and pydantic models).
