export function AtelierDocLogo({ compact=false }) {
  return (
    <div className="brandMark" aria-label="AtelierDoc">
      <svg width="34" height="34" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="adg" x1="8" x2="56" y1="8" y2="56">
            <stop offset="0" stopColor="#16324A"/>
            <stop offset="0.55" stopColor="#6F8F7A"/>
            <stop offset="1" stopColor="#C5A15A"/>
          </linearGradient>
        </defs>
        <path d="M15 14h20a6 6 0 0 1 6 6v26H21a6 6 0 0 1-6-6V14Z" fill="url(#adg)" opacity=".95"/>
        <path d="M27 22h19a5 5 0 0 1 5 5v23H32a5 5 0 0 1-5-5V22Z" fill="#17263B" opacity=".92"/>
        <path d="M25 16l18 16-18 16-18-16 18-16Z" fill="#F8F9F7" opacity=".92"/>
        <circle cx="25" cy="32" r="5.5" fill="#6F8F7A"/>
      </svg>
      {!compact && (
        <div className="brandText">
          <strong>AtelierDoc</strong>
          <span>Des documents aux décisions</span>
        </div>
      )}
    </div>
  );
}
