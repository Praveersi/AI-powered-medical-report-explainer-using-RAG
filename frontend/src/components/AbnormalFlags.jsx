import { useState } from "react"

// Severity → colour + icon mapping
const SEVERITY_CONFIG = {
  high:       { bg: "bg-red-50",    border: "border-red-300",    badge: "bg-red-100 text-red-700",    icon: "🔴", label: "High"       },
  low:        { bg: "bg-blue-50",   border: "border-blue-300",   badge: "bg-blue-100 text-blue-700",   icon: "🔵", label: "Low"        },
  borderline: { bg: "bg-amber-50",  border: "border-amber-300",  badge: "bg-amber-100 text-amber-700",  icon: "🟡", label: "Borderline" },
  normal:     { bg: "bg-green-50",  border: "border-green-300",  badge: "bg-green-100 text-green-700",  icon: "🟢", label: "Normal"     },
}

function FlagCard({ flag }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.normal

  return (
    <div className={`border rounded-lg p-3 ${cfg.bg} ${cfg.border}`}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{flag.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {flag.value} {flag.unit && <span className="text-sm font-normal text-gray-500">{flag.unit}</span>}
          </p>
          <p className="text-xs text-gray-500">Normal range: {flag.normal_range}</p>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0 mt-1"
        >
          {expanded ? "▲ Less" : "▼ Explain"}
        </button>
      </div>

      {expanded && (
        <p className="mt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-200 pt-2">
          {flag.plain_english}
        </p>
      )}
    </div>
  )
}

export default function AbnormalFlags({ flags }) {
  const [filter, setFilter] = useState("all")

  const abnormal = flags.filter(f => f.severity !== "normal")
  const displayed = filter === "all" ? flags : abnormal

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔬</span>
          <h2 className="font-semibold text-gray-800">Test Results</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {flags.length} tests
          </span>
        </div>

         <div className="flex gap-1">
          {["all", "abnormal"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors
                ${filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            >
              {f === "all" ? "All Tests" : `Abnormal (${abnormal.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayed.map((flag, i) => (
          <FlagCard key={i} flag={flag} />
        ))}
      </div>
    </div> 
  ) 
}