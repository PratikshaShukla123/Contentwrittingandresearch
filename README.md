# AI Grant Writing & Research Team

A powerful, AI-driven SaaS application designed to streamline the complex process of grant writing and research. This application leverages multi-agent orchestration (via LangGraph) to automate discovery, literature review, drafting, budgeting, and compliance checking.

## 🚀 Architecture

The platform consists of a modern, decoupled architecture:
- **Frontend**: Next.js 14 (App Router) using Tailwind CSS, ShadCN UI, and Lucide React icons for a beautiful, premium glassmorphism aesthetic.
- **Backend**: FastAPI (Python 3.12) providing high-performance REST APIs.
- **AI Orchestration**: LangChain & LangGraph to manage specialized agents (Discovery, Literature, Writing, Budget, Compliance, Review).
- **Database**: PostgreSQL for relational data and `pgvector` for semantic document retrieval (RAG).
- **Monitoring**: Prometheus integration and Tiktoken cost estimation for LLM operations.

## 🛠️ Prerequisites

To run this project locally, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Node.js (v20+)
- Python 3.12 (if running outside Docker)

## 💻 Local Development

The easiest way to run the application is using our provided development Docker Compose configuration, which enables hot-reloading for both the frontend and backend.

### 1. Environment Variables

Create a `.env` file in the root directory and configure your API keys:

```env
OPENAI_API_KEY="your-openai-api-key-here"
ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

### 2. Start the Application

Run the following command from the root of the repository:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 3. Access Services

Once the containers are running, you can access the following services:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Prometheus Metrics**: [http://localhost:9090](http://localhost:9090)

## 📚 Deployment

Looking to deploy this application to production? Check out our comprehensive [Deployment Guide](DEPLOYMENT.md).

## 🧪 Testing

Both the backend and frontend are configured with automated test suites.

- **Backend (Pytest)**: `cd backend && venv\Scripts\pytest`
- **Frontend (Jest)**: `cd frontend && npm test`
