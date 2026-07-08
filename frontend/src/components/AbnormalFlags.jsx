import { useState } from "react"
import Icon from "./Icon"

// Severity → visual treatment. Anything abnormal (high/low/borderline) reads as
// red so it's a single unambiguous "needs attention" signal — only normal is teal.
const SEVERITY_CONFIG = {
  high: { bg: "bg-danger-soft", border: "border-danger-line", badge: "bg-danger/15 text-danger", value: "text-danger", label: "High" },
  low: { bg: "bg-danger-soft", border: "border-danger-line", badge: "bg-danger/15 text-danger", value: "text-danger", label: "Low" },
  borderline: { bg: "bg-danger-soft", border: "border-danger-line", badge: "bg-danger/15 text-danger", value: "text-danger", label: "Borderline" },
  normal: { bg: "bg-primary-soft", border: "border-primary-line", badge: "bg-primary/15 text-primary", value: "text-ink", label: "Normal" },
}

function FlagCard({ flag }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.normal

  return (
    <div className={`border rounded-lg p-3.5 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-ink">{flag.name}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
          <p className={`text-base font-bold mt-0.5 ${cfg.value}`}>
            {flag.value}{" "}
            {flag.unit && <span className="text-sm font-normal text-muted">{flag.unit}</span>}
          </p>
          <p className="text-xs text-muted">Normal range: {flag.normal_range}</p>
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-muted hover:text-ink text-xs flex items-center gap-1 shrink-0 mt-1 transition-colors"
        >
          {expanded ? "Less" : "Explain"}
          <Icon name={expanded ? "chevronUp" : "chevronDown"} className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <p className="mt-3 text-sm text-ink/80 leading-relaxed border-t border-ink/10 pt-3">
          {flag.plain_english}
        </p>
      )}
    </div>
  )
}

export default function AbnormalFlags({ flags }) {
  const [filter, setFilter] = useState("all")

  const abnormal = flags.filter((f) => f.severity !== "normal")
  const displayed = filter === "all" ? flags : abnormal

  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-semibold text-ink text-sm">Test results ({flags.length})</h2>

        <div className="flex gap-1.5">
          {["all", "abnormal"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors
                ${
                  filter === f
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-muted border-line hover:border-primary/50"
                }`}
            >
              {f === "all" ? "All tests" : `Abnormal (${abnormal.length})`}
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
