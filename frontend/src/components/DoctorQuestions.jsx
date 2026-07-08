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
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-ink text-sm">Questions to ask your doctor</h2>
        <button
          onClick={copyAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          {copied ? "Copied" : "Copy all"}
        </button>
      </div>
      <ol className="space-y-2 list-decimal list-inside">
        {questions.map((q, i) => (
          <li key={i} className="text-sm text-ink/90 leading-relaxed">
            {q}
          </li>
        ))}
      </ol>
    </div>
  )
}
