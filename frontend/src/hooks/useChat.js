import { useState } from "react"
import { askQuestion } from "../api/client"

export const useChat = (docId) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = async (question) => {
    if (!question.trim() || !docId) return

    const userMsg = {
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const result = await askQuestion(docId, question)

      const aiMsg = {
        role: "ai",
        content: result.answer,
        sources: result.source_chunks,
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong. Try again."
      setError(msg)
      setMessages((prev) => [...prev, {
        role: "ai",
        content: `Sorry, I couldn't answer that. ${msg}`,
        sources: [],
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return { messages, loading, error, sendMessage, clearChat }
}
