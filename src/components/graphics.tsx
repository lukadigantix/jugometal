export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className ?? "h-3 w-3"} aria-hidden>
      <path
        d="M4 2l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className ?? "h-3 w-5"} aria-hidden>
      <path
        d="M7 1L2 6l5 5M2 6h17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className ?? "h-3 w-5"} aria-hidden>
      <path
        d="M13 1l5 5-5 5M18 6H1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "h-4 w-4"} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <circle cx="8" cy="8" r="6.4" />
        <ellipse cx="8" cy="8" rx="2.9" ry="6.4" />
        <line x1="1.6" y1="8" x2="14.4" y2="8" />
      </g>
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "h-4 w-4"} aria-hidden>
      <path
        d="M13.4 9.6a5.6 5.6 0 0 1-7-7 5.9 5.9 0 1 0 7 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "h-4 w-4"} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="8" cy="8" r="3.2" />
        <path d="M8 1.2v1.8M8 13v1.8M1.2 8H3M13 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M12.8 3.2l-1.3 1.3M4.5 11.5l-1.3 1.3" />
      </g>
    </svg>
  );
}

export function Person({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "h-4 w-4"} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="8" cy="5" r="2.6" />
        <path d="M2.8 14c.9-3 3-4.4 5.2-4.4S12.3 11 13.2 14" />
      </g>
    </svg>
  );
}

export function Bag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "h-4 w-4"} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M3 5.2h10l-.7 8.3H3.7L3 5.2Z" />
        <path d="M5.6 5V4a2.4 2.4 0 0 1 4.8 0v1" />
      </g>
    </svg>
  );
}

/* Jugometal logo - vektorizovan iz logo.png (potrace): crveno-crni na svetloj
 * podlozi, crveno-beli (logo-white.svg) na tamnoj (footer). */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <img
      src={onDark ? "/logo-white.svg" : "/logo.svg"}
      alt="Jugometal Svilajnac"
      width={512}
      height={128}
      className={className ?? "h-7 w-auto md:h-8"}
    />
  );
}
