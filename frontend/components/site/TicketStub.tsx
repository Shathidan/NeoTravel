"use client";
import type { ReactNode } from "react";
import { T } from "./theme";

/* ═══════════════════════════════════════════════════════════════
   TICKET STUB — écho discret du billet signature, utilisé pour les
   statistiques chiffrées. Bordure perforée sur le bord supérieur,
   chiffre en monospace façon compteur de tableau d'affichage.
═══════════════════════════════════════════════════════════════ */
export default function TicketStub({
  value,
  unit,
  label,
  icon,
}: {
  value: string;
  unit?: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: "30px 22px 26px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* bord perforé */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundImage: `radial-gradient(circle, ${T.ink} 1.6px, transparent 1.6px)`,
          backgroundSize: "10px 1px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0 -1px",
        }}
      />
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          margin: "0 auto 18px",
          background: T.panelHi,
          border: `1px solid ${T.lineStrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.emeraldBr,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontFamily: T.fontMono,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: T.white,
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{ fontSize: 19, color: T.ash }}>{unit}</span>
      </p>
      <p style={{ fontSize: 13, color: T.ash, marginTop: 10, lineHeight: 1.5 }}>{label}</p>
    </div>
  );
}
