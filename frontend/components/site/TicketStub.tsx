"use client";
import type { ReactNode } from "react";
import { T } from "./theme";

/* ═══════════════════════════════════════════════════════════════
   STAT CARD — chiffre clé mis en avant, présentation sobre.
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
        boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
      }}
    >
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
          color: T.emerald,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 34,
          fontWeight: 800,
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
