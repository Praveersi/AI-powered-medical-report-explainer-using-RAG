import { useState, useRef, useEffect } from "react"
import Icon from "./Icon"
import MessageBubble from "./MessageBubble"

// Suggested starter questions shown before the user types anything
const SUGGESTIONS = [
  "Which tests are outside the normal range?",
  "What does my haemoglobin level mean?",
  "Are my results something to worry about?",
  "What should I ask my doctor?",
]

export default function ChatWindow({ messages, loading, onSend }) {
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

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
    <div className="bg-surface border border-line rounded-lg flex flex-col" style={{ height: "480px" }}>
      <div className="px-4 py-3 border-b border-line">
        <h2 className="font-semibold text-ink text-sm">Ask about your report</h2>
        <p className="text-xs text-muted">Follow-up questions, answered from your results</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-faint text-center">Try asking one of these</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSend(s)}
                  className="text-left text-xs bg-primary-soft hover:bg-primary/15 text-primary-dark border border-primary-line rounded-lg px-3 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg border border-line rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-line flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your results…"
          disabled={loading}
          maxLength={500}
          className="flex-1 text-sm border border-line rounded-lg px-3 py-2 bg-surface focus:outline-none focus:border-primary disabled:opacity-50 placeholder:text-faint"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0"
          aria-label="Send"
        >
          <Icon name="send" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
