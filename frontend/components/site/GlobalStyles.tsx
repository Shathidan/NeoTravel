"use client";
import { T } from "./theme";

/* ═══════════════════════════════════════════════════════════════
   STYLES GLOBAUX PARTAGÉS — importé une fois par page (layout léger,
   pas de app/layout.tsx imposé ici pour rester compatible avec ton
   arborescence existante).
═══════════════════════════════════════════════════════════════ */
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${T.ink}; color: ${T.white}; }
      a { color: inherit; }
      input, button, textarea { font-family: inherit; }
      input::placeholder { color: ${T.ashDim}; }
      input:focus { outline: none; }
      button { cursor: pointer; }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: ${T.lineStrong}; border-radius: 3px; }

      @keyframes rt-blink   { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
      @keyframes rt-fade    { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes rt-rise    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes rt-glow    { 0%,100% { box-shadow: 0 0 0 0 rgba(63,207,156,0); } 50% { box-shadow: 0 0 0 3px rgba(63,207,156,0.10); } }
      @keyframes rt-drift   { 0% { background-position: 0 0; } 100% { background-position: 200px 0; } }
      @keyframes rt-bus     { 0% { left: 0%; } 100% { left: calc(100% - 22px); } }
      @keyframes rt-spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
      }

      /* Grille responsive partagée */
      @media (min-width: 900px) {
        .rt-hero { flex-direction: row !important; }
        .rt-footer-grid { flex-direction: row !important; text-align: left !important; }
        .rt-segments { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (min-width: 700px) {
        .rt-steps { grid-template-columns: repeat(3, 1fr) !important; }
        .rt-stats { grid-template-columns: repeat(3, 1fr) !important; }
        .rt-testi { grid-template-columns: repeat(3, 1fr) !important; }
        .rt-fleet { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (min-width: 1000px) {
        .rt-fleet { grid-template-columns: repeat(4, 1fr) !important; }
      }
      @media (min-width: 600px) {
        .rt-footer-links { flex-direction: row !important; }
      }
    `}</style>
  );
}
