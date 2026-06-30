"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { T, fmtEUR } from "./theme";
import { IcoSend, IcoDownload, IcoArrowRight, IcoBus } from "./icons";
import { askAssistant, newSessionId, mergeTrip } from "../../lib/n8n";
import type { ChatTurn, TripData } from "../../lib/n8n";

/* ═══════════════════════════════════════════════════════════════
   CONSOLE ASSISTANT — connectée au webhook n8n (lib/n8n.ts).
   Élément central de la page : la carte récapitulative à gauche se
   remplit en direct à partir des données extraites par le workflow,
   comme un vrai devis NeoTravel.
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

/* Indicateur "en ligne" — un point fixe + un ping qui s'estompe autour, discret. */
function StatusDot({ active = true }: { active?: boolean }) {
  return (
    <span style={{ position: "relative", width: 8, height: 8, display: "inline-flex", flexShrink: 0 }}>
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: T.emerald,
            animation: "rt-status-ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
      )}
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? T.emerald : T.lineStrong,
        }}
      />
    </span>
  );
}

/* Avatar de l'assistant — humanise la conversation. */
function Avatar() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.emeraldBr}, ${T.emeraldDp})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#ffffff",
        fontFamily: T.fontDisplay,
        fontSize: 11,
        fontWeight: 800,
        boxShadow: "0 2px 6px rgba(15,110,92,0.3)",
      }}
    >
      N
    </div>
  );
}

