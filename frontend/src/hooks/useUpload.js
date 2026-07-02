import { useState } from "react"
import { uploadPDF, analyseDocument } from "../api/client"

export const useUpload = () => {
  const [docId,    setDocId]    = useState(null)
  const [filename, setFilename] = useState("")
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [status,   setStatus]   = useState("idle")
  // status: "idle" | "uploading" | "analysing" | "done" | "error"
  const [error,    setError]    = useState(null)

  const upload = async (file) => {
    try {
      // Reset state for new upload
      setError(null)
      setAnalysis(null)
      setProgress(0)
      setFilename(file.name)

      // Phase A: upload + ingest
      setStatus("uploading")
      const ingestResult = await uploadPDF(file, (pct) => setProgress(pct))
      setDocId(ingestResult.doc_id)

      // Phase B: analyse (Groq call — takes a few seconds)
      setStatus("analysing")
      const analysisResult = await analyseDocument(ingestResult.doc_id)
      setAnalysis(analysisResult)

      setStatus("done")
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Upload failed."
      setError(msg)
      setStatus("error")
    }
  }

  const reset = () => {
    setDocId(null); setFilename(""); setProgress(0)
    setAnalysis(null); setStatus("idle"); setError(null)
  }

  return { docId, filename, progress, analysis, status, error, upload, reset }
}