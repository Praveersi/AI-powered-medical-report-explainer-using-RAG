export default function ReportSummary({ summary, filename }) {
  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <h2 className="font-semibold text-ink text-sm mb-1">Report overview</h2>
      {filename && <p className="text-xs text-faint mb-2">{filename}</p>}
      <p className="text-ink/90 text-sm leading-relaxed">{summary}</p>
    </div>
  )
}
