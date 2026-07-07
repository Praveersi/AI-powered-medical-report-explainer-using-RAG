import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === "user"

  // Safety guards
  const content = typeof message.content === "string"
    ? message.content
    : JSON.stringify(message.content || "")

  const sources = Array.isArray(message.sources) ? message.sources : []

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>

        {/* Avatar label */}
        <span className="text-xs text-gray-400 px-1">
          {isUser ? "You" : "🤖 AI Assistant"} · {message.timestamp} 
        </span>

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
          {isUser ? (
            <p>{content}</p>
          ) : (
            // ✅ NO className on ReactMarkdown — removed, breaks in v9+
            // Styling handled by wrapper div and components prop instead
            <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{ marginBottom: "0.35rem" }}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 600 }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: "italic" }}>{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: "1.2rem", marginBottom: "0.35rem", listStyleType: "disc" }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: "1.2rem", marginBottom: "0.35rem", listStyleType: "decimal" }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: "0.2rem" }}>{children}</li>
                  ),
                  code: ({ children }) => (
                    <code style={{
                      background: "#e5e7eb",
                      borderRadius: "3px",
                      padding: "1px 5px",
                      fontSize: "0.8rem",
                      fontFamily: "monospace"
                    }}>
                      {children}
                    </code>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline" }}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources toggle — only for AI messages with sources */}
        {!isUser && sources.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => setShowSources(s => !s)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              {showSources
                ? "▲ Hide sources"
                : `▼ View ${sources.length} source passage${sources.length > 1 ? "s" : ""}`}
            </button>
            {showSources && (
              <div className="mt-1 space-y-1">
                {sources.map((src, i) => (
                  <div
                    key={i}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-600 leading-relaxed"
                  >
                    <span className="font-medium text-gray-400">Source {i + 1}: </span>
                    {typeof src === "string" ? src.slice(0, 200) : ""}
                    {typeof src === "string" && src.length > 200 ? "..." : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}