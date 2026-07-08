// Small, consistent line-icon set used throughout the app.
// Kept as one file so every icon shares the same stroke weight and grid.
const PATHS = {
  upload: (
    <>
      <path d="M12 15V4M12 4 8 8M12 4l4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.2a2 2 0 0 1-.3 1.05L5.8 17.4A2 2 0 0 0 7.5 20.5h9a2 2 0 0 0 1.7-3.1l-3.9-7.15A2 2 0 0 1 14 9.2V3" />
      <path d="M7.5 14.5h9" />
    </>
  ),
  chat: (
    <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4.4 3.3A.5.5 0 0 1 4 20V6a1 1 0 0 1 1-1Z" />
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  alert: (
    <>
      <path d="M12 3 22 20H2Z" />
      <path d="M12 10v4" />
      <path d="M12 17.2v.1" strokeLinecap="round" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m18 15-6-6-6 6" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.6-4.6M4 5v5h5" />
      <path d="M4 13a8 8 0 0 0 14.6 4.6M20 19v-5h-5" />
    </>
  ),
  send: <path d="M4 20 20.5 12 4 4l2 8Zm0 0 8-8" />,
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m5.6 5.6 2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </>
  ),
}

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 1.6 }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
