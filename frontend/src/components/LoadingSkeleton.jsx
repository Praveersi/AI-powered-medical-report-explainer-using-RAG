export default function LoadingSkeleton({ message = "Analysing your report..." }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 text-blue-600">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4" /> 
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-20 bg-gray-200 rounded-lg" />
        <div className="h-20 bg-gray-200 rounded-lg" /> 
        <div className="h-20 bg-gray-200 rounded-lg" />
        <div className="h-20 bg-gray-200 rounded-lg" /> 
      </div>
    </div>
  )
}