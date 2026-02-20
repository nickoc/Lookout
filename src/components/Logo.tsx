export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size}>
      <path className="logo-beam" d="M18 18 L34 6 A20 20 0 0 0 28 2 Z" fill="url(#beamGrad)" opacity="0"/>
      <circle className="logo-ring-outer" cx="18" cy="18" r="15" stroke="url(#ringGrad)" strokeWidth="2" fill="none"/>
      <circle className="logo-ring-inner" cx="18" cy="18" r="9" stroke="#14b8a6" strokeWidth="1.5" fill="rgba(20,184,166,0.06)"/>
      <circle className="logo-pupil" cx="18" cy="18" r="4" fill="url(#pupilGrad)"/>
      <circle className="logo-lens" cx="22" cy="14" r="2" fill="white" opacity="0"/>
      <rect className="logo-shimmer" x="6" y="17" width="8" height="2" rx="1" fill="white" opacity="0"/>
      <defs>
        <linearGradient id="ringGrad" x1="3" y1="3" x2="33" y2="33">
          <stop offset="0%" stopColor="#14b8a6"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
        <radialGradient id="pupilGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#14b8a6"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </radialGradient>
        <linearGradient id="beamGrad" x1="18" y1="18" x2="34" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
