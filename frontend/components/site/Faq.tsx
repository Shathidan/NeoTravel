"use client";
import { useState } from "react";
import { T } from "./theme";
import { IcoChevronDown } from "./icons";

export interface FaqItem {
  q: string;
  a: string;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            style={{
              background: T.panel,
              border: `1px solid ${isOpen ? T.lineStrong : T.line}`,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: isOpen ? "0 4px 14px rgba(28,37,33,0.06)" : "none",
              transition: "border-color .2s, box-shadow .2s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "none",
                border: "none",
                padding: "18px 20px",
                textAlign: "left",
                fontSize: 14.5,
                fontWeight: 600,
                color: T.white,
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  flexShrink: 0,
                  color: T.emerald,
                  transition: "transform .25s",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <IcoChevronDown size={16} />
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 200 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height .35s ease, opacity .3s ease",
                overflow: "hidden",
              }}
            >
              <p style={{ padding: "0 20px 20px", fontSize: 13.5, color: T.ash, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
