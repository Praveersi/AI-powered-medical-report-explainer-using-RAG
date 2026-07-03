import { useUpload } from "./hooks/useUpload"
import { useChat }   from "./hooks/useChat"
import FileUpload       from "./components/FileUpload"
import DisclaimerBanner from "./components/DisclaimerBanner"
import LoadingSkeleton  from "./components/LoadingSkeleton"
import ReportSummary    from "./components/ReportSummary"
import AbnormalFlags    from "./components/AbnormalFlags"
import DoctorQuestions  from "./components/DoctorQuestions"
import ChatWindow       from "./components/ChatWindow"
import { Component }    from "react" 

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error("[ErrorBoundary]", error, info) }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900">Something went wrong</h2>
          <p className="text-sm text-slate-500">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
    return this.props.children
  }
}

// ── Heartbeat SVG ─────────────────────────────────────────────────────────────
function HeartbeatLine() {
  return (
    <svg viewBox="0 0 300 60" className="w-full h-12 opacity-60" fill="none">
      <polyline
        points="0,30 40,30 55,10 65,50 75,30 90,30 105,5 115,55 125,30 160,30 175,15 185,45 195,30 300,30"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="heartbeat-path"
      />
    </svg>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { docId, filename, progress, analysis, status, error, upload, reset } = useUpload()
  const { messages, loading: chatLoading, sendMessage } = useChat(docId)

  const isLoading = status === "uploading" || status === "analysing"
  const isDone    = status === "done"
  const isIdle    = status === "idle"
  const isError   = status === "error"

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: "#F8FAFC" }}>

        {/* ── Navbar ── */}
        <nav style={{ background: "#0F172A" }} className="sticky top-0 z-50 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#0D9488)" }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg tracking-tight">MedLens</span>
                <span className="text-slate-500 text-xs ml-2 hidden sm:inline">AI Medical Report Explainer</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isDone && (
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  New Report
                </button>
              )}
              <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-slate-400">AI Ready</span>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Hero (idle only) ── */}
        {isIdle && (
          <div className="hero-gradient border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 mb-6">
                <svg className="w-3.5 h-3.5 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-sky-400 font-medium">Powered by Llama 3.1 70B + RAG</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-4">
                Understand Your Lab Results<br />
                <span style={{ color: "#38BDF8" }}>In Plain English</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Upload any blood test or lab report PDF. Our AI explains every value,
                flags abnormal results, and tells you exactly what to ask your doctor.
              </p>
              <HeartbeatLine />
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 100% Private</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No account needed</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free to use</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

          {/* IDLE — upload */}
          {isIdle && (
            <div className="fade-in">
              <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
              {/* How it works */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {[
                  { icon: "📤", step: "1", title: "Upload PDF", desc: "Drop your lab report — blood test, CBC, lipid panel, or any diagnostic report" },
                  { icon: "🤖", step: "2", title: "AI Analyses", desc: "Our AI reads every value, compares to reference ranges, and explains what they mean" },
                  { icon: "💬", step: "3", title: "Ask Questions", desc: "Chat with the AI about your specific results and get personalised explanations" },
                ].map(item => (
                  <div key={item.step} className="card-lift bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-xs font-semibold text-sky-500 mb-1 uppercase tracking-widest">Step {item.step}</div>
                    <div className="font-semibold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <div className="fade-in space-y-5">
              <DisclaimerBanner />
              <FileUpload onUpload={upload} status={status} progress={progress} error={error} />
              <LoadingSkeleton message={
                status === "uploading"
                  ? "Extracting your PDF..."
                  : "AI is analysing your report..."
              } />
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div className="fade-in bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">❌</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Upload Failed</h3>
              <p className="text-sm text-red-500 mb-5">{error}</p>
              <button onClick={reset}
                className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* DONE */}
          {isDone && analysis && (
            <div className="fade-in space-y-5">
              <DisclaimerBanner />
              <ReportSummary summary={analysis.summary} filename={filename} />
              <AbnormalFlags flags={analysis.flags || []} />
              <DoctorQuestions questions={analysis.doctor_questions || []} />
              <ChatWindow messages={messages} loading={chatLoading} onSend={sendMessage} />
            </div>
          )}

        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-200 mt-16 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs text-slate-400">
              MedLens is for educational purposes only and does not provide medical advice.
              Always consult a qualified healthcare professional.
            </p>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  )
}
