/* ═══════════════════════════════════════════════════════════════
   ICÔNES — trait fin uniforme (stroke 1.6), aucune librairie externe
═══════════════════════════════════════════════════════════════ */
import type { CSSProperties } from "react";

type Props = { size?: number; color?: string; style?: CSSProperties };
const base = (p?: Props) => ({
  width: p?.size ?? 18,
  height: p?.size ?? 18,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: p?.color ?? "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: p?.style,
});

export const IcoBus = (p?: Props) => (
  <svg {...base(p)}>
    <rect x="2" y="4" width="14" height="12" rx="1.5" />
    <path d="M16 9h4l2 3v4h-6" />
    <circle cx="6.5" cy="18.5" r="2" />
    <circle cx="17.5" cy="18.5" r="2" />
    <line x1="2" y1="10" x2="16" y2="10" />
  </svg>
);
export const IcoSend = (p?: Props) => (
  <svg {...base(p)}>
    <line x1="21" y1="3" x2="10.5" y2="13.5" />
    <polygon points="21 3 14.5 21 10.5 13.5 3 9.5 21 3" />
  </svg>
);
export const IcoDownload = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M20 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
export const IcoArrowRight = (p?: Props) => (
  <svg {...base(p)}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);
export const IcoChevronDown = (p?: Props) => (
  <svg {...base(p)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
export const IcoCheck = (p?: Props) => (
  <svg {...base(p)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
export const IcoShield = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M12 21s7.5-3.7 7.5-9.6V5.3L12 3 4.5 5.3v6.1C4.5 17.3 12 21 12 21z" />
  </svg>
);
export const IcoClock = (p?: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);
export const IcoZap = (p?: Props) => (
  <svg {...base(p)}>
    <polygon points="12 2 4 14 11 14 10 22 20 9 13 9 12 2" />
  </svg>
);
export const IcoUsers = (p?: Props) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <circle cx="17.2" cy="8.6" r="2.4" />
    <path d="M21.5 19.5c0-2.7-1.7-4.7-4-5.4" />
  </svg>
);
export const IcoSnow = (p?: Props) => (
  <svg {...base(p)}>
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="4.2" y1="6" x2="19.8" y2="18" />
    <line x1="19.8" y1="6" x2="4.2" y2="18" />
  </svg>
);
export const IcoWifi = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M2 8.5a15 15 0 0 1 20 0" />
    <path d="M5.5 12a10 10 0 0 1 13 0" />
    <path d="M9 15.5a5 5 0 0 1 6 0" />
    <circle cx="12" cy="19" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const IcoPlug = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M9 2v5M15 2v5M7 7h10v4a5 5 0 0 1-10 0V7Z" />
    <path d="M12 16v6" />
  </svg>
);
export const IcoAccess = (p?: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="4.5" r="1.7" fill="currentColor" stroke="none" />
    <path d="M5 9.5h14M12 6.5v6.5l-4.5 7M12 13l4.5 7M8.5 13h7" />
  </svg>
);
export const IcoMail = (p?: Props) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <polyline points="3 6 12 13 21 6" />
  </svg>
);
export const IcoPhone = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M21 16.4v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3 18.7 18.7 0 0 1-5.7-5.7 19 19 0 0 1-3-8.3A2 2 0 0 1 3.8 2.5h3a2 2 0 0 1 2 1.7c.13.9.34 1.8.63 2.6a2 2 0 0 1-.45 2.1L7.9 10c1.2 2.3 3 4.1 5.3 5.3l1.1-1.1a2 2 0 0 1 2.1-.45c.85.3 1.7.5 2.6.63a2 2 0 0 1 1.7 2Z" />
  </svg>
);
export const IcoPin = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M20 10.5c0 6.3-8 11.5-8 11.5s-8-5.2-8-11.5a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10.5" r="2.6" />
  </svg>
);
export const IcoStar = (p?: Props) => (
  <svg
    width={p?.size ?? 13}
    height={p?.size ?? 13}
    viewBox="0 0 24 24"
    fill={p?.color ?? "#e08a4b"}
    stroke="none"
  >
    <polygon points="12 1.5 15.5 8.5 23 9.6 17.5 15 18.8 22.5 12 19 5.2 22.5 6.5 15 1 9.6 8.5 8.5 12 1.5" />
  </svg>
);
export const IcoBook = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M4 4.5C4 3.7 4.7 3 5.5 3H12v17H5.5A1.5 1.5 0 0 1 4 18.5Z" />
    <path d="M20 4.5c0-.8-.7-1.5-1.5-1.5H12v17h6.5a1.5 1.5 0 0 0 1.5-1.5Z" />
  </svg>
);
export const IcoCalendar = (p?: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2.5" x2="8" y2="6.5" />
    <line x1="16" y1="2.5" x2="16" y2="6.5" />
  </svg>
);
export const IcoTicket = (p?: Props) => (
  <svg {...base(p)}>
    <path d="M3 9a2 2 0 0 0 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
    <line x1="11" y1="6" x2="11" y2="18" strokeDasharray="2 3" />
  </svg>
);
export const IcoRoute = (p?: Props) => (
  <svg {...base(p)}>
    <circle cx="5" cy="6" r="2.2" />
    <circle cx="19" cy="18" r="2.2" />
    <path d="M6.8 7.6c1.5 1.6 3 1.3 4.7 1 2.3-.4 3.7 1 3.2 3-.4 1.7-2.1 2-3.7 2.8-1.2.6-1.7 1.7-1.2 2.7" strokeDasharray="2.2 3.4" />
  </svg>
);
