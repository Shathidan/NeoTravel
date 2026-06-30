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
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; scroll-padding-top: 76px; }
      body { background: ${T.ink}; color: ${T.white}; }
      a { color: inherit; }
      input, button, textarea { font-family: inherit; }
      input::placeholder { color: ${T.ashDim}; }
      input:focus { outline: none; }
      button { cursor: pointer; }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: ${T.lineStrong}; border-radius: 3px; }

      @keyframes rt-blink   { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      @keyframes rt-fade    { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes rt-bus     { 0% { left: 0%; } 100% { left: calc(100% - 22px); } }

      /* Fond animé du hero — formes organiques, transform + opacity uniquement */
      @keyframes rt-blob-a  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(36px,-28px) scale(1.08); } }
      @keyframes rt-blob-b  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,24px) scale(1.06); } }
      @keyframes rt-blob-c  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(22px,20px) scale(0.94); } }

      /* Ring pulsant discret autour de la fenêtre de chat */
      @keyframes rt-ring-pulse { 0%,100% { opacity: 0.16; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.012); } }

      /* Micro-interactions de la console assistant */
      @keyframes rt-pop-in       { 0% { opacity: 0; transform: scale(0.85) translateY(4px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes rt-row-flash    { 0% { background: rgba(15,110,92,0.14); } 100% { background: transparent; } }
      @keyframes rt-typing-bounce{ 0%,60%,100% { transform: translateY(0); opacity: 0.45; } 30% { transform: translateY(-4px); opacity: 1; } }
      @keyframes rt-status-ping  { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(2.6); opacity: 0; } }

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
