"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — single source of truth
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:        "#f5f5f7",
  surface:   "#ffffff",
  text:      "#1d1d1f",
  muted:     "#86868b",
  border:    "#e8e8ed",
  divider:   "#f0f0f5",
  accent:    "#0071e3",
  accentHov: "#0077ed",
  success:   "#34c759",
  inactive:  "#d1d1d6",
  font:      "'Inter','SF Pro Display',system-ui,-apple-system,sans-serif",
} as const;

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface Msg  { id: number; role: "assistant"|"user"; content: string; }
interface Trip {
  depart:      string|null;
  destination: string|null;
  passagers:   number|null;
  vehicule:    string|null;
  prix:        number|null;
}

/* ═══════════════════════════════════════════════════════════════
   INITIAL STATE
═══════════════════════════════════════════════════════════════ */
const INIT_MSGS: Msg[] = [{
  id: 1,
  role: "assistant",
  content: "Bonjour ! Décrivez votre projet de transport en quelques mots — ville de départ, destination, nombre de personnes. Je m'occupe du reste.",
}];
const EMPTY_TRIP: Trip = { depart:null, destination:null, passagers:null, vehicule:null, prix:null };

/* ═══════════════════════════════════════════════════════════════
   INLINE STYLE HELPERS
═══════════════════════════════════════════════════════════════ */
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: T.surface,
  borderRadius: 20,
  border: `1px solid ${T.border}`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
  ...extra,
});

const label = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
  color: T.muted,
  ...extra,
});

