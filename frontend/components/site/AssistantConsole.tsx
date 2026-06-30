"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { T, fmtEUR } from "./theme";
import { IcoSend, IcoDownload } from "./icons";
import { askAssistant, newSessionId, mergeTrip } from "../../lib/n8n";
import type { ChatTurn, TripData } from "../../lib/n8n";

/* ═══════════════════════════════════════════════════════════════
   CONSOLE ASSISTANT — connectée au webhook n8n (lib/n8n.ts).
   La carte récapitulative à gauche se remplit en direct à partir des
   données extraites par le workflow, comme un vrai devis NeoTravel.
═══════════════════════════════════════════════════════════════ */

interface Msg {
  id: number;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const EMPTY_TRIP: TripData = {
  depart: null,
  destination: null,
  passagers: null,
  vehicule: null,
  distance: null,
  prix: null,
  pdfUrl: null,
};

const INIT_MSGS: Msg[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Bonjour. Décrivez votre trajet de groupe — villes, date, nombre de personnes — et je prépare votre devis en direct.",
  },
];

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <span
        style={{
          fontFamily: T.fontBody,
          fontSize: 12.5,
          fontWeight: 500,
          color: T.ash,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: T.fontBody,
          fontSize: 13.5,
          fontWeight: 600,
          color: value ? T.white : T.ashDim,
          textAlign: "right",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function AssistantConsole() {
  const [msgs, setMsgs] = useState<Msg[]>(INIT_MSGS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<TripData>(EMPTY_TRIP);
  const [animIds, setAnimIds] = useState<number[]>([]);
  const sessionRef = useRef<string>("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionRef.current = newSessionId();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, loading]);

  const send = useCallback(
    async (text: string) => {
      if (loading || !text.trim()) return;
      const uid = Date.now();
      const history: ChatTurn[] = msgs.map((m) => ({ role: m.role, content: m.content }));
      setMsgs((p) => [...p, { id: uid, role: "user", content: text }]);
      setLoading(true);

      try {
        const result = await askAssistant(text, sessionRef.current, history);
        const aid = Date.now() + 1;
        setMsgs((p) => [...p, { id: aid, role: "assistant", content: result.reply }]);
        setAnimIds((p) => [...p, aid]);
        setTrip((prev) => mergeTrip(prev, result.trip));
        setTimeout(() => setAnimIds((p) => p.filter((x) => x !== aid)), 600);
      } catch {
        const aid = Date.now() + 1;
        setMsgs((p) => [
          ...p,
          {
            id: aid,
            role: "assistant",
            content: "La connexion à l'assistant a échoué. Vérifiez votre réseau et réessayez dans un instant.",
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, msgs],
  );

  const handleSend = () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    send(t);
  };

  const chatHeight = Math.min(380 + Math.max(msgs.length - 1, 0) * 86, 620);

  return (
    <section id="assistant" style={{ position: "relative" }}>
      {/* halo doux qui fait ressortir l'ensemble récapitulatif + chat du reste de la page */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-48px -24px",
          background: `radial-gradient(ellipse 65% 65% at 50% 45%, rgba(15,110,92,0.09), transparent 70%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="rt-hero"
        style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 24, alignItems: "stretch" }}
      >
        {/* ── Carte récapitulative (gauche) ───────────────────────────── */}
        <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              position: "relative",
              background: T.panel,
              border: `1px solid ${T.lineStrong}`,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 16px 44px rgba(28,37,33,0.14), 0 2px 8px rgba(28,37,33,0.06)",
            }}
          >
            <div style={{ padding: "20px 22px 6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: T.fontBody,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: T.emerald,
                  }}
                >
                  Récapitulatif
                </span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: trip.prix ? T.emerald : T.lineStrong,
                    animation: trip.prix ? "rt-blink 2.4s ease-in-out infinite" : "none",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: trip.depart ? T.white : T.ashDim,
                  lineHeight: 1.25,
                }}
              >
                {trip.depart && trip.destination ? `${trip.depart} → ${trip.destination}` : "En attente de votre message…"}
              </p>
            </div>

            <div style={{ padding: "4px 22px" }}>
              <SummaryRow label="Départ" value={trip.depart} />
              <SummaryRow label="Destination" value={trip.destination} />
              <SummaryRow label="Passagers" value={trip.passagers ? `${trip.passagers} pers.` : null} />
              <SummaryRow label="Véhicule" value={trip.vehicule} />
              <SummaryRow label="Distance" value={trip.distance ? `${trip.distance} km` : null} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0" }}>
                <span
                  style={{
                    fontFamily: T.fontBody,
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: T.ash,
                  }}
                >
                  Prix estimé
                </span>
                <span
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: trip.prix ? 22 : 13.5,
                    fontWeight: 800,
                    color: trip.prix ? T.emeraldDp : T.ashDim,
                  }}
                >
                  {trip.prix ? fmtEUR(trip.prix) : "—"}
                </span>
              </div>
            </div>

            <div style={{ padding: "14px 22px 22px" }}>
              {trip.pdfUrl ? (
                <a
                  href={trip.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: T.emerald,
                    color: T.emeraldInk,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "12px 16px",
                    borderRadius: 11,
                    textDecoration: "none",
                  }}
                >
                  <IcoDownload size={14} /> Télécharger le devis (PDF)
                </a>
              ) : (
                <p style={{ fontSize: 11.5, color: T.ashDim, textAlign: "center", lineHeight: 1.6 }}>
                  Le récapitulatif se complète automatiquement
                  <br />à mesure de la conversation.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Console de discussion (droite) ──────────────────────────── */}
        <div style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
          {/* ring discret signalant l'élément central de la page */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -7,
              borderRadius: 27,
              border: `1.5px solid ${T.emerald}`,
              opacity: 0.18,
              pointerEvents: "none",
              zIndex: 0,
              animation: "rt-ring-pulse 4.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              height: chatHeight,
              borderRadius: 20,
              border: `1px solid ${T.lineStrong}`,
              background: T.panel,
              boxShadow: "0 16px 44px rgba(28,37,33,0.14), 0 2px 8px rgba(28,37,33,0.06)",
              transition: "height .4s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "14px 18px",
                borderBottom: `1px solid ${T.line}`,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: T.emerald,
                  animation: "rt-blink 2.5s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.white }}>Assistant NeoTravel</span>
              <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ashDim }}>— en ligne</span>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                backgroundImage: `radial-gradient(${T.lineSoft} 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
            >
              {msgs.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    animation: animIds.includes(m.id) ? "rt-fade .35s ease" : "none",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      fontSize: 14,
                      lineHeight: 1.6,
                      padding: "11px 15px",
                      borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                      background:
                        m.role === "user"
                          ? T.emerald
                          : m.isError
                          ? "#fdece8"
                          : T.panelHi,
                      color: m.role === "user" ? T.emeraldInk : m.isError ? T.danger : T.white,
                      border: m.role === "user" ? "none" : `1px solid ${T.line}`,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      background: T.panelHi,
                      border: `1px solid ${T.line}`,
                      borderRadius: "4px 14px 14px 14px",
                      padding: "12px 16px",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: T.ash,
                          animation: `rt-blink 1.1s ease-in-out ${i * 0.16}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div style={{ padding: "10px 14px 14px", flexShrink: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: T.ink2,
                  borderRadius: 13,
                  padding: "10px 14px",
                  border: `1px solid ${T.line}`,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Décrivez votre trajet de groupe…"
                  disabled={loading}
                  style={{ flex: 1, background: "transparent", border: "none", fontSize: 14, color: T.white, opacity: loading ? 0.5 : 1 }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: loading || !input.trim() ? T.panelHi2 : T.emerald,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: loading || !input.trim() ? T.ashDim : T.emeraldInk,
                  }}
                >
                  <IcoSend size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
