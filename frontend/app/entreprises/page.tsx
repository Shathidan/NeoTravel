"use client";
import Link from "next/link";
import GlobalStyles from "../../components/site/GlobalStyles";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import { T } from "../../components/site/theme";
import { IcoUsers, IcoBook, IcoShield, IcoCalendar, IcoCheck, IcoArrowRight } from "../../components/site/icons";

const SEGMENTS = [
  {
    id: "entreprises",
    icon: <IcoUsers size={20} />,
    title: "Entreprises & Séminaires",
    context:
      "Déplacements professionnels récurrents, séminaires, conventions, offsites d'équipe — souvent décidés tardivement, avec une politique de déplacement à respecter.",
    points: [
      "Devis conforme à votre politique de déplacement, généré en quelques échanges",
      "Facturation centralisée pour plusieurs trajets ou plusieurs sites",
      "Suivi dédié pour les réservations récurrentes",
    ],
  },
  {
    id: "ecoles",
    icon: <IcoBook size={20} />,
    title: "Sorties Scolaires",
    context:
      "Encadrement d'élèves, validation par la direction et les familles, budget souvent serré et fixé à l'avance.",
    points: [
      "Devis transparent, facile à partager directement avec les parents",
      "Véhicules conformes aux normes de transport scolaire",
      "Accompagnement dans la préparation des autorisations de sortie",
    ],
  },
  {
    id: "associations",
    icon: <IcoShield size={20} />,
    title: "Associations & Clubs",
    context:
      "Compétitions, sorties de club, rassemblements — avec des budgets associatifs limités et des effectifs qui varient d'un événement à l'autre.",
    points: [
      "Tarification ajustée à l'effectif réel, sans minimum imposé",
      "Flexibilité sur les horaires de départ et de retour",
      "Devis modifiable en direct si l'effectif évolue",
    ],
  },
  {
    id: "evenements",
    icon: <IcoCalendar size={20} />,
    title: "Comités d'Entreprise & Événements",
    context:
      "Coordination de plusieurs véhicules le même jour, horaires multiples, effectifs qui changent jusqu'au dernier moment.",
    points: [
      "Coordination de plusieurs autocars pour un même événement",
      "Point de contact unique pour l'ensemble de la logistique transport",
      "Devis consolidé pour faciliter la validation budgétaire",
    ],
  },
];

export default function EntreprisesPage() {
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: T.ink, fontFamily: T.fontBody, color: T.white }}>
        <Header active="/entreprises" />

        <main>
          <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 0", textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontFamily: T.fontBody,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: T.emerald,
                marginBottom: 14,
              }}
            >
              Solutions par profil
            </span>
            <h1
              style={{
                fontFamily: T.fontDisplay,
                fontSize: "clamp(28px,4.6vw,46px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: T.white,
                lineHeight: 1.14,
                marginBottom: 16,
              }}
            >
              Des solutions taillées pour votre organisation.
            </h1>
            <p style={{ fontSize: 15.5, color: T.ash, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              Chaque profil a ses contraintes propres. Voici comment NeoTravel s&rsquo;y adapte, secteur par secteur.
            </p>
          </section>

          <section style={{ maxWidth: 1100, margin: "56px auto 0", padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {SEGMENTS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                style={{
                  background: T.panel,
                  border: `1px solid ${T.line}`,
                  borderRadius: 20,
                  padding: "30px 28px",
                  scrollMarginTop: 80,
                  boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: T.panelHi,
                      border: `1px solid ${T.lineStrong}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.emerald,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 21, fontWeight: 700, color: T.white }}>{s.title}</p>
                </div>

                <div className="rt-segment-body" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div>
                    <p
                      style={{
                        fontFamily: T.fontBody,
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: T.ashDim,
                        marginBottom: 10,
                      }}
                    >
                      Votre contexte
                    </p>
                    <p style={{ fontSize: 14, color: T.ash, lineHeight: 1.75 }}>{s.context}</p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: T.fontBody,
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: T.emerald,
                        marginBottom: 10,
                      }}
                    >
                      Ce que NeoTravel apporte
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {s.points.map((pt) => (
                        <div key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: T.emerald, marginTop: 2, flexShrink: 0 }}>
                            <IcoCheck size={14} />
                          </span>
                          <span style={{ fontSize: 14, color: T.white, lineHeight: 1.65 }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
                  <Link
                    href="/#assistant"
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: T.emerald, textDecoration: "none" }}
                  >
                    Démarrer une demande pour ce profil <IcoArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </section>

          <section style={{ maxWidth: 1200, margin: "80px auto 0", padding: "0 24px" }}>
            <div
              style={{
                borderRadius: 24,
                background: T.panel,
                border: `1px solid ${T.line}`,
                padding: "44px 32px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
              }}
            >
              <p style={{ fontSize: 16, color: T.white, marginBottom: 22, lineHeight: 1.6 }}>
                Votre profil ne rentre dans aucune case ? Décrivez-le directement à l&rsquo;assistant.
              </p>
              <Link
                href="/#assistant"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.amber,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "13px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                }}
              >
                Discuter avec l&rsquo;assistant <IcoArrowRight size={14} />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style>{`
        @media (min-width: 760px) {
          .rt-segment-body { flex-direction: row !important; }
          .rt-segment-body > div { flex: 1; }
        }
      `}</style>
    </>
  );
}
