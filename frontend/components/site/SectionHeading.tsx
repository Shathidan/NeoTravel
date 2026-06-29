"use client";
import { T } from "./theme";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div style={{ textAlign: align, marginBottom: 44 }}>
      <span
        style={{
          display: "block",
          fontFamily: T.fontMono,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: T.emeraldBr,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: T.fontDisplay,
          fontSize: "clamp(24px,3.4vw,40px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: T.white,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: 15,
            color: T.ash,
            maxWidth: 560,
            margin: align === "center" ? "14px auto 0" : "14px 0 0",
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
