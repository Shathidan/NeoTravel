"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { T } from "./theme";
import { IcoArrowRight } from "./icons";

/* ═══════════════════════════════════════════════════════════════
   CARROUSEL PHOTO — autocars, groupes en voyage, routes. Défilement
   automatique, flèches + points de navigation, pause au survol.
═══════════════════════════════════════════════════════════════ */

interface Slide {
  src: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=1600&q=80",
    alt: "Autocar de tourisme stationné, prêt pour un départ de groupe",
  },
  {
    src: "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1600&q=80",
    alt: "Groupe de voyageurs installés à bord d'un autocar",
  },
  {
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    alt: "Autocar grand tourisme sur une route de montagne",
  },
  {
    src: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80",
    alt: "Autocar de groupe stationné avant un trajet longue distance",
  },
  {
    src: "https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?auto=format&fit=crop&w=1600&q=80",
    alt: "Route de campagne bordée d'arbres, paysage de trajet de groupe",
  },
  {
    src: "https://images.unsplash.com/photo-1603521801204-8d9c70dd08c8?auto=format&fit=crop&w=1600&q=80",
    alt: "Autocar en circulation sur une route dégagée",
  },
];

const AUTOPLAY_MS = 4500;

export default function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((p) => (p + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 22,
          overflow: "hidden",
          border: `1px solid ${T.line}`,
          boxShadow: "0 8px 28px rgba(28,37,33,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${SLIDES.length * 100}%`,
            transform: `translateX(-${index * (100 / SLIDES.length)}%)`,
            transition: "transform .5s ease",
          }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              style={{
                flex: `0 0 ${100 / SLIDES.length}%`,
                height: "clamp(220px, 38vw, 440px)",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>

        <button
          aria-label="Photo précédente"
          onClick={() => goTo(index - 1)}
          style={{
            position: "absolute",
            top: "50%",
            left: 14,
            transform: "translateY(-50%) rotate(180deg)",
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.white,
            boxShadow: "0 2px 8px rgba(28,37,33,0.12)",
          }}
        >
          <IcoArrowRight size={16} />
        </button>
        <button
          aria-label="Photo suivante"
          onClick={() => goTo(index + 1)}
          style={{
            position: "absolute",
            top: "50%",
            right: 14,
            transform: "translateY(-50%)",
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.white,
            boxShadow: "0 2px 8px rgba(28,37,33,0.12)",
          }}
        >
          <IcoArrowRight size={16} />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            aria-label={`Aller à la photo ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? 22 : 8,
              height: 8,
              borderRadius: 4,
              background: i === index ? T.emerald : T.lineStrong,
              border: "none",
              transition: "width .25s ease, background .25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
