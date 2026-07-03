import { useState } from "react"

const SEVERITY = {
  high:       { badge: "badge-high",   icon: "↑", label: "High",        bar: "#DC2626", barBg: "#FEE2E2" },
  low:        { badge: "badge-low",    icon: "↓", label: "Low",         bar: "#1D4ED8", barBg: "#DBEAFE" },
  borderline: { badge: "badge-border", icon: "~", label: "Borderline",  bar: "#B45309", barBg: "#FEF3C7" },
  normal:     { badge: "badge-normal", icon: "✓", label: "Normal",      bar: "#15803D", barBg: "#DCFCE7" },
}

function FlagCard({ flag }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SEVERITY[flag.severity] || SEVERITY.normal
  const isAbnormal = flag.severity !== "normal"

  return (
    <div className={`card-lift bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
      ${isAbnormal ? "border-slate-200" : "border-slate-100"}`}>

      {/* Top color bar */}
      <div className="h-1" style={{ background: cfg.bar }} />

      <div className="p-4">
        {/* Name + badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{flag.name}</h3>
          <span className={`${cfg.badge} text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 flex items-center gap-1`}>
            <span>{cfg.icon}</span> {cfg.label}
          </span>
        </div>

        {/* Value display */}
        <div className="flex items-end gap-2 mb-2">
          <span className="font-display font-bold text-2xl text-slate-900">{flag.value}</span>
          {flag.unit && <span className="text-sm text-slate-400 mb-0.5">{flag.unit}</span>}
        </div>

        {/* Reference range */}
        <p className="text-xs text-slate-400 mb-3">
          Reference range: <span className="text-slate-600 font-medium">{flag.normal_range}</span>
        </p>

        {/* Mini visual bar */}
        <div className="rounded-full h-1.5 mb-3" style={{ background: cfg.barBg }}>
          <div className="h-1.5 rounded-full w-1/2 opacity-60" style={{ background: cfg.bar }} />
        </div>

        {/* Expand explanation */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-sky-500 hover:text-sky-700 font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? "▲ Hide explanation" : "▼ Plain-English explanation"}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed fade-in">
            {flag.plain_english}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AbnormalFlags({ flags }) {
  const [filter, setFilter] = useState("all")
  const abnormal = flags.filter(f => f.severity !== "normal")
  const displayed = filter === "all" ? flags : abnormal

  const counts = {
    high:       flags.filter(f => f.severity === "high").length,
    low:        flags.filter(f => f.severity === "low").length,
    borderline: flags.filter(f => f.severity === "borderline").length,
    normal:     flags.filter(f => f.severity === "normal").length,
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900">Test Results</h2>
              <p className="text-xs text-slate-400">{flags.length} tests analysed</p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "all",      label: `All (${flags.length})` },
              { key: "abnormal", label: `Abnormal (${abnormal.length})` },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-all
                  ${filter === f.key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {counts.high       > 0 && <span className="badge-high   text-xs px-2.5 py-1 rounded-full font-medium">{counts.high} High</span>}
          {counts.low        > 0 && <span className="badge-low    text-xs px-2.5 py-1 rounded-full font-medium">{counts.low} Low</span>}
          {counts.borderline > 0 && <span className="badge-border text-xs px-2.5 py-1 rounded-full font-medium">{counts.borderline} Borderline</span>}
          {counts.normal     > 0 && <span className="badge-normal text-xs px-2.5 py-1 rounded-full font-medium">{counts.normal} Normal</span>}
        </div>
      </div>

      {/* Cards grid */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((flag, i) => <FlagCard key={i} flag={flag} />)}
        </div>
        {displayed.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No abnormal results found.</p>
        )}
      </div>
    </div>
  )
}
