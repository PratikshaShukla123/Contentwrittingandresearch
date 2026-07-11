# ✍️ AI Content Writing and Research Platform

> [!NOTE]
> Welcome to the AI Content Writing and Research project! This is a full-stack Generative AI web application designed to assist with autonomous research and intelligent content generation.

## 🚀 Tech Stack

### 🐍 Backend (`/backend`)
- **Framework:** FastAPI powered by Uvicorn
- **AI & Agents:** LangChain, LangGraph, OpenAI, and Groq (for fast inference)
- **Database:** SQLAlchemy (ORM)
- **Validation:** Pydantic

### ⚛️ Frontend (`/frontend`)
- **Framework:** Next.js (App Router), React 19
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, @base-ui/react, and Lucide React
- **Language:** TypeScript

---

## 📂 Project Structure

```text
.
├── backend/          # Python/FastAPI backend containing LangGraph agents
│   ├── app/          # Main application code (api, core, db, models, schemas, services, agents)
│   ├── tests/        # Pytest test suites
│   ├── requirements.txt
│   └── pytest.ini
└── frontend/         # Next.js frontend
    ├── src/          # React components and pages
    ├── public/       # Static assets
    ├── package.json
    └── eslint.config.mjs
```

---

## ⚙️ Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000` with Swagger docs at `/docs`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The web application will be accessible at `http://localhost:3000`.*
