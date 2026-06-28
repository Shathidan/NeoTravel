"use client";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:      "#f5f5f7",
  surface: "#ffffff",
  text:    "#1d1d1f",
  muted:   "#86868b",
  border:  "#e8e8ed",
  divider: "#f0f0f5",
  accent:  "#0071e3",
  accHov:  "#0077ed",
  success: "#34c759",
  font:    "'Inter','SF Pro Display',system-ui,-apple-system,sans-serif",
} as const;

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type Status = "nouveau"|"devis_envoye"|"relance";
interface Lead { id:number; client:string; trajet:string; passagers:number; montant:number; statut:Status; date:string; }

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════ */
const INIT_LEADS: Lead[] = [
  { id:1, client:"Nexity Group",             trajet:"Lyon → Paris",              passagers:45, montant:1450, statut:"devis_envoye", date:"28 juin" },
  { id:2, client:"Clinique du Lac",           trajet:"Grenoble → Genève",         passagers:22, montant:890,  statut:"nouveau",      date:"28 juin" },
  { id:3, client:"École Centrale Lyon",       trajet:"Lyon → Bordeaux",           passagers:60, montant:2100, statut:"relance",      date:"27 juin" },
  { id:4, client:"Sanofi France",             trajet:"Paris → Strasbourg",        passagers:38, montant:1680, statut:"devis_envoye", date:"27 juin" },
  { id:5, client:"Mairie de Villeurbanne",    trajet:"Villeurbanne → Marseille",  passagers:50, montant:1920, statut:"nouveau",      date:"26 juin" },
  { id:6, client:"BNP Paribas Lyon",          trajet:"Lyon → Nice",               passagers:30, montant:1350, statut:"relance",      date:"25 juin" },
  { id:7, client:"Renault Trucks",            trajet:"Lyon → Nantes",             passagers:55, montant:2250, statut:"devis_envoye", date:"24 juin" },
];

/* ═══════════════════════════════════════════════════════════════
   STATUS CONFIG
═══════════════════════════════════════════════════════════════ */
const ST: Record<Status,{label:string;bg:string;color:string;dot:string}> = {
  nouveau:      { label:"Nouveau lead",  bg:"#dbeafe", color:"#1d4ed8", dot:"#60a5fa" },
  devis_envoye: { label:"Devis envoyé",  bg:"#d1fae5", color:"#065f46", dot:"#34d399" },
  relance:      { label:"Relancé J+2",   bg:"#ffedd5", color:"#9a3412", dot:"#fb923c" },
};

/* ═══════════════════════════════════════════════════════════════
   INLINE HELPERS
═══════════════════════════════════════════════════════════════ */
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: T.surface,
  borderRadius: 20,
  border: `1px solid ${T.border}`,
  boxShadow: "0 4px 12px rgba(0,0,0,.02)",
  ...extra,
});

const eyebrow: React.CSSProperties = {
  fontSize:10, fontWeight:600, letterSpacing:"0.13em",
  textTransform:"uppercase", color:T.muted, display:"block",
};

/* ═══════════════════════════════════════════════════════════════
   MICRO ICONS
═══════════════════════════════════════════════════════════════ */
const IcoBack = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   KPI CARD
═══════════════════════════════════════════════════════════════ */
function KCard({ label, value, sub, accent }: { label:string; value:string; sub?:string; accent?:boolean }) {
  return (
    <div style={card({ padding:"20px 22px" })}>
      <span style={{ ...eyebrow, marginBottom:10 }}>{label}</span>
      <p style={{
        fontSize:30, fontWeight:700, letterSpacing:"-0.03em",
        color: accent ? T.accent : T.text, lineHeight:1,
      }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:T.muted, marginTop:6 }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════ */
function Badge({ s }: { s: Status }) {
  const c = ST[s];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:600, padding:"4px 10px",
      borderRadius:20, background:c.bg, color:c.color,
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }}/>
      {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUEUE ROW  (inside automate panel)
═══════════════════════════════════════════════════════════════ */
function QRow({ lead, stage }: { lead:Lead; stage:string }) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"8px 12px", borderRadius:10, background:T.bg,
      border:`1px solid ${T.border}`, marginBottom:6,
    }}>
      <div>
        <p style={{ fontSize:12, fontWeight:600, color:T.text }}>{lead.client}</p>
        <p style={{ fontSize:11, color:T.muted }}>{lead.trajet}</p>
      </div>
      <span style={{
        fontSize:10, fontWeight:700, letterSpacing:"0.1em",
        textTransform:"uppercase", color:"#9a3412",
        background:"#ffedd5", padding:"3px 8px", borderRadius:8,
      }}>{stage}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUTOMATE PANEL
