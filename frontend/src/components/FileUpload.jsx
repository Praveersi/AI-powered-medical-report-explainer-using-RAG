import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

export default function FileUpload({ onUpload, status, progress, error }) {
  const [dragError, setDragError] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setDragError(null)

    if (rejected.length > 0) {
      setDragError("Only PDF files under 15MB are accepted.")
      return
    }
    if (accepted.length > 0) onUpload(accepted[0])
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
    disabled: status === "uploading" || status === "analysing"
  })

  const isLoading = status === "uploading" || status === "analysing"
  const displayError = dragError || error

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
          ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          ${displayError ? "border-red-400 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">
            {isLoading ? "⏳" : isDragActive ? "📂" : "📄"}
          </div>
          <div>
            <p className="font-medium text-gray-700">
              {isLoading
                ? (status === "uploading" ? "Uploading..." : "Analysing with AI...")
                : isDragActive ? "Drop your PDF here" : "Drag & drop your lab report here"}
            </p>
            {!isLoading && (
              <p className="text-sm text-gray-400 mt-1">
                or <span className="text-blue-500 underline">click to browse</span>
                <span className="ml-1">· PDF only · Max 15MB</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {status === "uploading" && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading PDF</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "analysing" && (
        <p className="mt-3 text-sm text-blue-600 text-center animate-pulse">
          🤖 AI is reading your report... this takes 5–15 seconds
        </p>
      )}

      {displayError && (
        <p className="mt-3 text-sm text-red-600 text-center">
          ❌ {displayError}
        </p>
      )}
    </div>
  )
}
