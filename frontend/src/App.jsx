import { useUpload } from "./hooks/useUpload"
import { useChat } from "./hooks/useChat"
import FileUpload from "./components/FileUpload"
import DisclaimerBanner from "./components/DisclaimerBanner"
import LoadingSkeleton from "./components/LoadingSkeleton"
import ReportSummary from "./components/ReportSummary"
import AbnormalFlags from "./components/AbnormalFlags"
import DoctorQuestions from "./components/DoctorQuestions"
import ChatWindow from "./components/ChatWindow"

export default function App() {
  const { docId, filename, progress, analysis, status, error, upload, reset } = useUpload()
  const { messages, loading: chatLoading, sendMessage } = useChat(docId)

  const isLoading = status === "uploading" || status === "analysing"
  const isDone = status === "done"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <div>
              <h1 className="font-bold text-gray-900">Medical Report Explainer</h1>
              <p className="text-xs text-gray-400">Understand your lab results in plain English</p>
            </div>
          </div>
          {isDone && (
            <button onClick={reset} className="text-sm text-blue-600 hover:underline">
              ↑ Upload new report
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {status === "idle" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Lab Report</h2>
              <p className="text-gray-500 text-sm">
                Upload a PDF blood test or lab report and get a plain-English explanation instantly
              </p>
            </div>
            <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <DisclaimerBanner />
            <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
            <LoadingSkeleton message={status === "uploading" ? "Uploading and extracting your PDF..." : "AI is analysing your report... this takes 5–15 seconds"} />
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <p className="text-red-600">❌ {error}</p>
            <button onClick={reset} className="text-blue-600 hover:underline text-sm">Try again</button>
          </div>
        )}

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
    </div>
  )
}
