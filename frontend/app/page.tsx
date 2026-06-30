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
import PhotoCarousel from "../components/site/PhotoCarousel";
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
                background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(15,110,92,0.08), transparent 60%)`,
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

            {/* fond animé sobre : formes organiques floues, très calmes, jamais au-dessus du contenu */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-12%",
                left: "-8%",
                width: 480,
                height: 480,
                borderRadius: "50%",
                background: T.emerald,
                opacity: 0.07,
                filter: "blur(90px)",
                zIndex: 0,
                pointerEvents: "none",
                animation: "rt-blob-a 22s ease-in-out infinite",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "2%",
                right: "-10%",
                width: 420,
                height: 420,
                borderRadius: "50%",
                background: T.emerald,
                opacity: 0.06,
                filter: "blur(90px)",
                zIndex: 0,
                pointerEvents: "none",
                animation: "rt-blob-b 26s ease-in-out infinite",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "-18%",
                left: "32%",
                width: 380,
                height: 380,
                borderRadius: "50%",
                background: T.amber,
                opacity: 0.05,
                filter: "blur(90px)",
                zIndex: 0,
                pointerEvents: "none",
                animation: "rt-blob-c 19s ease-in-out infinite",
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
                    boxShadow: "0 1px 3px rgba(28,37,33,0.05)",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, animation: "rt-blink 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: T.ash }}>
                    Devis en direct · Assistant connecté
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: "clamp(32px,5.2vw,58px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.08,
                    color: T.white,
                    marginBottom: 18,
                  }}
                >
                  Votre transport de groupe,
                  <br />
                  décrit en une phrase
                  <span style={{ color: T.emerald }}>, chiffré en une minute.</span>
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

          {/* ━━━━ CARROUSEL PHOTO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "88px auto 0", padding: "0 24px" }}>
            <SectionHeading
              eyebrow="En images"
              title="Vos voyages de groupe, en images"
              sub="Autocars, groupes en route, paysages traversés — un aperçu de chaque trajet organisé par NeoTravel."
            />
            <PhotoCarousel />
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
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: T.emerald, textDecoration: "none" }}
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
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: T.emerald, textDecoration: "none" }}
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

          {/* ━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section style={{ maxWidth: 1200, margin: "96px auto 0", padding: "0 24px" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 26,
                background: T.emeraldDp,
                padding: "56px 40px",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08), transparent 65%)`,
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    fontFamily: T.fontBody,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 16,
                  }}
                >
                  Aucun engagement · Aucun formulaire
                </p>
                <h2
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: "clamp(24px,4vw,38px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#ffffff",
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
                    background: T.amber,
                    color: "#ffffff",
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
