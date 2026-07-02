import { useState, useRef, useEffect } from "react"
import MessageBubble from "./MessageBubble"

// Suggested starter questions shown before user types anything
const SUGGESTIONS = [
  "Which tests are outside the normal range?",
  "What does my haemoglobin level mean?",
  "Are my results something to worry about?",
  "What should I ask my doctor?",
]

export default function ChatWindow({ messages, loading, onSend }) {
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput("")
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col" style={{ height: "480px" }}>

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-lg">💬</span>
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">Ask About Your Report</h2>
          <p className="text-xs text-gray-400">Ask anything about your test results</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 text-center">Try asking one of these:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSend(s)}
                  className="text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg px-3 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* AI thinking indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )} 
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your results..."
          disabled={loading}
          maxLength={500}
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}