/* ═══════════════════════════════════════════════════════════════
   MICRO ICONS (inline SVG)
═══════════════════════════════════════════════════════════════ */
const IcoSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IcoDl = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoMsg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcoZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7 7 17 7 17 17"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════════════════════════ */
function TypingDots() {
  return (
    <div style={{ display:"flex", justifyContent:"flex-start" }}>
      <div style={{
        background: T.bg, borderRadius:"4px 16px 16px 16px",
        padding:"12px 16px", display:"flex", gap:5, alignItems:"center",
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width:6, height:6, borderRadius:"50%", background:T.muted, display:"inline-block",
            animation:`nt-dot 1.2s ease-in-out ${i*0.18}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TICKET ROW
═══════════════════════════════════════════════════════════════ */
function TRow({ lbl, val, big }: { lbl:string; val:string|null; big?:boolean }) {
  const hasVal = val !== null;
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"11px 0", borderBottom:`1px solid ${T.divider}`,
    }}>
      <span style={label()}>{lbl}</span>
      <span style={{
        fontSize: big ? 17 : 13,
        fontWeight: big ? 700 : 600,
        color: hasVal ? (big ? T.accent : T.text) : T.inactive,
        transition:"color .35s ease, font-size .35s ease",
      }}>{val ?? "—"}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS CARD
═══════════════════════════════════════════════════════════════ */
function HowCard({ step, icon, title, body }: { step:string; icon:React.ReactNode; title:string; body:string }) {
  return (
    <div style={card({ padding:"24px 22px", display:"flex", flexDirection:"column", gap:14 })}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={label()}>{step}</span>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:"#f0f7ff", display:"flex", alignItems:"center", justifyContent:"center",
        }}>{icon}</div>
      </div>
      <p style={{ fontSize:15, fontWeight:600, color:T.text, margin:0 }}>{title}</p>
      <p style={{ fontSize:13, color:T.muted, margin:0, lineHeight:1.65 }}>{body}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ClientPage() {
  const [msgs,    setMsgs]    = useState<Msg[]>(INIT_MSGS);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [trip,    setTrip]    = useState<Trip>(EMPTY_TRIP);
  const [msgAnim, setMsgAnim] = useState<number[]>([]);
  const endRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const send = useCallback(async (text: string, demo = false) => {
    if (loading) return;
    const uid = Date.now();
    setMsgs(p => [...p, { id:uid, role:"user", content:text }]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 1500));

    const reply = demo
      ? "Parfait. J'ai analysé votre demande : Lyon → Paris, 45 passagers, le 12 octobre. Pour ce volume, je recommande un autocar grande capacité. L'estimation tarifaire est disponible sur votre ticket."
      : "Merci. Pour affiner votre devis, pouvez-vous préciser la date souhaitée et si des arrêts intermédiaires sont prévus ?";

    const aid = Date.now() + 1;
    setMsgs(p => [...p, { id:aid, role:"assistant", content:reply }]);
    setMsgAnim(p => [...p, aid]);
    setTimeout(() => setMsgAnim(p => p.filter(x => x !== aid)), 600);

    if (demo) {
      setTrip({
        depart:"Lyon", destination:"Paris",
        passagers:45, vehicule:"Autocar 49 places", prix:1450,
      });
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [loading]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput("");
    send(t, false);
  };

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style:"currency", currency:"EUR", maximumFractionDigits:0 });

  const BADGES = [
    "Entreprises & Séminaires","Sorties Scolaires",
    "Associations & Clubs","Événements Privés",
    "Comités d'Entreprise","BDE & Universités",
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.bg}; }
        input::placeholder { color: ${T.inactive}; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        @keyframes nt-dot {
          0%,80%,100% { opacity:.2; transform:scale(.7); }
          40%         { opacity:1;  transform:scale(1);  }
        }
        @keyframes nt-blink {
          0%,100% { opacity:1; }
          50%     { opacity:.2; }
        }
        @keyframes nt-fade {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        @keyframes nt-glow {
          0%,100% { box-shadow: 0 4px 12px rgba(0,0,0,.02); }
          50%     { box-shadow: 0 4px 28px rgba(0,113,227,.10); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; }
        }
        @media (min-width:900px) { .nt-hero { flex-direction: row !important; } }
        @media (min-width:700px) { .nt-how  { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font, color:T.text }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HEADER */}
        <header style={{
          position:"sticky", top:0, zIndex:200,
          background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)",
          borderBottom:`1px solid ${T.border}`,
        }}>
          <div style={{
            maxWidth:1200, margin:"0 auto", padding:"0 24px",
            height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:15, fontWeight:700, letterSpacing:"-0.01em", color:T.text }}>
                NeoTravel
              </span>
              <span style={{
                fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                padding:"3px 9px", borderRadius:20, background:T.bg,
                color:T.muted, border:`1px solid ${T.border}`,
              }}>V2 Prototype</span>
            </div>
            <a href="/admin" style={{
              display:"flex", alignItems:"center", gap:4,
              fontSize:13, fontWeight:500, color:T.accent, textDecoration:"none",
              transition:"opacity .18s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity="0.55")}
              onMouseLeave={e => (e.currentTarget.style.opacity="1")}>
              Espace Direction <IcoLink/>
            </a>
          </div>
        </header>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO */}
        <main>
          <section style={{ maxWidth:1200, margin:"0 auto", padding:"48px 24px 0" }}>

            {/* — Eyebrow + H1 — centré au-dessus de la grille */}
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <p style={label({ marginBottom:14 })}>Transport de groupe assisté par IA</p>
              <h1 style={{
                fontSize:"clamp(28px,4vw,54px)", fontWeight:700,
                letterSpacing:"-0.03em", lineHeight:1.07, color:T.text, marginBottom:14,
              }}>
                Votre transport de groupe.<br/>
                <span style={{ color:T.accent }}>Simple comme un message.</span>
              </h1>
              <p style={{
                fontSize:16, color:T.muted, maxWidth:500,
                margin:"0 auto", lineHeight:1.65,
              }}>
                Parlez librement. Pas de formulaire — notre assistant extrait vos critères,
                calcule le tarif et génère le devis en temps réel.
              </p>
            </div>

            {/* — Two-col grid — */}
            <div className="nt-hero" style={{
              display:"flex", flexDirection:"column",
              gap:20, alignItems:"stretch",
            }}>

              {/* ─── LEFT : Ticket + accroche (1/3) ──────────────────── */}
              <div style={{ flex:"0 0 320px", display:"flex", flexDirection:"column", gap:20 }}>

                {/* Ticket card */}
                <div style={{
                  ...card(),
                  overflow:"hidden",
                  animation: trip.prix ? "nt-glow 2.5s ease-in-out infinite" : "none",
                }}>
                  {/* Ticket header */}
                  <div style={{
                    padding:"18px 20px 14px",
                    borderBottom:`1px solid ${T.divider}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={label()}>Ticket de voyage</span>
                      <span style={{
                        width:8, height:8, borderRadius:"50%",
                        background: trip.prix ? T.success : T.inactive,
                        transition:"background .5s ease",
                        animation: trip.prix ? "nt-blink 2.5s ease-in-out infinite" : "none",
                      }}/>
                    </div>
                    <p style={{
                      fontSize:20, fontWeight:700, letterSpacing:"-0.02em",
                      color: trip.depart ? T.text : T.inactive, lineHeight:1.2,
                      transition:"color .4s ease",
                    }}>
                      {trip.depart && trip.destination
                        ? `${trip.depart} → ${trip.destination}`
                        : "En attente…"}
                    </p>
                  </div>

                  {/* Ticket rows */}
                  <div style={{ padding:"2px 20px" }}>
                    <TRow lbl="Départ"          val={trip.depart}/>
                    <TRow lbl="Destination"     val={trip.destination}/>
                    <TRow lbl="Passagers"       val={trip.passagers ? `${trip.passagers} personnes` : null}/>
                    <TRow lbl="Véhicule estimé" val={trip.vehicule}/>
                    <div style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"13px 0",
                    }}>
                      <span style={label()}>Prix estimé</span>
                      <span style={{
                        fontSize: trip.prix ? 20 : 13,
                        fontWeight:700,
                        color: trip.prix ? T.accent : T.inactive,
                        transition:"all .45s ease",
                      }}>
                        {trip.prix ? fmt(trip.prix) : "—"}
                      </span>
                    </div>
                  </div>

                  {/* CTA PDF — slide-in */}
                  <div style={{
                    overflow:"hidden",
                    maxHeight: trip.prix ? "76px" : "0px",
                    opacity:   trip.prix ? 1 : 0,
                    transition:"max-height .65s ease, opacity .65s ease",
                  }}>
                    <div style={{ padding:"12px 20px 20px" }}>
                      <button
                        style={{
                          width:"100%", display:"flex", alignItems:"center",
                          justifyContent:"center", gap:8,
                          background:T.accent, color:"#fff",
                          fontSize:13, fontWeight:600,
                          padding:"13px 16px", borderRadius:12,
                          border:"none", cursor:"pointer",
                          transition:"background .18s, transform .1s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background=T.accentHov}
                        onMouseLeave={e => e.currentTarget.style.background=T.accent}
                        onMouseDown={e  => e.currentTarget.style.transform="scale(.98)"}
                        onMouseUp={e    => e.currentTarget.style.transform="scale(1)"}
                      >
                        <IcoDl/> Télécharger la proposition officielle (PDF)
                      </button>
                    </div>
                  </div>

                  {/* Placeholder hint */}
                  {!trip.prix && (
                    <p style={{
                      fontSize:11, color:T.inactive, textAlign:"center",
                      padding:"14px 20px 20px", lineHeight:1.55,
                    }}>
                      Les données s'extraient automatiquement<br/>de la conversation.
                    </p>
                  )}
                </div>
              </div>

              {/* ─── RIGHT : Chat canvas (2/3) ───────────────────────── */}
              <div style={{ flex:"1 1 0", minWidth:0 }}>
                <div style={{
                  ...card(),
                  display:"flex", flexDirection:"column",
                  height:"70vh", minHeight:460,
                }}>
                  {/* Chat header bar */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:9,
                    padding:"13px 20px",
                    borderBottom:`1px solid ${T.divider}`,
                    flexShrink:0,
                  }}>
                    <span style={{
                      width:8, height:8, borderRadius:"50%", background:T.success, flexShrink:0,
                      animation:"nt-blink 2.5s ease-in-out infinite",
                    }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:T.text }}>
                      Assistant IA NeoTravel
                    </span>
                    <span style={{ fontSize:12, color:T.muted }}>— En ligne</span>
                  </div>

                  {/* Messages */}
                  <div style={{
                    flex:1, overflowY:"auto", padding:"18px 20px",
                    display:"flex", flexDirection:"column", gap:10,
                  }}>
                    {msgs.map(m => (
                      <div key={m.id} style={{
                        display:"flex",
                        justifyContent: m.role==="user" ? "flex-end" : "flex-start",
                        animation: msgAnim.includes(m.id) ? "nt-fade .35s ease" : "none",
                      }}>
                        <div style={{
                          maxWidth:"78%", fontSize:14, lineHeight:1.65,
                          padding:"11px 15px",
                          borderRadius: m.role==="user"
                            ? "16px 4px 16px 16px"
                            : "4px 16px 16px 16px",
                          background: m.role==="user" ? T.accent : T.bg,
                          color:       m.role==="user" ? "#fff"    : T.text,
                        }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {loading && <TypingDots/>}
                    <div ref={endRef}/>
                  </div>

                  {/* Démo Express shortcut */}
                  <div style={{ padding:"4px 18px 2px", flexShrink:0 }}>
                    <button
                      onClick={() => {
                        const t = "Bonjour, nous sommes une association de 45 personnes au départ de Lyon à destination de Paris le 12 octobre.";
                        send(t, true);
                      }}
                      disabled={loading}
                      style={{
                        fontSize:12, fontWeight:500, color:T.muted, background:"none",
                        border:"none", cursor: loading ? "not-allowed" : "pointer",
                        padding:"6px 10px", borderRadius:8,
                        opacity: loading ? 0.4 : 1, transition:"all .18s",
                      }}
                      onMouseEnter={e => {
                        if (!loading) {
                          e.currentTarget.style.background=T.bg;
                          e.currentTarget.style.color=T.accent;
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background="none";
                        e.currentTarget.style.color=T.muted;
                      }}
                    >
                      🚀 Démo Express — Lyon → Paris, 45 personnes
                    </button>
                  </div>

                  {/* Input bar */}
                  <div style={{ padding:"6px 16px 16px", flexShrink:0 }}>
                    <div style={{
                      display:"flex", alignItems:"center", gap:10,
                      background:T.bg, borderRadius:12,
                      padding:"10px 14px", border:`1px solid ${T.border}`,
                      transition:"border-color .2s, background .2s",
                    }}
                      onFocusCapture={e => {
                        e.currentTarget.style.borderColor=T.accent;
                        e.currentTarget.style.background=T.surface;
                      }}
                      onBlurCapture={e => {
                        e.currentTarget.style.borderColor=T.border;
                        e.currentTarget.style.background=T.bg;
                      }}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                        }}
                        placeholder="Décrivez votre trajet de groupe…"
                        disabled={loading}
                        style={{
                          flex:1, background:"transparent", border:"none",
                          fontSize:14, color:T.text,
                          opacity: loading ? 0.5 : 1,
                        }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{
                          width:32, height:32, borderRadius:8, flexShrink:0,
                          background: (loading||!input.trim()) ? T.inactive : T.accent,
                          border:"none", cursor:(loading||!input.trim())?"not-allowed":"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"#fff", transition:"background .18s, transform .1s",
                        }}
                        onMouseDown={e => { if(!loading&&input.trim()) e.currentTarget.style.transform="scale(.9)"; }}
                        onMouseUp={e   => e.currentTarget.style.transform="scale(1)"}
                      >
                        <IcoSend/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SECTION 3 : HOW */}
          <section style={{ maxWidth:1200, margin:"80px auto 0", padding:"0 24px" }}>
            <p style={label({ marginBottom:12, textAlign:"center", display:"block" })}>Processus</p>
            <h2 style={{
              fontSize:"clamp(22px,3vw,38px)", fontWeight:700,
              letterSpacing:"-0.025em", color:T.text,
              textAlign:"center", marginBottom:36,
            }}>Comment ça marche ?</h2>
            <div className="nt-how" style={{
              display:"grid",
              gridTemplateColumns:"1fr", gap:14,
            }}>
              <HowCard step="01" icon={<IcoMsg/>}
                title="Exprimez votre besoin"
                body="Échangez naturellement par écrit avec notre assistant. Pas de formulaire, pas de case à cocher — juste une conversation."/>
              <HowCard step="02" icon={<IcoZap/>}
                title="Analyse instantanée"
                body="Notre technologie extrait vos critères, sélectionne le véhicule adapté et calcule le tarif fixe au centime près en temps réel."/>
              <HowCard step="03" icon={<IcoCheck/>}
                title="Suivi personnalisé"
                body="Le devis est généré immédiatement et téléchargeable. Nos conseillers prennent ensuite le relais pour finaliser."/>
            </div>
          </section>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SECTION 4 : CAS D'USAGE */}
          <section style={{ maxWidth:1200, margin:"64px auto 0", padding:"0 24px" }}>
            <p style={label({ marginBottom:12, textAlign:"center", display:"block" })}>
              Domaines d'intervention
            </p>
            <h2 style={{
              fontSize:"clamp(20px,3vw,32px)", fontWeight:700,
              letterSpacing:"-0.02em", color:T.text,
              textAlign:"center", marginBottom:28,
            }}>Pour tous vos projets de groupe</h2>
            <div style={{
              display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center",
            }}>
              {["Entreprises & Séminaires","Sorties Scolaires","Associations & Clubs",
                "Événements Privés","Comités d'Entreprise","BDE & Universités"].map(b => (
                <span key={b} style={{
                  fontSize:13, fontWeight:500, color:T.text,
                  background:T.surface, border:`1px solid ${T.border}`,
                  borderRadius:24, padding:"9px 18px",
                  boxShadow:"0 2px 6px rgba(0,0,0,.025)",
                }}>{b}</span>
              ))}
            </div>
          </section>
        </main>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER */}
        <footer style={{
          marginTop:72, borderTop:`1px solid ${T.border}`,
          background:T.bg, padding:"28px 24px",
        }}>
          <div style={{
            maxWidth:1200, margin:"0 auto",
            display:"flex", flexDirection:"column", alignItems:"center", gap:14,
          }}>
            <p style={{ fontSize:13, fontWeight:500, color:T.muted, textAlign:"center", letterSpacing:"0.005em" }}>
              « NeoTravel V2 : Digitaliser sans déshumaniser »
            </p>
            <div style={{
              display:"flex", width:"100%",
              justifyContent:"space-between", alignItems:"center",
              flexWrap:"wrap", gap:8,
            }}>
              <span style={{ fontSize:11, color:T.muted }}>© 2026 NeoTravel — Tous droits réservés</span>
              <div style={{ display:"flex", gap:20 }}>
                {["Mentions légales","Conformité RGPD"].map(l => (
                  <a key={l} href="#" style={{
                    fontSize:11, color:T.muted, textDecoration:"none",
                    transition:"color .18s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color=T.text}
                    onMouseLeave={e => e.currentTarget.style.color=T.muted}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}