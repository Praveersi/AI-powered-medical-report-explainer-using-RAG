import { useState, useRef, useEffect } from "react"
import MessageBubble from "./MessageBubble"

const SUGGESTIONS = [
  "Which tests are outside the normal range?",
  "What does my haemoglobin level mean?",
  "Should I be worried about any of my results?",
  "What should I ask my doctor at my next visit?",
]

export default function ChatWindow({ messages, loading, onSend }) {
  const [input, setInput]   = useState("")
  const bottomRef           = useRef(null)
  const inputRef            = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput("")
    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
      style={{ height: "520px" }}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg,#F0F9FF,#F0FDFA)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900">Ask About Your Report</h2>
            <p className="text-xs text-slate-400">Powered by Llama 3.1 · Answers grounded in your document</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-700 font-medium">Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700 mb-1">Ask anything about your results</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Get plain-English explanations, value clarifications, or help preparing for your doctor's visit.
              </p>
            </div>
            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSend(s)}
                  className="text-left text-xs bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-700
                    border border-slate-200 hover:border-sky-200 rounded-xl px-3 py-2.5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="w-2 h-2 rounded-full bg-sky-400 dot-bounce" />
                <div className="w-2 h-2 rounded-full bg-sky-400 dot-bounce" />
                <div className="w-2 h-2 rounded-full bg-sky-400 dot-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your results..."
            disabled={loading}
            maxLength={500}
            className="chat-input flex-1 text-sm border border-slate-200 bg-white rounded-xl px-4 py-3
              placeholder-slate-400 disabled:opacity-50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-xl text-white
              disabled:opacity-40 transition-all"
            style={{ background: !input.trim() || loading
              ? "#94A3B8"
              : "linear-gradient(135deg,#0EA5E9,#0284C7)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Answers are grounded in your document only · Not medical advice 
        </p>
      </div>
    </div>
  )
}
