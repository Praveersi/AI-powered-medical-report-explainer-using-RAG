<div align="center">

# MedLens — AI Medical Report Explainer

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq_Llama_3.1_70B-F55036?style=flat-square)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Upload any lab report PDF → get a plain-English explanation in under 30 seconds.**




</div>

---

## What it does

- 📋 **Plain-English summary** of your full lab report
- 🚦 **Severity flags** for every test — High · Low · Borderline · Normal
- 💬 **Doctor questions** — AI-generated questions to take to your appointment
- 🤖 **Follow-up chat** — ask anything, answers grounded in your document only
- 📎 **Source citations** — every AI answer shows the exact PDF passage used

---

## Architecture

```
PDF → PyMuPDF + pdfplumber → LangChain splitter → sentence-transformers → FAISS index
                                                                                ↓
User question → embed query → FAISS top-6 chunks → Groq Llama 3.1 70B → React UI
```

---

## Tech Stack

| | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | FastAPI, Python 3.11 |
| **RAG** | LangChain, FAISS, sentence-transformers (local) |
| **LLM** | Groq API — Llama 3.1 70B (free tier) |
| **PDF** | PyMuPDF + pdfplumber |
| **Deploy** | Vercel (frontend) + Render.com (backend) — both free |

---

## Setup

**Requirements:** Python 3.11+, Node.js 18+, [Groq API key](https://console.groq.com) (free)

```bash
# Backend
cd backend
python -m venv venv && .\venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt
cp .env.example .env          # paste your GROQ_API_KEY
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

Open **http://localhost:5173**

---

## Environment Variables

```env
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.1-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHUNK_SIZE=400
CHUNK_OVERLAP=60
TOP_K_CHUNKS=6
MAX_FILE_MB=15
```

---

---

<div align="center">

Built by (https://www.linkedin.com/in/sagar-srivastava-68aa02327/) and (https://www.linkedin.com/in/praveer-singh-2525752a0/) · ⭐ Star if this helped you!

</div>
