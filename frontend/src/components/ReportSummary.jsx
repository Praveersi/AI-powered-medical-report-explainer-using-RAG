export default function ReportSummary({ summary, filename }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg,#F0F9FF,#F0FDFA)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900">Report Overview</h2>
            {filename && <p className="text-xs text-slate-400">{filename}</p>}
          </div> 
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
          <span className="text-xs text-emerald-700 font-medium">Analysis Complete</span>
        </div>
      </div>

      {/* Summary text */}
      <div className="px-6 py-5">
        <p className="text-slate-600 leading-relaxed text-sm">{summary}</p>
      </div>
    </div>
  )
}
