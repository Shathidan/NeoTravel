"use client";
import Link from "next/link";
import GlobalStyles from "../../components/site/GlobalStyles";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import SectionHeading from "../../components/site/SectionHeading";
import VehicleCard from "../../components/site/VehicleCard";
import { T } from "../../components/site/theme";
import { IcoUsers, IcoRoute, IcoStar, IcoArrowRight } from "../../components/site/icons";
import { FLEET } from "../../lib/content";

const CRITERIA = [
  { icon: <IcoUsers size={18} />, title: "L'effectif", body: "Le nombre de voyageurs détermine d'emblée la classe de véhicule la plus adaptée." },
  { icon: <IcoRoute size={18} />, title: "La distance", body: "Au-delà de 3h de route, l'assistant privilégie un autocar équipé pour le confort longue distance." },
  { icon: <IcoStar size={18} />, title: "Le niveau de confort", body: "Sièges inclinables, toilettes à bord, Wi-Fi — précisez vos attentes, le devis s'ajuste." },
];

export default function FlottePage() {
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: T.ink, fontFamily: T.fontBody, color: T.white }}>
        <Header active="/flotte" />

        <main>
          <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
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
                Notre flotte
              </span>
              <h1
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: "clamp(28px,4.6vw,48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: T.white,
                  lineHeight: 1.12,
                  marginBottom: 16,
                }}
              >
                Un parc qualifié pour
                <br />
                chaque effectif.
              </h1>
              <p style={{ fontSize: 15.5, color: T.ash, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                L&rsquo;assistant choisit le véhicule à votre place en fonction de votre trajet — voici ce qui compose
                notre parc.
              </p>
            </div>

            <div className="rt-fleet" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {FLEET.map((v) => (
                <VehicleCard key={v.name} v={v} />
              ))}
            </div>
          </section>

          {/* ━━━━ COMMENT LE VÉHICULE EST CHOISI ━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "96px auto 0", padding: "0 24px" }}>
            <SectionHeading
              eyebrow="Critères de sélection"
              title="Comment l'assistant choisit votre véhicule."
              sub="Trois critères suffisent à l'assistant pour pré-sélectionner la classe la plus pertinente."
            />
            <div className="rt-steps" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {CRITERIA.map((c) => (
                <div
                  key={c.title}
                  style={{
                    background: T.panel,
                    border: `1px solid ${T.line}`,
                    borderRadius: 18,
                    padding: "26px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: T.panelHi,
                      border: `1px solid ${T.lineStrong}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.emeraldBr,
                    }}
                  >
                    {c.icon}
                  </div>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 16.5, fontWeight: 700, color: T.white }}>{c.title}</p>
                  <p style={{ fontSize: 13.5, color: T.ash, lineHeight: 1.7 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "96px auto 0", padding: "0 24px" }}>
            <div
              style={{
                borderRadius: 24,
                background: T.panel,
                border: `1px solid ${T.line}`,
                padding: "44px 32px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 16, color: T.white, marginBottom: 22, lineHeight: 1.6 }}>
                Indiquez votre effectif et votre destination — l&rsquo;assistant se charge du reste.
              </p>
              <Link
                href="/#assistant"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: `linear-gradient(135deg, ${T.emeraldBr}, ${T.emerald})`,
                  color: T.emeraldInk,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "13px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                }}
              >
                Obtenir mon devis <IcoArrowRight size={14} />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
