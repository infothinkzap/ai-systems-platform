export function WaveMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="27.5" fill="currentColor" fillOpacity=".04" stroke="currentColor" strokeWidth="2.5" />
    <g fill="currentColor">
      <path d="m15 14 9-5 6 3-2 6-6 2-1 6-5-1-4-6Z" />
      <path d="m21 25 7 3 2 5-4 4-3-5-3-3Z" />
      <path d="m38 10 9 3 6 7-4 5-7-2-2 6-5-5 3-6-4-3Z" />
    </g>
    <g stroke="currentColor" strokeWidth="2.7" strokeLinecap="round">
      <path d="M8 34c8-9 16 9 24 0s16 9 24 0" />
      <path d="M10 43c7-8 15 8 22 0s15 8 22 0" />
      <path d="M17 51c5-5 10 5 15 0s10 5 15 0" />
    </g>
  </svg>;
}

export function BrandLogo({ className = "" }: { className?: string }) {
  return <span className={`brand-logo ${className}`}><WaveMark className="brand-mark" /><span className="brand-wordmark">terrawave<span className="brand-period">.</span></span></span>;
}
