import type { CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   NEOTRAVEL — DESIGN SYSTEM
   ---------------------------------------------------------------------
   Direction : "Transporteur professionnel" — identité sobre et rassurante,
   pensée pour une société de transport (et non un produit tech) : fond
   clair, vert de marque utilisé avec parcimonie, terracotta en accent
   d'appel à l'action, typographie Manrope/Inter, ombres légères.
   ---------------------------------------------------------------------
   Palette nommée :
   - ink/ink2     : fonds de page (blanc / gris très clair et chaud)
   - panel/panelHi: surfaces des cartes et éléments en relief
   - white        : texte principal (quasi-noir, légèrement vert)
   - ash/ashDim   : texte secondaire / tertiaire
   - emerald*     : vert de marque (boutons, liens, statut "en ligne")
   - amber*       : accent chaud terracotta, réservé aux CTA
═══════════════════════════════════════════════════════════════════════ */

export const T = {
  // Fonds
  ink:        "#ffffff",
  ink2:       "#f7f8f6",
  panel:      "#ffffff",
  panelHi:    "#f7f8f6",
  panelHi2:   "#eef0ec",

  // Lignes / bordures
  line:       "#e7e9e4",
  lineSoft:   "rgba(28,37,33,0.045)",
  lineStrong: "#d6d9d2",

  // Texte
  white:      "#1c2521",
  ash:        "#6b7570",
  ashDim:     "#9aa39d",

  // Accent de marque (vert NeoTravel)
  emerald:    "#0f6e5c",
  emeraldBr:  "#15876f",
  emeraldDp:  "#0b5346",
  emeraldInk: "#ffffff",

  // Accent chaud — CTA uniquement
  amber:      "#e08a4b",
  amberDp:    "#b96b34",

  danger:     "#c0432a",

  // Typographie
  fontDisplay: "'Manrope', 'Inter', system-ui, -apple-system, sans-serif",
  fontBody:    "'Inter', system-ui, -apple-system, sans-serif",

  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 26,
} as const;

export const card = (extra?: CSSProperties): CSSProperties => ({
  background: T.panel,
  border: `1px solid ${T.line}`,
  borderRadius: T.radiusMd,
  boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
  ...extra,
});

export const eyebrow = (extra?: CSSProperties): CSSProperties => ({
  fontFamily: T.fontBody,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: T.emerald,
  ...extra,
});

export const fmtEUR = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