function SummaryRow({ label, value, highlighted }: { label: string; value: string | null; highlighted?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 8px",
        margin: "0 -8px",
        borderRadius: 8,
        borderBottom: `1px solid ${T.line}`,
        animation: highlighted ? "rt-row-flash 0.9s ease" : "none",
      }}
    >
      <span style={{ fontFamily: T.fontBody, fontSize: 12.5, fontWeight: 500, color: T.ash }}>{label}</span>
      <span
        style={{
          fontFamily: T.fontBody,
          fontSize: 13.5,
          fontWeight: 600,
          color: value ? T.white : T.ashDim,
          textAlign: "right",
          transition: "color .3s ease",
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
  const [justFilled, setJustFilled] = useState<Set<keyof TripData>>(new Set());
  const sessionRef = useRef<string>("");
  const prevTripRef = useRef<TripData>(EMPTY_TRIP);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionRef.current = newSessionId();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, loading]);

  // Détecte les champs qui viennent de se remplir, pour un feedback visuel bref (pure observation, ne touche pas à la logique trip).
  useEffect(() => {
    const prev = prevTripRef.current;
    const changed = (Object.keys(trip) as (keyof TripData)[]).filter((k) => trip[k] !== null && trip[k] !== prev[k]);
    prevTripRef.current = trip;
    if (changed.length === 0) return;
    setJustFilled(new Set(changed));
    const t = setTimeout(() => setJustFilled(new Set()), 900);
    return () => clearTimeout(t);
  }, [trip]);

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
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          alignItems: "stretch",
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        {/* ── Carte récapitulative (gauche) ───────────────────────────── */}
        <div style={{ flex: "0 0 360px", display: "flex", flexDirection: "column" }}>
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
            {/* en-tête distinct, plus de présence visuelle */}
            <div style={{ padding: "18px 22px", background: T.panelHi, borderBottom: `1px solid ${T.line}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: T.panel,
                      border: `1px solid ${T.lineStrong}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.emerald,
                      flexShrink: 0,
                    }}
                  >
                    <IcoBus size={13} />
                  </span>
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
                </div>
                <StatusDot active={!!trip.prix} />
              </div>

              {trip.depart && trip.destination ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.white }}>
                    {trip.depart}
                  </span>
                  <IcoArrowRight size={14} color={T.emerald} />
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.white }}>
                    {trip.destination}
                  </span>
                </div>
              ) : (
                <p style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.ashDim, lineHeight: 1.25 }}>
                  En attente de votre message…
                </p>
              )}
            </div>

            <div style={{ padding: "8px 22px 4px" }}>
              <SummaryRow label="Départ" value={trip.depart} highlighted={justFilled.has("depart")} />
              <SummaryRow label="Destination" value={trip.destination} highlighted={justFilled.has("destination")} />
              <SummaryRow
                label="Passagers"
                value={trip.passagers ? `${trip.passagers} pers.` : null}
                highlighted={justFilled.has("passagers")}
              />
              <SummaryRow label="Véhicule" value={trip.vehicule} highlighted={justFilled.has("vehicule")} />
              <SummaryRow
                label="Distance"
                value={trip.distance ? `${trip.distance} km` : null}
                highlighted={justFilled.has("distance")}
              />

              {/* prix estimé — mis en valeur comme l'aboutissement du récapitulatif */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 6,
                  padding: trip.prix ? "13px 14px" : "13px 2px",
                  borderRadius: 12,
                  background: trip.prix ? "rgba(15,110,92,0.07)" : "transparent",
                  transition: "background .3s ease, padding .3s ease",
                }}
              >
                <span style={{ fontFamily: T.fontBody, fontSize: 12.5, fontWeight: 600, color: trip.prix ? T.emeraldDp : T.ash }}>
                  Prix estimé
                </span>
                <span
                  key={trip.prix ?? "empty"}
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: trip.prix ? 27 : 13.5,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    color: trip.prix ? T.emeraldDp : T.ashDim,
                    animation: trip.prix ? "rt-pop-in .45s cubic-bezier(.34,1.56,.64,1)" : "none",
                  }}
                >
                  {trip.prix ? fmtEUR(trip.prix) : "—"}
                </span>
              </div>
            </div>

            <div style={{ padding: "10px 22px 22px" }}>
              {trip.pdfUrl ? (
                <a
                  href={trip.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rt-pdf-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: `linear-gradient(135deg, ${T.emeraldBr}, ${T.emeraldDp})`,
                    color: T.emeraldInk,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "13px 16px",
                    borderRadius: 11,
                    textDecoration: "none",
                    boxShadow: "0 6px 16px rgba(15,110,92,0.22)",
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
                gap: 10,
                padding: "15px 18px",
                background: T.panelHi,
                borderBottom: `1px solid ${T.line}`,
                flexShrink: 0,
              }}
            >
              <StatusDot active />
              <span style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.white }}>Assistant NeoTravel</span>
              <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ashDim }}>— en ligne</span>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                backgroundImage: `radial-gradient(${T.lineSoft} 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
            >
              {msgs.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-end",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    animation: animIds.includes(m.id) ? "rt-fade .4s cubic-bezier(.16,1,.3,1)" : "none",
                  }}
                >
                  {m.role === "assistant" && <Avatar />}
                  <div
                    style={{
                      maxWidth: "78%",
                      fontSize: 14,
                      lineHeight: 1.6,
                      padding: "11px 15px",
                      borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      background:
                        m.role === "user"
                          ? `linear-gradient(135deg, ${T.emeraldBr}, ${T.emerald})`
                          : m.isError
                          ? "#fdece8"
                          : T.panelHi,
                      color: m.role === "user" ? T.emeraldInk : m.isError ? T.danger : T.white,
                      border: m.role === "user" ? "none" : `1px solid ${T.line}`,
                      boxShadow: m.role === "user" ? "0 4px 12px rgba(15,110,92,0.22)" : "0 1px 2px rgba(28,37,33,0.04)",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", justifyContent: "flex-start" }}>
                  <Avatar />
                  <div
                    style={{
                      background: T.panelHi,
                      border: `1px solid ${T.line}`,
                      borderRadius: "4px 16px 16px 16px",
                      padding: "13px 16px",
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      boxShadow: "0 1px 2px rgba(28,37,33,0.04)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: T.emerald,
                          animation: `rt-typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
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
                className="rt-chat-input"
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
                  className="rt-send-btn"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: loading || !input.trim() ? T.panelHi2 : `linear-gradient(135deg, ${T.emeraldBr}, ${T.emerald})`,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: loading || !input.trim() ? T.ashDim : T.emeraldInk,
                    boxShadow: loading || !input.trim() ? "none" : "0 3px 10px rgba(15,110,92,0.25)",
                  }}
                >
                  <IcoSend size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rt-chat-input { transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
        .rt-chat-input:focus-within {
          border-color: ${T.emerald};
          box-shadow: 0 0 0 3px rgba(15,110,92,0.12);
          background: #ffffff;
        }
        .rt-send-btn { transition: transform .15s ease, box-shadow .15s ease; }
        .rt-send-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .rt-send-btn:active:not(:disabled) { transform: translateY(0) scale(0.94); }
        .rt-pdf-btn { transition: transform .15s ease, box-shadow .2s ease, filter .2s ease; }
        .rt-pdf-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .rt-pdf-btn:active { transform: translateY(0); }
      `}</style>
    </section>
  );
}
