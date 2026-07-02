export default function ReportSummary({ summary, filename }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📋</span>
        <div>
          <h2 className="font-semibold text-gray-800">Report Overview</h2>
          {filename && (
            <p className="text-xs text-gray-400">{filename}</p>
          )}
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
    </div>
  )
}