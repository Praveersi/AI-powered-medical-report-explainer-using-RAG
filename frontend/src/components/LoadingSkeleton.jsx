export default function LoadingSkeleton({ message = "Analysing your report..." }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-sm font-medium text-sky-600">{message}</span>
      </div>
      {/* Skeleton lines */}
      {[1, 0.85, 0.9, 0.7].map((w, i) => (
        <div key={i} className="h-3.5 bg-slate-100 rounded-full animate-pulse" 
          style={{ width: `${w * 100}%`, animationDelay: `${i * 100}ms` }} />
      ))}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  )
}
