# FinSight — Financial RAG Analyzer

A full-stack Retrieval-Augmented Generation (RAG) application that lets users upload financial documents (balance sheets, reports, statements) and ask natural-language questions about them. The system retrieves only the relevant context from the uploaded document and generates grounded answers — refusing to answer when the requested data isn't present, instead of hallucinating numbers.

Built with **Spring Boot**, **Spring AI**, **pgvector**, and **Google Gemini**.

---

## ✨ Features

- 📄 **Document Upload** — Upload PDF financial documents (balance sheets, reports, resumes, etc.)
- 🧩 **Automatic Chunking & Embedding** — Documents are parsed (Apache Tika) and converted into vector embeddings
- 🔍 **Semantic Search** — Relevant context is retrieved via cosine-similarity search over a PostgreSQL + pgvector store
- 💬 **Natural-Language Q&A** — Ask questions about the uploaded document and get grounded, context-aware answers
- 🛡️ **Hallucination Guardrail** — If the answer isn't present in the document, the system explicitly says so instead of fabricating data
- 🎨 **React Frontend** — Clean, minimal UI for uploading documents and chatting with them

---

## 🏗️ Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│  React Frontend  │  --->  │  Spring Boot Backend  │  --->  │   Google Gemini API │
│ (Upload + Chat)  │  <---  │   (REST Controllers)  │  <---  │  (Chat + Embedding) │
└─────────────────┘        └──────────┬───────────┘        └────────────────────┘
                                       │
                                       v
                            ┌────────────────────┐
                            │  PostgreSQL +       │
                            │  pgvector           │
                            │  (Vector Store)      │
                            └────────────────────┘
```

**Flow:**
1. User uploads a PDF → `DocumentController` → `IngestionService`
2. Document is parsed (Apache Tika) and split into chunks
3. Each chunk is embedded using Gemini's `gemini-embedding-001` model
4. Embeddings are stored in PostgreSQL via `pgvector` (HNSW index, cosine distance)
5. User asks a question → `QueryController` → `AnalysisService`
6. Relevant chunks are retrieved via semantic similarity search (`QuestionAnswerAdvisor`)
7. Retrieved context + question is sent to Gemini's chat model (`gemini-flash-latest`)
8. Grounded answer is returned to the user

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Spring Boot 3.4 |
| AI Orchestration | Spring AI 1.1.8 |
| LLM Provider | Google Gemini (`gemini-flash-latest`, `gemini-embedding-001`) |
| Vector Database | PostgreSQL + pgvector |
| Document Parsing | Apache Tika |
| Frontend | React.js |
| Build Tool | Maven |
| Containerization | Docker Compose (for PostgreSQL) |
| Language | Java 21 |

---

## 🚀 Getting Started

### Prerequisites

- Java 21 (JDK)
- Maven (or use the included `mvnw` wrapper)
- Docker (for running PostgreSQL + pgvector)
- Node.js & npm (for the frontend)
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/sarthak0108-sp/FinSight.git
cd FinSight
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Set your Gemini API key

```bash
# Windows PowerShell
$env:GEMINI_API_KEY = "your-api-key-here"

# macOS/Linux
export GEMINI_API_KEY="your-api-key-here"
```

### 4. Run the backend

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`.

### 5. Run the frontend

```bash
cd front-end-client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port).

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload a PDF document to be parsed and vectorized |
| `GET` | `/api/analysis/query?question=...` | Ask a question about the uploaded document |

### Example — Upload a document

```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -F "file=@/path/to/document.pdf"
```

### Example — Ask a question

```bash
curl "http://localhost:8080/api/analysis/query?question=What%20is%20the%20total%20revenue%3F"
```

---

## 🧪 Sample Test Questions

Once a financial document (e.g. a balance sheet) is uploaded, try:

- "What is the total shareholders' fund for the current year?"
- "Compare the current ratio between the two years."
- "What is the working capital of the company?"
- "What is the company's net profit margin?" *(tests the hallucination guardrail — should say the data is missing if not present)*

---

## 📂 Project Structure

```
FinSight/
├── src/main/java/com/sarthak/financialrag/
│   ├── config/          # CORS and RAG (ChatClient) configuration
│   ├── controller/      # REST controllers (Document upload, Query)
│   ├── service/         # Business logic (Ingestion, Analysis)
│   └── FinancialRagAnalyzerApplication.java
├── src/main/resources/
│   └── application.yaml # App + Gemini + pgvector configuration
├── front-end-client/    # React frontend
├── compose.yaml         # Docker Compose for PostgreSQL + pgvector
└── pom.xml
```

---

## 🔒 Security Notes

- API keys are never hardcoded — they're injected via environment variables (`${GEMINI_API_KEY}`)
- CORS is configured to allow local development origins only
- The `.gitignore` excludes build artifacts, IDE files, and any local secrets

---

## 📈 Possible Future Enhancements

- Support for multiple document formats (Excel, CSV, DOCX)
- Multi-document comparison and cross-referencing
- Chat history persistence per session
- User authentication
- Chart/visualization generation from extracted financial data

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 👤 Author

**Sarthak Tiwari**
GitHub: [@sarthak0108-sp](https://github.com/sarthak0108-sp)
