"use client";
import { T } from "./theme";
import { IcoStar } from "./icons";

export default function TestiCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
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
        gap: 16,
        boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: 2 }}>
        {[...Array(5)].map((_, i) => (
          <IcoStar key={i} />
        ))}
      </div>
      <p style={{ fontSize: 14, color: T.white, lineHeight: 1.7, fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 6, borderTop: `1px solid ${T.line}` }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.panelHi,
            border: `1px solid ${T.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.emerald,
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {author[0]}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{author}</p>
          <p style={{ fontSize: 11.5, color: T.ashDim }}>
            {role} · {company}
          </p>
        </div>
      </div>
    </div>
  );
}
