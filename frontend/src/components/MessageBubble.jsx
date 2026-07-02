import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === "user"

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
          {isUser
            ? <p>{message.content}</p>
            : <ReactMarkdown className="prose prose-sm max-w-none">{message.content}</ReactMarkdown>
          }
        </div>

        {/* Sources toggle — only for AI messages with sources */}
        {!isUser && message.sources?.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => setShowSources(s => !s)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              {showSources ? "▲ Hide sources" : `▼ View ${message.sources.length} source passages`}
            </button>
            {showSources && (
              <div className="mt-1 space-y-1">
                {message.sources.map((src, i) => (
                  <div key={i} className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-600 leading-relaxed">
                    <span className="font-medium text-gray-400">Source {i + 1}: </span>
                    {src.slice(0, 200)}{src.length > 200 ? "..." : ""}
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