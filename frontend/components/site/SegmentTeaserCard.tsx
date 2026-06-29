"use client";
import type { ReactNode } from "react";
import { T } from "./theme";
import { IcoArrowRight } from "./icons";

export default function SegmentTeaserCard({
  icon,
  title,
  blurb,
}: {
  icon: ReactNode;
  title: string;
  blurb: string;
}) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
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
      <p style={{ fontFamily: T.fontDisplay, fontSize: 16.5, fontWeight: 700, color: T.white }}>{title}</p>
      <p style={{ fontSize: 13, color: T.ash, lineHeight: 1.65, flex: 1 }}>{blurb}</p>
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: T.emeraldBr }}>
        Voir la solution dédiée <IcoArrowRight size={12} />
      </span>
    </div>
  );
}
