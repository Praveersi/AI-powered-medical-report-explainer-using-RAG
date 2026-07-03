import { useState } from "react"

export default function DoctorQuestions({ questions }) {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h2 className="font-semibold text-gray-800">Questions to Ask Your Doctor</h2>
        </div>
        <button
          onClick={copyAll}
          className="text-xs text-blue-600 hover:underline"
        >
          {copied ? "✅ Copied!" : "📋 Copy all"}
        </button>
      </div>
      <ol className="space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center justify-center font-medium mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}