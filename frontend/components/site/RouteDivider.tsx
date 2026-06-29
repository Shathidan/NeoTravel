"use client";
import { T } from "./theme";
import { IcoBus } from "./icons";

export default function RouteDivider() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
      }}
      aria-hidden="true"
    >
      <div style={{ position: "relative", height: 26, display: "flex", alignItems: "center" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, flexShrink: 0, zIndex: 1 }} />
        <div style={{ flex: 1, borderTop: `1.5px dashed ${T.lineStrong}`, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: -10,
              left: 0,
              color: T.emerald,
              animation: "rt-bus 9s linear infinite alternate",
            }}
          >
            <IcoBus size={18} />
          </span>
        </div>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, flexShrink: 0, zIndex: 1 }} />
      </div>
    </div>
  );
}
