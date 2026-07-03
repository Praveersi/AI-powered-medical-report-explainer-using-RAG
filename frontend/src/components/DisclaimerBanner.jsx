export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-3 items-start">
      <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
      <p className="text-amber-800 text-sm leading-relaxed">
        <strong>Medical Disclaimer:</strong> This tool explains lab results in
        plain English for educational purposes only. It is <strong>not</strong> a
        substitute for professional medical advice, diagnosis, or treatment.
        Always consult a qualified doctor for medical decisions.
      </p>
    </div>
  ) 
} 