import { useUpload } from "./hooks/useUpload"
import { useChat } from "./hooks/useChat"
import Icon from "./components/Icon"
import FileUpload from "./components/FileUpload"
import DisclaimerBanner from "./components/DisclaimerBanner"
import ReportSummary from "./components/ReportSummary"
import AbnormalFlags from "./components/AbnormalFlags"
import DoctorQuestions from "./components/DoctorQuestions"
import LoadingSkeleton from "./components/LoadingSkeleton"
import ChatWindow from "./components/ChatWindow"

export default function App() {
  const { docId, filename, progress, analysis, status, error, upload, reset } = useUpload()
  const { messages, loading: chatLoading, sendMessage } = useChat(docId)

  const isLoading = status === "uploading" || status === "analysing"
  const isDone = status === "done"

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-line">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect width="26" height="26" rx="6" fill="#0e6b5c" />
              <circle cx="11" cy="11" r="5" stroke="#ffffff" strokeWidth="1.6" fill="none" />
              <path d="M14.8 14.8L19 19" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M8.6 11h2M11 8.6v2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <div>
              <h1 className="font-semibold text-ink leading-none">MedLens</h1>
              <p className="text-xs text-muted mt-1">Plain-English lab results, in minutes</p>
            </div>
          </div>

          {isDone && (
            <button
              onClick={reset}
              className="text-sm font-medium text-primary hover:underline"
            >
              ↑ Upload new report
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-5 py-10 space-y-6">
        {/* State 1: idle — show upload */}
        {status === "idle" && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-ink tracking-tight mb-2">
                Understand your lab report
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                Upload a PDF blood test or lab report. We'll flag anything outside
                the normal range and explain what it means, in plain language.
              </p>
            </div>
            <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
          </div>
        )}

        {/* State 2: loading */}
        {isLoading && (
          <div className="space-y-5">
            <DisclaimerBanner />
            <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
            <LoadingSkeleton
              message={
                status === "uploading"
                  ? "Uploading and extracting your PDF…"
                  : "Reading your report and preparing an explanation…"
              }
            />
          </div>
        )}

        {/* State 3: error */}
        {status === "error" && (
          <div className="text-center space-y-4 py-10">
            <div className="w-12 h-12 rounded-full bg-danger-soft border border-danger-line text-danger flex items-center justify-center mx-auto">
              <Icon name="alert" className="w-6 h-6" />
            </div>
            <p className="text-ink font-medium">{error}</p>
            <button
              onClick={reset}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* State 4: done — analysis + chat */}
        {isDone && analysis && (
          <div className="space-y-5">
            <DisclaimerBanner />
            <ReportSummary summary={analysis.summary} filename={filename} />
            <AbnormalFlags flags={analysis.flags || []} />
            <DoctorQuestions questions={analysis.doctor_questions || []} />
            <ChatWindow messages={messages} loading={chatLoading} onSend={sendMessage} />
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-5 pb-10">
        <p className="text-xs text-faint text-center">
          Reports are processed to generate an explanation and are not stored for any other purpose.
        </p>
      </footer>
    </div>
  )
}
