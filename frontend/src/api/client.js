import axios from "axios"

// Base URL from .env.local
// In development: http://localhost:8000
// After deployment: your Render URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // 60 seconds — Groq can take a moment
})


// ── 1. Upload PDF ────────────────────────────────────────
// Sends a PDF file to /api/ingest
// onProgress callback receives 0-100 for the progress bar
export const uploadPDF = async (file, onProgress) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await api.post("/api/ingest", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(pct)
      }
    }
  })
  return response.data  // { doc_id, filename, page_count, chunk_count }
}


// ── 2. Analyse document ──────────────────────────────────
// Sends doc_id to /api/analyse
// Returns { summary, flags[], doctor_questions[], disclaimer }
export const analyseDocument = async (docId) => {
  const response = await api.post("/api/analyse", { doc_id: docId })
  return response.data
}


// ── 3. Ask a follow-up question ──────────────────────────
// Sends doc_id + question to /api/query
// Returns { answer, source_chunks[] }
export const askQuestion = async (docId, question) => {
  const response = await api.post("/api/query", {
    doc_id: docId,
    question: question
  })
  return response.data
}