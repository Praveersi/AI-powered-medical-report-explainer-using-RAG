import Icon from "./Icon"

export default function DisclaimerBanner() {
  return (
    <div className="bg-warn-soft border border-warn-line rounded-lg px-4 py-3 flex gap-3 items-start">
      <Icon name="alert" className="w-4 h-4 text-warn shrink-0 mt-0.5" />
      <p className="text-sm text-ink/80 leading-relaxed">
        <span className="font-semibold text-ink">Not medical advice.</span>{" "}
        This tool explains lab results in plain language for educational purposes
        only. It doesn't diagnose or treat anything — always check with a
        qualified doctor before acting on your results.
      </p>
    </div>
  )
}
