"use client";
import type { ReactNode } from "react";
import { T } from "./theme";

export interface Vehicle {
  fareClass: string;
  name: string;
  capacity: string;
  description: string;
  amenities: { icon: ReactNode; label: string }[];
}

export default function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: T.fontMono,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: T.emeraldDp,
            background: "rgba(63,207,156,0.14)",
            border: `1px solid rgba(63,207,156,0.25)`,
            borderRadius: 20,
            padding: "4px 10px",
          }}
        >
          {v.fareClass}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.ash }}>{v.capacity}</span>
      </div>

      <p style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, color: T.white }}>{v.name}</p>
      <p style={{ fontSize: 13, color: T.ash, lineHeight: 1.65 }}>{v.description}</p>

      <div style={{ display: "flex", gap: 14, paddingTop: 8, borderTop: `1px solid ${T.line}` }}>
        {v.amenities.map((a) => (
          <span
            key={a.label}
            title={a.label}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.ashDim }}
          >
            <span style={{ color: T.emeraldBr }}>{a.icon}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
