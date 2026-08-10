const FORMATS = [
  { label: "PDF", icon: DocIcon },
  { label: "DOCX", icon: DocIcon },
  { label: "PPTX", icon: SlideIcon },
  { label: "XLSX", icon: SheetIcon },
  { label: "CSV", icon: SheetIcon },
  { label: "ODS", icon: SheetIcon },
  { label: "Notion", icon: NotionIcon },
  { label: "Google Docs", icon: GoogleIcon },
  { label: "Scans", icon: ScanIcon },
  { label: "Slides", icon: SlideIcon },
  { label: "Sheets", icon: SheetIcon },
  { label: "Contracts", icon: DocIcon },
] as const;

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SlideIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SheetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M3 15h18M9 3v18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function NotionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 4.5h15v15h-15v-15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 4v8l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="9" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LogoCarousel() {
  const track = [...FORMATS, ...FORMATS];

  return (
    <div className="hex-marquee" aria-hidden>
      <div className="hex-marquee-track">
        {track.map(({ label, icon: Icon }, index) => (
          <span key={`${label}-${index}`} className="hex-marquee-item">
            <Icon className="hex-marquee-icon" />
            <span className="hex-marquee-label">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
