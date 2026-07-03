import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

export default function FileUpload({ onUpload, status, progress, error }) {
  const [dragError, setDragError] = useState(null)
  const isLoading = status === "uploading" || status === "analysing"

  const onDrop = useCallback((accepted, rejected) => {
    setDragError(null)
    if (rejected.length > 0) { setDragError("Only PDF files under 15 MB are accepted."); return }
    if (accepted.length > 0) onUpload(accepted[0])
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
    disabled: isLoading
  })

  const displayError = dragError || error

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex flex-col items-center gap-4">
          {/* Status icon */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
            {status === "uploading" ? (
              <svg className="w-7 h-7 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800 text-lg">
              {status === "uploading" ? "Uploading your report..." : "AI is analysing your report..."}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {status === "uploading" ? "Extracting text and tables from your PDF" : "Reading values, comparing ranges, generating explanations — takes 10–30 seconds"}
            </p>
          </div>
          {/* Progress bar */}
          {status === "uploading" && (
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Uploading PDF</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full shimmer transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {status === "analysing" && (
            <div className="w-full max-w-sm">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full shimmer" style={{ width: "100%" }} />
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">Powered by Llama 3.1 70B</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? "border-sky-400 bg-sky-50 scale-[1.01]"
            : displayError
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30"
          }`}
      >
        <input {...getInputProps()} />

        {/* Upload icon */}
        <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all
          ${isDragActive ? "bg-sky-500 scale-110" : "bg-slate-900"}`}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
          {isDragActive ? "Drop it here!" : "Upload your lab report"}
        </h3>
        <p className="text-slate-400 text-sm mb-5">
          Drag & drop your PDF here, or{" "}
          <span className="text-sky-500 font-medium underline underline-offset-2">browse to select</span>
        </p>

        {/* Supported types */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {["Blood Test", "CBC Report", "Lipid Panel", "Thyroid Panel", "Urinalysis"].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-300 mt-4">PDF only · Max 15 MB</p>
      </div>

      {displayError && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <span>❌</span> {displayError}
        </div>
      )}
    </div>
  )
}
