"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
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
  id: 1, role: "assistant",
  content: "Bonjour ! Décrivez votre projet de transport en quelques mots — ville de départ, destination, nombre de personnes. Je m'occupe du reste.",
}];
const EMPTY_TRIP: Trip = { depart:null, destination:null, passagers:null, vehicule:null, prix:null };

/* ═══════════════════════════════════════════════════════════════
   STYLE HELPERS
═══════════════════════════════════════════════════════════════ */
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: T.surface, borderRadius: 20,
  border: `1px solid ${T.border}`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
  ...extra,
});
const lbl = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontSize: 10, fontWeight: 600, letterSpacing: "0.13em",
  textTransform: "uppercase" as const, color: T.muted, ...extra,
});

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const IcoSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IcoDl = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoMsg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcoZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const IcoStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoBus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IcoMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════════════════════════ */
function TypingDots() {
  return (
    <div style={{ display:"flex", justifyContent:"flex-start" }}>
      <div style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)", borderRadius:"4px 16px 16px 16px", padding:"12px 16px", display:"flex", gap:5, alignItems:"center", border:`1px solid ${T.border}` }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:T.muted, display:"inline-block", animation:`nt-dot 1.2s ease-in-out ${i*0.18}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TICKET ROW
═══════════════════════════════════════════════════════════════ */
function TRow({ l, val, big }: { l:string; val:string|null; big?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${T.divider}` }}>
      <span style={lbl()}>{l}</span>
      <span style={{ fontSize: big?17:13, fontWeight: big?700:600, color: val?(big?T.accent:T.text):T.inactive, transition:"color .35s ease" }}>{val ?? "—"}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW CARD
═══════════════════════════════════════════════════════════════ */
function HowCard({ step, icon, title, body }: { step:string; icon:React.ReactNode; title:string; body:string }) {
  return (
    <div style={card({ padding:"28px 24px", display:"flex", flexDirection:"column", gap:16, transition:"transform .2s, box-shadow .2s" })}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.02)"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={lbl()}>{step}</span>
        <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#e8f0fe,#dbeafe)", display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
      </div>
      <p style={{ fontSize:16, fontWeight:700, color:T.text, margin:0 }}>{title}</p>
      <p style={{ fontSize:13, color:T.muted, margin:0, lineHeight:1.7 }}>{body}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════ */
function StatCard({ value, unit, label, icon, color }: { value:string; unit?:string; label:string; icon:React.ReactNode; color:string }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"32px 20px", background:T.surface, borderRadius:24, border:`1px solid ${T.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", textAlign:"center" }}>
      <div style={{ width:52, height:52, borderRadius:16, background:color, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 6px 16px ${color}55` }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize:38, fontWeight:800, letterSpacing:"-0.04em", color:T.text, lineHeight:1 }}>
          {value}<span style={{ fontSize:22, fontWeight:600, color:T.muted }}>{unit}</span>
        </p>
        <p style={{ fontSize:13, color:T.muted, marginTop:6, lineHeight:1.5 }}>{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIAL CARD
═══════════════════════════════════════════════════════════════ */
function TestiCard({ quote, author, role, company }: { quote:string; author:string; role:string; company:string }) {
  return (
    <div style={card({ padding:"24px", display:"flex", flexDirection:"column", gap:16, transition:"transform .2s, box-shadow .2s" })}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.02)"; }}>
      <div style={{ display:"flex", gap:2 }}>
        {[...Array(5)].map((_,i) => <IcoStar key={i}/>)}
      </div>
      <p style={{ fontSize:14, color:T.text, lineHeight:1.7, fontStyle:"italic", margin:0 }}>"{quote}"</p>
      <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:4, borderTop:`1px solid ${T.divider}` }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${T.accent}, #5ac8fa)`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14, fontWeight:700, flexShrink:0 }}>
          {author[0]}
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:T.text, margin:0 }}>{author}</p>
          <p style={{ fontSize:11, color:T.muted, margin:0 }}>{role} · {company}</p>
        </div>
      </div>
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
  const endRef   = useRef<HTMLDivElement>(null);
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
    if (demo) setTrip({ depart:"Lyon", destination:"Paris", passagers:45, vehicule:"Autocar 49 places", prix:1450 });
    setLoading(false);
    inputRef.current?.focus();
  }, [loading]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput(""); send(t, false);
  };
  const fmt = (n: number) => n.toLocaleString("fr-FR", { style:"currency", currency:"EUR", maximumFractionDigits:0 });

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:${T.bg}; }
        input::placeholder { color:${T.inactive}; }
        input:focus { outline:none; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px; }

        @keyframes nt-dot    { 0%,80%,100%{opacity:.2;transform:scale(.7)} 40%{opacity:1;transform:scale(1)} }
        @keyframes nt-blink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes nt-fade   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nt-glow   { 0%,100%{box-shadow:0 4px 12px rgba(0,0,0,.02)} 50%{box-shadow:0 4px 32px rgba(0,113,227,.12)} }
        @keyframes nt-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes nt-blob1  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.08)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes nt-blob2  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.05)} 66%{transform:translate(30px,-20px) scale(0.97)} }
        @keyframes nt-blob3  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,30px) scale(1.06)} 66%{transform:translate(-40px,-10px) scale(0.94)} }
        @keyframes nt-shimmer{ 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes nt-count  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        @media (prefers-reduced-motion:reduce) { *,*::before,*::after{animation-duration:.01ms!important} }
        @media (min-width:900px) { .nt-hero{flex-direction:row!important} .nt-footer-grid{flex-direction:row!important; text-align:left!important} }
        @media (min-width:700px) { .nt-how{grid-template-columns:repeat(3,1fr)!important} .nt-stats{grid-template-columns:repeat(3,1fr)!important} .nt-testi{grid-template-columns:repeat(3,1fr)!important} }
        @media (min-width:600px) { .nt-footer-links{flex-direction:row!important} }
      `}</style>

      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font, color:T.text }}>

        {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <header style={{ position:"sticky", top:0, zIndex:200, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(24px)", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Logo mark */}
              <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${T.accent}, #5ac8fa)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IcoBus/>
              </div>
              <span style={{ fontSize:16, fontWeight:700, letterSpacing:"-0.02em", color:T.text }}>NeoTravel</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:20, background:T.bg, color:T.muted, border:`1px solid ${T.border}` }}>V2</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <a href="#comment" style={{ fontSize:13, color:T.muted, textDecoration:"none", fontWeight:500, transition:"color .18s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.text} onMouseLeave={e=>e.currentTarget.style.color=T.muted}>
                Comment ça marche
              </a>
              <a href="/admin" style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:600, color:T.surface, textDecoration:"none", background:T.accent, padding:"7px 14px", borderRadius:10, transition:"background .18s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.accentHov} onMouseLeave={e=>e.currentTarget.style.background=T.accent}>
                Espace Direction <IcoLink/>
              </a>
            </div>
          </div>
        </header>

        <main>

          {/* ━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* Background mesh gradient container */}
          <div style={{ position:"relative", overflow:"hidden" }}>

            {/* Animated gradient background */}
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #f0f7ff 0%, #f5f5f7 40%, #fdf4ff 100%)", zIndex:0 }}/>

            {/* Animated blobs */}
            <div style={{ position:"absolute", top:"-10%", left:"-5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,113,227,0.10) 0%, transparent 70%)", animation:"nt-blob1 18s ease-in-out infinite", zIndex:0 }}/>
            <div style={{ position:"absolute", top:"20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(90,200,250,0.12) 0%, transparent 70%)", animation:"nt-blob2 22s ease-in-out infinite", zIndex:0 }}/>
            <div style={{ position:"absolute", bottom:"-5%", left:"30%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(175,82,222,0.07) 0%, transparent 70%)", animation:"nt-blob3 16s ease-in-out infinite", zIndex:0 }}/>

            {/* Grid pattern overlay */}
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,113,227,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,113,227,0.04) 1px, transparent 1px)", backgroundSize:"48px 48px", zIndex:0 }}/>

            <section style={{ maxWidth:1200, margin:"0 auto", padding:"64px 24px 72px", position:"relative", zIndex:1 }}>

              {/* Eyebrow pill */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:24, background:"rgba(255,255,255,0.85)", border:`1px solid ${T.border}`, backdropFilter:"blur(8px)", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:T.success, animation:"nt-blink 2s ease-in-out infinite" }}/>
                  <span style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:"0.04em" }}>Assistant IA disponible · Réponse en temps réel</span>
                </div>
              </div>

              {/* H1 */}
              <div style={{ textAlign:"center", marginBottom:56 }}>
                <h1 style={{ fontSize:"clamp(32px,5vw,62px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.05, color:T.text, marginBottom:18 }}>
                  Votre transport de groupe.<br/>
                  <span style={{ background:`linear-gradient(135deg, ${T.accent}, #5ac8fa)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    Simple comme un message.
                  </span>
                </h1>
                <p style={{ fontSize:17, color:T.muted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
                  Parlez librement. Notre assistant extrait vos critères, calcule le tarif et génère le devis — sans formulaire, sans attente.
                </p>
              </div>

              {/* Two-col hero grid */}
              <div className="nt-hero" style={{ display:"flex", flexDirection:"column", gap:24, alignItems:"stretch" }}>

                {/* ── LEFT : Ticket (1/3) ─────────────────────────────── */}
                <div style={{ flex:"0 0 320px", display:"flex", flexDirection:"column", gap:0 }}>
                  <div style={{ ...card(), overflow:"hidden", animation: trip.prix ? "nt-glow 2.5s ease-in-out infinite" : "none", background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)" }}>
                    <div style={{ padding:"18px 20px 14px", borderBottom:`1px solid ${T.divider}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={lbl()}>Ticket de voyage</span>
                        <span style={{ width:8, height:8, borderRadius:"50%", background: trip.prix ? T.success : T.inactive, transition:"background .5s", animation: trip.prix ? "nt-blink 2.5s ease-in-out infinite" : "none" }}/>
                      </div>
                      <p style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.02em", color: trip.depart ? T.text : T.inactive, lineHeight:1.2, transition:"color .4s" }}>
                        {trip.depart && trip.destination ? `${trip.depart} → ${trip.destination}` : "En attente…"}
                      </p>
                    </div>
                    <div style={{ padding:"2px 20px" }}>
                      <TRow l="Départ"          val={trip.depart}/>
                      <TRow l="Destination"     val={trip.destination}/>
                      <TRow l="Passagers"       val={trip.passagers ? `${trip.passagers} personnes` : null}/>
                      <TRow l="Véhicule estimé" val={trip.vehicule}/>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0" }}>
                        <span style={lbl()}>Prix estimé</span>
                        <span style={{ fontSize: trip.prix?20:13, fontWeight:700, color: trip.prix?T.accent:T.inactive, transition:"all .45s" }}>
                          {trip.prix ? fmt(trip.prix) : "—"}
                        </span>
                      </div>
                    </div>
                    <div style={{ overflow:"hidden", maxHeight: trip.prix?"80px":"0px", opacity: trip.prix?1:0, transition:"max-height .65s ease, opacity .65s ease" }}>
                      <div style={{ padding:"12px 20px 20px" }}>
                        <button style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:`linear-gradient(135deg, ${T.accent}, #0090ff)`, color:"#fff", fontSize:13, fontWeight:700, padding:"13px 16px", borderRadius:12, border:"none", cursor:"pointer", boxShadow:`0 4px 14px rgba(0,113,227,0.35)`, transition:"all .18s" }}
                          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,113,227,0.45)"}}
                          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,113,227,0.35)"}}>
                          <IcoDl/> Télécharger la proposition (PDF)
                        </button>
                      </div>
                    </div>
                    {!trip.prix && (
                      <p style={{ fontSize:11, color:T.inactive, textAlign:"center", padding:"14px 20px 20px", lineHeight:1.6 }}>
                        Les données s'extraient automatiquement<br/>de la conversation.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── RIGHT : Chat canvas (2/3) ───────────────────────── */}
                <div style={{ flex:"1 1 0", minWidth:0 }}>
                  {/* Chat card with glassmorphism */}
                  <div style={{ display:"flex", flexDirection:"column", height:"70vh", minHeight:480, borderRadius:24, border:`1px solid rgba(255,255,255,0.7)`, background:"rgba(255,255,255,0.80)", backdropFilter:"blur(20px)", boxShadow:"0 8px 40px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset" }}>

                    {/* Chat top bar */}
                    <div style={{ display:"flex", alignItems:"center", gap:9, padding:"14px 20px", borderBottom:"1px solid rgba(232,232,237,0.6)", flexShrink:0 }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:T.success, flexShrink:0, animation:"nt-blink 2.5s ease-in-out infinite" }}/>
                      <span style={{ fontSize:13, fontWeight:600, color:T.text }}>Assistant IA NeoTravel</span>
                      <span style={{ fontSize:12, color:T.muted }}>— En ligne</span>
                      <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                        {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }}/>)}
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:10 }}>
                      {msgs.map(m => (
                        <div key={m.id} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start", animation: msgAnim.includes(m.id) ? "nt-fade .35s ease" : "none" }}>
                          <div style={{ maxWidth:"78%", fontSize:14, lineHeight:1.65, padding:"11px 15px",
                            borderRadius: m.role==="user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                            background: m.role==="user" ? `linear-gradient(135deg, ${T.accent}, #0090ff)` : "rgba(245,245,247,0.9)",
                            color: m.role==="user" ? "#fff" : T.text,
                            boxShadow: m.role==="user" ? "0 3px 12px rgba(0,113,227,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
                            backdropFilter: m.role!=="user" ? "blur(8px)" : "none",
                          }}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {loading && <TypingDots/>}
                      <div ref={endRef}/>
                    </div>

                    {/* Demo shortcut */}
                    <div style={{ padding:"4px 18px 2px", flexShrink:0 }}>
                      <button onClick={() => send("Bonjour, nous sommes une association de 45 personnes au départ de Lyon à destination de Paris le 12 octobre.", true)}
                        disabled={loading}
                        style={{ fontSize:12, fontWeight:500, color:T.muted, background:"none", border:"none", cursor: loading?"not-allowed":"pointer", padding:"6px 10px", borderRadius:8, opacity: loading?0.4:1, transition:"all .18s" }}
                        onMouseEnter={e=>{ if(!loading){e.currentTarget.style.background=T.bg;e.currentTarget.style.color=T.accent} }}
                        onMouseLeave={e=>{ e.currentTarget.style.background="none";e.currentTarget.style.color=T.muted }}>
                        🚀 Démo Express — Lyon → Paris, 45 personnes
                      </button>
                    </div>

                    {/* Input */}
                    <div style={{ padding:"6px 16px 16px", flexShrink:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(245,245,247,0.8)", backdropFilter:"blur(8px)", borderRadius:14, padding:"10px 14px", border:`1px solid ${T.border}`, transition:"all .2s" }}
                        onFocusCapture={e=>{ e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.background="rgba(255,255,255,0.95)"; }}
                        onBlurCapture={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background="rgba(245,245,247,0.8)"; }}>
                        <input ref={inputRef} type="text" value={input}
                          onChange={e=>setInput(e.target.value)}
                          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend()} }}
                          placeholder="Décrivez votre trajet de groupe…" disabled={loading}
                          style={{ flex:1, background:"transparent", border:"none", fontSize:14, color:T.text, opacity:loading?0.5:1 }}/>
                        <button onClick={handleSend} disabled={loading||!input.trim()}
                          style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:(loading||!input.trim())?T.inactive:`linear-gradient(135deg, ${T.accent}, #0090ff)`, border:"none", cursor:(loading||!input.trim())?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", transition:"all .18s", boxShadow:(loading||!input.trim())?"none":"0 3px 10px rgba(0,113,227,0.35)" }}>
                          <IcoSend/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ━━━━ STATS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <span style={lbl({ display:"block", marginBottom:12 })}>NeoTravel en chiffres</span>
              <h2 style={{ fontSize:"clamp(22px,3vw,40px)", fontWeight:800, letterSpacing:"-0.03em", color:T.text }}>La performance, prouvée.</h2>
            </div>
            <div className="nt-stats" style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
              <StatCard value="2 400" unit="+" label="Trajets organisés avec succès" icon={<IcoBus/>} color={T.accent}/>
              <StatCard value="98"    unit="%" label="Taux de satisfaction client" icon={<IcoShield/>} color="#34c759"/>
              <StatCard value="< 2"   unit="min" label="Délai moyen de génération d'un devis" icon={<IcoClock/>} color="#af52de"/>
            </div>
          </section>

          {/* ━━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section id="comment" style={{ maxWidth:1200, margin:"80px auto 0", padding:"0 24px" }}>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <span style={lbl({ display:"block", marginBottom:12 })}>Processus</span>
              <h2 style={{ fontSize:"clamp(22px,3vw,40px)", fontWeight:800, letterSpacing:"-0.03em", color:T.text }}>Comment ça marche ?</h2>
            </div>
            <div className="nt-how" style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
              <HowCard step="01" icon={<IcoMsg/>} title="Exprimez votre besoin" body="Échangez naturellement avec notre assistant. Pas de formulaire, pas de case à cocher — juste une conversation fluide."/>
              <HowCard step="02" icon={<IcoZap/>} title="Analyse instantanée"    body="Notre IA extrait vos critères, sélectionne le véhicule adapté et calcule le tarif fixe en temps réel."/>
              <HowCard step="03" icon={<IcoCheck/>} title="Suivi personnalisé"   body="Le devis est généré et téléchargeable immédiatement. Nos conseillers prennent le relais pour finaliser."/>
            </div>
          </section>

          {/* ━━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth:1200, margin:"80px auto 0", padding:"0 24px" }}>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <span style={lbl({ display:"block", marginBottom:12 })}>Témoignages</span>
              <h2 style={{ fontSize:"clamp(22px,3vw,40px)", fontWeight:800, letterSpacing:"-0.03em", color:T.text }}>Ils nous font confiance.</h2>
            </div>
            <div className="nt-testi" style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
              <TestiCard quote="En moins de 2 minutes, j'avais un devis complet pour 60 personnes. Bluffant. On a signé dans la foulée." author="Sophie M." role="DRH" company="École Centrale Lyon"/>
              <TestiCard quote="Fini les allers-retours par email. L'assistant a tout capté du premier coup et le PDF était impeccable." author="Thomas R." role="Responsable événementiel" company="Sanofi France"/>
              <TestiCard quote="L'outil idéal pour les sorties scolaires. Simple, rapide, et nos parents ont adoré la transparence du devis." author="Marie-Claire D." role="Directrice pédagogique" company="Lycée Saint-Exupéry"/>
            </div>
          </section>

          {/* ━━━━ USE CASES (badges) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth:1200, margin:"72px auto 0", padding:"0 24px" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <span style={lbl({ display:"block", marginBottom:12 })}>Domaines d'intervention</span>
              <h2 style={{ fontSize:"clamp(18px,2.5vw,30px)", fontWeight:700, letterSpacing:"-0.02em", color:T.text }}>Pour tous vos projets de groupe</h2>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
              {["Entreprises & Séminaires","Sorties Scolaires","Associations & Clubs","Événements Privés","Comités d'Entreprise","BDE & Universités"].map(b => (
                <span key={b} style={{ fontSize:13, fontWeight:500, color:T.text, background:T.surface, border:`1px solid ${T.border}`, borderRadius:24, padding:"9px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)", transition:"all .18s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=T.accent; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=T.accent; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; e.currentTarget.style.color=T.text; e.currentTarget.style.borderColor=T.border; }}>
                  {b}
                </span>
              ))}
            </div>
          </section>

          {/* ━━━━ CTA BAND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth:1200, margin:"72px auto 0", padding:"0 24px" }}>
            <div style={{ borderRadius:28, background:`linear-gradient(135deg, ${T.accent} 0%, #0090ff 50%, #5ac8fa 100%)`, padding:"52px 40px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 16px 48px rgba(0,113,227,0.28)" }}>
              {/* subtle noise */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 50%)" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <p style={{ fontSize:13, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", marginBottom:14 }}>Prêt à simplifier votre logistique ?</p>
                <h2 style={{ fontSize:"clamp(22px,4vw,42px)", fontWeight:800, letterSpacing:"-0.03em", color:"#fff", marginBottom:12, lineHeight:1.1 }}>Obtenez votre devis<br/>en moins de 2 minutes.</h2>
                <p style={{ fontSize:15, color:"rgba(255,255,255,0.75)", marginBottom:32, lineHeight:1.6 }}>Aucun engagement. Aucune carte bancaire. Juste votre projet.</p>
                <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
                  style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", color:T.accent, fontSize:14, fontWeight:700, padding:"14px 28px", borderRadius:14, border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.2)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.15)"}}>
                  Démarrer maintenant →
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* ━━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <footer style={{ marginTop:80, background:"#1d1d1f", color:"rgba(255,255,255,0.5)" }}>
          {/* Top section */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"56px 24px 40px" }}>
            <div className="nt-footer-grid" style={{ display:"flex", flexDirection:"column", gap:40, textAlign:"center" }}>

              {/* Brand col */}
              <div style={{ flex:"0 0 260px", display:"flex", flexDirection:"column", gap:16, alignItems:"inherit" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"inherit" }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg, ${T.accent}, #5ac8fa)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <IcoBus/>
                  </div>
                  <span style={{ fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" }}>NeoTravel</span>
                </div>
                <p style={{ fontSize:13, lineHeight:1.7, maxWidth:220 }}>
                  La plateforme qui digitalise la location d'autocars de groupe sans perdre l'humain.
                </p>
                <p style={{ fontSize:12, fontStyle:"italic", color:"rgba(255,255,255,0.35)" }}>« Digitaliser sans déshumaniser »</p>
              </div>

              {/* Links cols */}
              <div className="nt-footer-links" style={{ flex:1, display:"flex", flexDirection:"column", gap:32, justifyContent:"flex-end" }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:14 }}>Produit</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {["Comment ça marche","Nos tarifs","Démo en direct","FAQ"].map(l=>(
                      <a key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"color .18s" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>{l}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:14 }}>Entreprise</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {["À propos","Partenaires","Presse","Carrières"].map(l=>(
                      <a key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"color .18s" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>{l}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:14 }}>Contact</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <a href="mailto:contact@neotravel.fr" style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"color .18s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>
                      <IcoMail/> contact@neotravel.fr
                    </a>
                    <a href="tel:+33412345678" style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"color .18s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>
                      <IcoPhone/> +33 4 12 34 56 78
                    </a>
                    <span style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
                      <IcoMapPin/> Lyon, France
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ maxWidth:1200, margin:"0 auto", padding:"18px 24px", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:12 }}>© 2026 NeoTravel — Tous droits réservés</span>
              <div style={{ display:"flex", gap:24 }}>
                {["Mentions légales","Confidentialité","Conformité RGPD","CGU"].map(l=>(
                  <a key={l} href="#" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textDecoration:"none", transition:"color .18s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.8)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}