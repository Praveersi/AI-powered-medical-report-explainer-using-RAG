export default function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-0.5">Medical Disclaimer</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          MedLens explains lab results in plain English for <strong>educational purposes only</strong>.
          It is not a substitute for professional medical advice, diagnosis, or treatment.
          Always consult a qualified doctor before making any health decisions.
        </p> 
      </div>
    </div>
  )
}