═══════════════════════════════════════════════════════════════ */
function AutomatePanel({ leads, onSimulate }: { leads:Lead[]; onSimulate:()=>void }) {
  const queue = leads.filter(l => l.statut==="devis_envoye");
  const relances = leads.filter(l => l.statut==="relance");

  return (
    <div style={card({ padding:"20px 20px 20px", display:"flex", flexDirection:"column", gap:16 })}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{
          width:7, height:7, borderRadius:"50%", background:T.success,
          animation:"nt-blink 2.5s ease-in-out infinite",
        }}/>
        <p style={{ fontSize:13, fontWeight:600, color:T.text }}>Panneau automate</p>
      </div>

      {/* Queue J+2 */}
      <div>
        <span style={{ ...eyebrow, marginBottom:8 }}>File d'attente J+2 ({queue.length})</span>
        {queue.length === 0
          ? <p style={{ fontSize:12, color:T.muted, textAlign:"center", padding:"10px 0" }}>
              Aucun dossier en attente
            </p>
          : queue.map(l => <QRow key={l.id} lead={l} stage="J+2"/>)
        }
      </div>

      {/* Relancés */}
      {relances.length > 0 && (
        <div>
          <span style={{ ...eyebrow, marginBottom:8 }}>Relancés ({relances.length})</span>
          {relances.map(l => (
            <div key={l.id} style={{
              display:"flex", justifyContent:"space-between",
              padding:"6px 0", borderBottom:`1px solid ${T.divider}`,
            }}>
              <span style={{ fontSize:12, color:T.text, fontWeight:500 }}>{l.client}</span>
              <span style={{ fontSize:11, color:T.muted }}>{l.trajet}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop:`1px solid ${T.divider}`, paddingTop:14 }}>
        <button
          onClick={onSimulate}
          style={{
            width:"100%", padding:"12px 16px", borderRadius:12,
            border:`1px solid ${T.border}`, background:T.bg,
            fontSize:12, fontWeight:600, color:T.text,
            cursor:"pointer", transition:"all .2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background=T.accent;
            e.currentTarget.style.color="#fff";
            e.currentTarget.style.borderColor=T.accent;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background=T.bg;
            e.currentTarget.style.color=T.text;
            e.currentTarget.style.borderColor=T.border;
          }}
        >
          ⚡ Simuler le passage à J+2
        </button>
        <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:10, lineHeight:1.55 }}>
          Bascule les dossiers "Devis envoyé" vers "Relancé J+2" et prépare l'email automatique.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [leads,  setLeads]  = useState<Lead[]>(INIT_LEADS);
  const [toast,  setToast]  = useState<string|null>(null);

  const handleSimulate = () => {
    const count = leads.filter(l => l.statut==="devis_envoye").length;
    if (count === 0) {
      setToast("Aucun dossier en attente — tous les dossiers ont déjà été relancés.");
    } else {
      setLeads(prev => prev.map(l => l.statut==="devis_envoye" ? {...l, statut:"relance"} : l));
      setToast(`✓ ${count} dossier${count>1?"s":""} basculé${count>1?"s":""} en "Relancé J+2" — emails préparés.`);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const totalMontant   = leads.reduce((a,l) => a+l.montant,   0);
  const totalPassagers = leads.reduce((a,l) => a+l.passagers, 0);
  const nbDevis        = leads.filter(l => l.statut==="devis_envoye").length;
  const nbNew          = leads.filter(l => l.statut==="nouveau").length;

  const fmtEur = (n: number) =>
    n.toLocaleString("fr-FR",{ style:"currency", currency:"EUR", maximumFractionDigits:0 });

  const COLS = ["Client","Itinéraire","Volume","Montant","Date","Statut automate"];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${T.bg}; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px; }
        @keyframes nt-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes nt-toast { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @media(min-width:900px){ .nt-admin-grid{ flex-direction:row!important; } }
        @media(min-width:600px){ .nt-kpi-grid{ grid-template-columns:repeat(4,1fr)!important; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; }
        }
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
              <span style={{ fontSize:15, fontWeight:700, letterSpacing:"-0.01em" }}>NeoTravel</span>
              <span style={{
                fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                padding:"3px 9px", borderRadius:20, background:T.bg,
                color:T.muted, border:`1px solid ${T.border}`,
              }}>Admin</span>
            </div>
            <a href="/" style={{
              display:"flex", alignItems:"center", gap:5,
              fontSize:13, fontWeight:500, color:T.muted, textDecoration:"none",
              transition:"color .18s",
            }}
              onMouseEnter={e => e.currentTarget.style.color=T.text}
              onMouseLeave={e => e.currentTarget.style.color=T.muted}>
              <IcoBack/> Vue Client
            </a>
          </div>
        </header>

        <main style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px 0" }}>

          {/* ── Toast ─────────────────────────────────────────────────── */}
          {toast && (
            <div style={{
              marginBottom:20, padding:"12px 16px", borderRadius:12,
              background:"#d1fae5", color:"#065f46",
              fontSize:13, fontWeight:500,
              border:"1px solid #a7f3d0",
              animation:"nt-toast .3s ease",
            }}>{toast}</div>
          )}

          {/* ── Page title ────────────────────────────────────────────── */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.025em", color:T.text }}>
              Espace Direction
            </h1>
            <p style={{ fontSize:14, color:T.muted, marginTop:4 }}>
              Suivi commercial · Pipeline de leads · Automate de relance
            </p>
          </div>

          {/* ── KPIs Bento Box ────────────────────────────────────────── */}
          <div className="nt-kpi-grid" style={{
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20,
          }}>
            <KCard label="Leads captés aujourd'hui" value={String(leads.length)}
              sub="Via l'assistant IA"/>
            <KCard label="Devis calculés & envoyés" value={String(nbDevis)}
              sub="Sans intervention humaine" accent/>
            <KCard label="Volume total" value={`${totalPassagers} pers.`}
              sub="Tous trajets confondus"/>
            <KCard label="CA potentiel"  value={fmtEur(totalMontant)}
              sub={`${nbNew} nouveau${nbNew>1?"x":""} à traiter`}/>
          </div>

          {/* ── Main grid : Table + Panel ─────────────────────────────── */}
          <div className="nt-admin-grid" style={{
            display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start",
          }}>

            {/* ─── Table des leads ──────────────────────────────────── */}
            <div style={{ flex:1, minWidth:0, width:"100%", ...card({ overflow:"hidden" }) }}>

              {/* Table header */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"18px 24px", borderBottom:`1px solid ${T.divider}`,
              }}>
                <div>
                  <p style={{ fontSize:15, fontWeight:600, color:T.text }}>Pipeline des demandes</p>
                  <p style={{ fontSize:12, color:T.muted, marginTop:2 }}>
                    Source : Assistant IA NeoTravel → CRM
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{
                    width:7, height:7, borderRadius:"50%", background:T.success,
                    animation:"nt-blink 2.5s ease-in-out infinite",
                  }}/>
                  <span style={{ fontSize:11, color:T.muted, fontWeight:500 }}>Sync live</span>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.divider}` }}>
                      {COLS.map(c => (
                        <th key={c} style={{
                          textAlign:"left", fontSize:10, fontWeight:700,
                          letterSpacing:"0.1em", textTransform:"uppercase",
                          color:T.muted, padding:"10px 22px", whiteSpace:"nowrap",
                        }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l, i) => (
                      <tr key={l.id}
                        style={{
                          borderBottom: i<leads.length-1 ? `1px solid ${T.divider}` : "none",
                          transition:"background .15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
                        onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                      >
                        <td style={{ padding:"14px 22px", fontSize:13, fontWeight:600, color:T.text, whiteSpace:"nowrap" }}>
                          {l.client}
                        </td>
                        <td style={{ padding:"14px 22px", fontSize:13, color:T.text, whiteSpace:"nowrap" }}>
                          {l.trajet}
                        </td>
                        <td style={{ padding:"14px 22px", fontSize:13, color:T.text }}>
                          {l.passagers} pers.
                        </td>
                        <td style={{ padding:"14px 22px", fontSize:13, fontWeight:600, color:T.text, whiteSpace:"nowrap" }}>
                          {fmtEur(l.montant)}
                        </td>
                        <td style={{ padding:"14px 22px", fontSize:12, color:T.muted, whiteSpace:"nowrap" }}>
                          {l.date}
                        </td>
                        <td style={{ padding:"14px 22px" }}>
                          <Badge s={l.statut}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"12px 22px", borderTop:`1px solid ${T.divider}`,
              }}>
                <span style={{ fontSize:11, color:T.muted }}>
                  {leads.length} entrées · Données simulées NeoTravel IA
                </span>
                <button style={{
                  fontSize:12, color:T.accent, fontWeight:500,
                  background:"none", border:"none", cursor:"pointer",
                  transition:"opacity .18s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity="0.55")}
                  onMouseLeave={e => (e.currentTarget.style.opacity="1")}>
                  Exporter CSV →
                </button>
              </div>
            </div>

            {/* ─── Automate panel ───────────────────────────────────── */}
            <div style={{ width:"100%", flexShrink:0 }} className="nt-panel">
              <style>{`@media(min-width:900px){ .nt-panel{ width:300px!important; } }`}</style>
              <AutomatePanel leads={leads} onSimulate={handleSimulate}/>
            </div>
          </div>
        </main>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER */}
        <footer style={{
          marginTop:60, borderTop:`1px solid ${T.border}`,
          background:T.bg, padding:"28px 24px",
        }}>
          <div style={{
            maxWidth:1200, margin:"0 auto",
            display:"flex", flexDirection:"column", alignItems:"center", gap:14,
          }}>
            <p style={{ fontSize:13, fontWeight:500, color:T.muted, textAlign:"center" }}>
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