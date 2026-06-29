"use client";
import Link from "next/link";
import { T } from "./theme";
import { IcoBus, IcoMail, IcoPhone, IcoPin } from "./icons";

export default function Footer() {
  return (
    <footer style={{ marginTop: 96, background: T.ink2, borderTop: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div
          className="rt-footer-grid"
          style={{ display: "flex", flexDirection: "column", gap: 40, textAlign: "center" }}
        >
          {/* Marque */}
          <div
            style={{
              flex: "0 0 260px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "inherit" }}>
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
              <span style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.white }}>
                NeoTravel
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 230, color: T.ash }}>
              La plateforme qui digitalise la location d&rsquo;autocars de groupe sans perdre l&rsquo;humain.
            </p>
            <p style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.ashDim }}>
              « Digitaliser sans déshumaniser »
            </p>
          </div>

          {/* Liens */}
          <div
            className="rt-footer-links"
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32, justifyContent: "flex-end" }}
          >
            <div>
              <p
                style={{
                  fontFamily: T.fontMono,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: T.ashDim,
                  marginBottom: 14,
                }}
              >
                Produit
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/flotte", label: "Notre flotte" },
                  { href: "/entreprises", label: "Solutions par profil" },
                  { href: "/#comment", label: "Comment ça marche" },
                  { href: "/#faq", label: "FAQ" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{ fontSize: 13, color: T.ash, textDecoration: "none" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: T.fontMono,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: T.ashDim,
                  marginBottom: 14,
                }}
              >
                Contact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "inherit" }}>
                <a
                  href="mailto:contact@neotravel.fr"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.ash, textDecoration: "none" }}
                >
                  <IcoMail size={14} /> contact@neotravel.fr
                </a>
                <a
                  href="tel:+33412345678"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.ash, textDecoration: "none" }}
                >
                  <IcoPhone size={14} /> +33 4 12 34 56 78
                </a>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.ash }}>
                  <IcoPin size={14} /> Lyon, France
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${T.line}` }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.ashDim }}>
            © 2026 NeoTravel — Tous droits réservés
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Mentions légales", "Confidentialité", "CGU"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: T.ashDim, textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
