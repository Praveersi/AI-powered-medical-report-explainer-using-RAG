import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === "user"

  const content = typeof message.content === "string"
    ? message.content
    : JSON.stringify(message.content || "")

  const sources = Array.isArray(message.sources) ? message.sources : []

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}> 

      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg flex-shrink-0 mb-1 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Timestamp */}
        <span className="text-xs text-slate-400 px-1">
          {isUser ? "You" : "MedLens AI"} · {message.timestamp}
        </span>

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
          ${isUser
            ? "text-white rounded-br-sm"
            : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"}`}
          style={isUser ? { background: "linear-gradient(135deg,#0EA5E9,#0284C7)" } : {}}>
          {isUser ? (
            <p>{content}</p>
          ) : (
            /* NO className on ReactMarkdown — breaks v9+ */
            <div style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
              <ReactMarkdown
                components={{
                  p:      ({ children }) => <p style={{ marginBottom: "0.4rem" }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#0F172A" }}>{children}</strong>,
                  em:     ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
                  ul:     ({ children }) => <ul style={{ paddingLeft: "1.1rem", marginBottom: "0.4rem", listStyleType: "disc" }}>{children}</ul>,
                  ol:     ({ children }) => <ol style={{ paddingLeft: "1.1rem", marginBottom: "0.4rem", listStyleType: "decimal" }}>{children}</ol>,
                  li:     ({ children }) => <li style={{ marginBottom: "0.15rem" }}>{children}</li>,
                  code:   ({ children }) => <code style={{ background: "#F1F5F9", borderRadius: "4px", padding: "1px 5px", fontSize: "0.8rem", fontFamily: "monospace", color: "#0F172A" }}>{children}</code>,
                  a:      ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: "#0EA5E9", textDecoration: "underline" }}>{children}</a>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && sources.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => setShowSources(s => !s)}
              className="text-xs text-slate-400 hover:text-sky-500 px-1 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showSources
                ? "Hide sources"
                : `View ${sources.length} source passage${sources.length > 1 ? "s" : ""}`}
            </button>
            {showSources && (
              <div className="mt-2 space-y-1.5 fade-in">
                {sources.map((src, i) => (
                  <div key={i} className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-400 block mb-1">Source {i + 1}</span>
                    {typeof src === "string" ? src.slice(0, 220) : ""}
                    {typeof src === "string" && src.length > 220 ? "..." : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg flex-shrink-0 mb-1 bg-slate-800 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg> 
        </div>
      )}
    </div>
  )
}
