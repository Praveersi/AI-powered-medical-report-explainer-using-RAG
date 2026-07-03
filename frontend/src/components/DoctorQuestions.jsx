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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg,#FFF7ED,#FFFBEB)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900">Questions to Ask Your Doctor</h2>
            <p className="text-xs text-slate-400">Take these to your next consultation</p>
          </div>
        </div>
        <button
          onClick={copyAll}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
            ${copied
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
        >
          {copied ? (
            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
          ) : (
            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy all</>
          )}
        </button>
      </div>

      {/* Questions */}
      <div className="p-5 space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="flex gap-4 items-start p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }}>
              {i + 1}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{q}</p> 
          </div> 
        ))}
      </div>
    </div>
  )
}
