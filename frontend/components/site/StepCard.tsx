"use client";
import type { ReactNode } from "react";
import { T } from "./theme";

export default function StepCard({
  code,
  icon,
  title,
  body,
}: {
  code: string;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: "26px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: T.fontMono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: T.ashDim,
          }}
        >
          {code}
        </span>
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
      </div>
      <p style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.white }}>{title}</p>
      <p style={{ fontSize: 13.5, color: T.ash, lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}
