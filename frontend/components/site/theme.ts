import type { CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   NEOTRAVEL — DESIGN SYSTEM
   ---------------------------------------------------------------------
   Direction : "Manifeste de transport" — l'identité visuelle s'inspire
   du véritable billet/devis que NeoTravel génère (cf. devis email + PDF) :
   un fond profond couleur forêt, une carte-billet couleur papier avec
   bordure perforée, des champs en monospace comme un tableau de départs,
   et l'émeraude de marque comme unique accent chromatique fort.
   ---------------------------------------------------------------------
   Palette nommée (6 rôles) :
   - ink      : fond de page (forêt noircie, pas un noir neutre)
   - panel    : surface des cartes sombres
   - paper    : couleur "billet papier" — réservée au composant signature
   - emerald  : accent de marque (texte de marque, CTA, statut "en ligne")
   - amber    : second accent, réservé aux tampons / alertes ponctuelles
   - ash      : texte atténué sur fond sombre
═══════════════════════════════════════════════════════════════════════ */

export const T = {
  // Fonds
  ink:        "#0a120e",
  ink2:       "#0d1813",
  panel:      "#121e18",
  panelHi:    "#16261f",
  panelHi2:   "#1c2f26",

  // Lignes / bordures
  line:       "rgba(244,241,232,0.09)",
  lineSoft:   "rgba(244,241,232,0.05)",
  lineStrong: "rgba(244,241,232,0.16)",

  // Billet papier (composant signature)
  paper:      "#f3efe3",
  paperDim:   "#e3ddc9",
  paperLine:  "rgba(15,28,22,0.12)",

  // Texte
  white:      "#f6f7f4",
  ash:        "#93a59c",
  ashDim:     "#5f7268",

  // Accent de marque
  emerald:    "#1f9d78",
  emeraldBr:  "#3fcf9c",
  emeraldDp:  "#0e5c44",
  emeraldInk: "#06140f",

  // Second accent — tampon / tag
  amber:      "#e8b768",
  amberDp:    "#a9803f",

  danger:     "#e2674a",

  // Typographie
  fontDisplay: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
  fontBody:    "'Inter', system-ui, -apple-system, sans-serif",
  fontMono:    "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace",

  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 26,
} as const;

export const card = (extra?: CSSProperties): CSSProperties => ({
  background: T.panel,
  border: `1px solid ${T.line}`,
  borderRadius: T.radiusMd,
  ...extra,
});

export const eyebrow = (extra?: CSSProperties): CSSProperties => ({
  fontFamily: T.fontMono,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: T.emeraldBr,
  ...extra,
});

export const fmtEUR = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
