export default function LoadingSkeleton({ message = "Analysing your report…" }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-primary">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-line rounded w-3/4" />
        <div className="h-4 bg-line rounded w-full" />
        <div className="h-4 bg-line rounded w-5/6" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-20 bg-line rounded-lg" />
          <div className="h-20 bg-line rounded-lg" />
          <div className="h-20 bg-line rounded-lg" />
          <div className="h-20 bg-line rounded-lg" />
        </div>
      </div>
    </div>
  )
}
