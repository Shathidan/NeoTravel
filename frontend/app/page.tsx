"use client";
import Link from "next/link";
import GlobalStyles from "../components/site/GlobalStyles";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import SectionHeading from "../components/site/SectionHeading";
import AssistantConsole from "../components/site/AssistantConsole";
import RouteDivider from "../components/site/RouteDivider";
import TicketStub from "../components/site/TicketStub";
import StepCard from "../components/site/StepCard";
import VehicleCard from "../components/site/VehicleCard";
import SegmentTeaserCard from "../components/site/SegmentTeaserCard";
import TestiCard from "../components/site/TestiCard";
import Faq from "../components/site/Faq";
import { T } from "../components/site/theme";
import { IcoBus, IcoShield, IcoClock, IcoArrowRight } from "../components/site/icons";
import { FLEET, SEGMENTS_TEASER, FAQ_ITEMS, TESTIMONIALS } from "../lib/content";

export default function HomePage() {
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: T.ink, fontFamily: T.fontBody, color: T.white }}>
        <Header active="/" />

        <main>
          {/* ━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* atmosphère discrète : un seul halo + une texture de lignes de route */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(31,157,120,0.16), transparent 60%)`,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${T.lineSoft} 1px, transparent 1px), linear-gradient(90deg, ${T.lineSoft} 1px, transparent 1px)`,
                backgroundSize: "52px 52px",
                zIndex: 0,
                maskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />

            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 56px", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "6px 16px",
                    borderRadius: 24,
                    background: T.panel,
                    border: `1px solid ${T.line}`,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, animation: "rt-blink 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: T.fontMono, fontSize: 11.5, fontWeight: 500, letterSpacing: "0.06em", color: T.ash }}>
                    DEVIS EN DIRECT · ASSISTANT CONNECTÉ
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: "clamp(32px,5.2vw,58px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.08,
                    color: T.white,
                    marginBottom: 18,
                  }}
                >
                  Votre transport de groupe,
                  <br />
                  décrit en une phrase
                  <span style={{ color: T.emeraldBr }}>, chiffré en une minute.</span>
                </h1>
                <p style={{ fontSize: 16.5, color: T.ash, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
                  Parlez librement à l&rsquo;assistant. Il identifie votre trajet, votre effectif et le véhicule adapté,
                  puis prépare votre devis pendant que vous discutez.
                </p>
              </div>

              <AssistantConsole />
            </section>
          </div>

          <div style={{ padding: "8px 0 64px" }}>
            <RouteDivider />
          </div>

          {/* ━━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <SectionHeading eyebrow="NeoTravel en chiffres" title="La logistique de groupe, mesurée." />
            <div className="rt-stats" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <TicketStub value="2 400" unit="+" label="Trajets organisés avec succès" icon={<IcoBus size={18} />} />
              <TicketStub value="98" unit="%" label="Taux de satisfaction client" icon={<IcoShield size={18} />} />
              <TicketStub value="< 2" unit="min" label="Délai moyen de génération d'un devis" icon={<IcoClock size={18} />} />
            </div>
          </section>

          {/* ━━━━ COMMENT ÇA MARCHE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section id="comment" style={{ maxWidth: 1200, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading
              eyebrow="Itinéraire"
              title="De la demande au devis, sans détour."
              sub="Trois étapes, à l'image d'un véritable parcours de voyageur."
            />
            <div className="rt-steps" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <StepCard
                code="01 — EMBARQUEMENT"
                icon={<IcoBus size={18} />}
                title="Décrivez votre trajet"
                body="Villes, date, nombre de voyageurs — dans une simple conversation. Aucun formulaire à remplir."
              />
              <StepCard
                code="02 — CONTRÔLE"
                icon={<IcoShield size={18} />}
                title="L'assistant analyse"
                body="Le bon véhicule est identifié, la distance calculée et le tarif fixé, en temps réel."
              />
              <StepCard
                code="03 — DÉPART"
                icon={<IcoClock size={18} />}
                title="Le devis est prêt"
                body="Téléchargez le PDF immédiatement. Un conseiller reste disponible pour finaliser."
              />
            </div>
          </section>

          {/* ━━━━ FLOTTE (teaser) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading
              eyebrow="Notre flotte"
              title="Le bon véhicule pour le bon effectif."
              sub="De la navette 9 places à l'autocar grand tourisme, chaque devis s'appuie sur un parc qualifié."
            />
            <div className="rt-fleet" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 28 }}>
              {FLEET.slice(0, 3).map((v) => (
                <VehicleCard key={v.name} v={v} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <Link
                href="/flotte"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: T.emeraldBr, textDecoration: "none" }}
              >
                Voir toute la flotte <IcoArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* ━━━━ SOLUTIONS PAR PROFIL (teaser) ━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading
              eyebrow="Solutions par profil"
              title="Chaque organisation voyage différemment."
              sub="Entreprises, écoles, associations ou comités — découvrez l'approche dédiée à votre profil."
            />
            <div className="rt-segments" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 28 }}>
              {SEGMENTS_TEASER.map((s) => (
                <Link key={s.title} href={s.href} style={{ textDecoration: "none" }}>
                  <SegmentTeaserCard icon={s.icon} title={s.title} blurb={s.blurb} />
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <Link
                href="/entreprises"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: T.emeraldBr, textDecoration: "none" }}
              >
                Explorer toutes les solutions <IcoArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* ━━━━ TÉMOIGNAGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading eyebrow="Témoignages" title="Ils nous font confiance." />
            <div className="rt-testi" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {TESTIMONIALS.map((t) => (
                <TestiCard key={t.author} quote={t.quote} author={t.author} role={t.role} company={t.company} />
              ))}
            </div>
          </section>

          {/* ━━━━ FAQ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section id="faq" style={{ maxWidth: 760, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading eyebrow="Questions fréquentes" title="Avant de monter à bord." />
            <Faq items={FAQ_ITEMS} />
          </section>

          {/* ━━━━ CTA — TAMPON ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "96px auto 0", padding: "0 24px" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 26,
                background: T.panel,
                border: `1px solid ${T.line}`,
                padding: "56px 40px",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 0%, rgba(63,207,156,0.14), transparent 65%)`,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 24,
                  right: 36,
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  border: `2px solid ${T.emeraldBr}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(-14deg)",
                  opacity: 0.35,
                }}
                className="rt-stamp"
              >
                <span style={{ fontFamily: T.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.emeraldBr, textAlign: "center" }}>
                  PRÊT AU
                  <br />
                  DÉPART
                </span>
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: 11.5,
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: T.emeraldBr,
                    marginBottom: 16,
                  }}
                >
                  Aucun engagement · Aucun formulaire
                </p>
                <h2
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: "clamp(24px,4vw,38px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: T.white,
                    marginBottom: 26,
                    lineHeight: 1.18,
                  }}
                >
                  Votre prochain trajet de groupe
                  <br />
                  commence par un message.
                </h2>
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
                    padding: "14px 26px",
                    borderRadius: 13,
                    textDecoration: "none",
                  }}
                >
                  Démarrer la conversation <IcoArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
