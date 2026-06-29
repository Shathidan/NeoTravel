"use client";
import { useState } from "react";
import Link from "next/link";
import { T } from "./theme";
import { IcoBus, IcoArrowRight } from "./icons";

const NAV = [
  { href: "/flotte", label: "Notre flotte" },
  { href: "/entreprises", label: "Solutions" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "rgba(10,18,14,0.82)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.panelHi,
              border: `1px solid ${T.lineStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.emeraldBr,
            }}
          >
            <IcoBus size={16} />
          </div>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: T.white }}>
            NeoTravel
          </span>
        </Link>

        <nav className="rt-nav-desktop" style={{ display: "none", alignItems: "center", gap: 28, flex: 1 }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{ fontSize: 13.5, fontWeight: 500, color: active === n.href ? T.white : T.ash, textDecoration: "none" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link
            href="/#assistant"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: T.emeraldInk,
              textDecoration: "none",
              background: `linear-gradient(135deg, ${T.emeraldBr}, ${T.emerald})`,
              padding: "8px 16px",
              borderRadius: 10,
              whiteSpace: "nowrap",
            }}
          >
            Obtenir un devis <IcoArrowRight size={13} />
          </Link>

          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
            className="rt-nav-toggle"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: T.panelHi,
              border: `1px solid ${T.lineStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.white,
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* panneau mobile */}
      {open && (
        <div className="rt-nav-mobile" style={{ borderTop: `1px solid ${T.line}`, background: T.ink2 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 4px",
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: active === n.href ? T.white : T.ash,
                  textDecoration: "none",
                  borderBottom: `1px solid ${T.lineSoft}`,
                }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .rt-nav-toggle { display: flex; }
        @media (min-width: 760px) {
          .rt-nav-desktop { display: flex !important; }
          .rt-nav-toggle { display: none !important; }
          .rt-nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
