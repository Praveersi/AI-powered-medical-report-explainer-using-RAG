import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Icon from "./Icon"

export default function FileUpload({ onUpload, status, progress, error }) {
  const [dragError, setDragError] = useState(null)

  const onDrop = useCallback(
    (accepted, rejected) => {
      setDragError(null)
      if (rejected.length > 0) {
        setDragError("Only PDF files under 15MB are accepted.")
        return
      }
      if (accepted.length > 0) onUpload(accepted[0])
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
    disabled: status === "uploading" || status === "analysing",
  })

  const isLoading = status === "uploading" || status === "analysing"
  const displayError = dragError || error

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`group border-2 border-dashed rounded-xl px-8 py-10 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-primary/50 hover:bg-primary-soft/40"}
          ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          ${displayError ? "border-danger/60 bg-danger-soft" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <Icon
            name={isLoading ? "refresh" : "upload"}
            className={`w-7 h-7 text-primary ${isLoading ? "animate-spin" : ""}`}
          />
          <div>
            <p className="font-medium text-ink text-sm">
              {isLoading
                ? status === "uploading"
                  ? "Uploading…"
                  : "Analysing with AI…"
                : isDragActive
                  ? "Drop your PDF here"
                  : "Drag and drop your lab report here"}
            </p>
            {!isLoading && (
              <p className="text-sm text-muted mt-1">
                or <span className="text-primary underline underline-offset-2">click to browse</span>
                <span className="text-faint"> · PDF only · Max 15MB</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {status === "uploading" && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Uploading PDF</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-line rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "analysing" && (
        <p className="mt-3 text-sm text-primary text-center">
          Reading your report… this takes 5–15 seconds
        </p>
      )}

      {displayError && (
        <p className="mt-3 text-sm text-danger text-center flex items-center justify-center gap-1.5">
          <Icon name="alert" className="w-3.5 h-3.5" />
          {displayError}
        </p>
      )}
    </div>
  )
}
