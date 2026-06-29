import type { ReactNode } from "react";
import { IcoSnow, IcoWifi, IcoPlug, IcoAccess, IcoUsers, IcoBook, IcoCalendar, IcoShield } from "../components/site/icons";
import type { Vehicle } from "../components/site/VehicleCard";
import type { FaqItem } from "../components/site/Faq";

/* ═══════════════════════════════════════════════════════════════
   CONTENU PARTAGÉ — source unique utilisée par l'accueil, /flotte
   et /entreprises, pour éviter toute incohérence entre les pages.
═══════════════════════════════════════════════════════════════ */

export const FLEET: Vehicle[] = [
  {
    fareClass: "CITY",
    name: "Navette",
    capacity: "1 — 9 pers.",
    description: "Pour les petits comités et les transferts de dernière minute, avec prise en charge en centre-ville.",
    amenities: [
      { icon: <IcoSnow size={14} />, label: "Climatisation" },
      { icon: <IcoPlug size={14} />, label: "Prises USB" },
    ],
  },
  {
    fareClass: "STANDARD",
    name: "Minibus",
    capacity: "10 — 19 pers.",
    description: "Le format idéal pour les associations, petites équipes et sorties de proximité.",
    amenities: [
      { icon: <IcoSnow size={14} />, label: "Climatisation" },
      { icon: <IcoWifi size={14} />, label: "Wi-Fi" },
      { icon: <IcoPlug size={14} />, label: "Prises USB" },
    ],
  },
  {
    fareClass: "GROUPE",
    name: "Autocar",
    capacity: "20 — 55 pers.",
    description: "Le choix de référence pour les séminaires, sorties scolaires et événements de moyenne ampleur.",
    amenities: [
      { icon: <IcoSnow size={14} />, label: "Climatisation" },
      { icon: <IcoWifi size={14} />, label: "Wi-Fi" },
      { icon: <IcoPlug size={14} />, label: "Prises USB" },
      { icon: <IcoAccess size={14} />, label: "Accès PMR" },
    ],
  },
  {
    fareClass: "PREMIUM",
    name: "Autocar Grand Tourisme",
    capacity: "36 — 90 pers.",
    description: "Pour les longs trajets et les groupes importants : sièges inclinables, toilettes à bord, confort premium.",
    amenities: [
      { icon: <IcoSnow size={14} />, label: "Climatisation" },
      { icon: <IcoWifi size={14} />, label: "Wi-Fi" },
      { icon: <IcoPlug size={14} />, label: "Prises USB" },
      { icon: <IcoAccess size={14} />, label: "Accès PMR" },
    ],
  },
];

export interface SegmentTeaser {
  href: string;
  icon: ReactNode;
  title: string;
  blurb: string;
}

export const SEGMENTS_TEASER: SegmentTeaser[] = [
  {
    href: "/entreprises#entreprises",
    icon: <IcoUsers size={18} />,
    title: "Entreprises & Séminaires",
    blurb: "Transferts de collaborateurs, offsites, conventions — un devis cohérent avec votre politique de déplacement.",
  },
  {
    href: "/entreprises#ecoles",
    icon: <IcoBook size={18} />,
    title: "Sorties Scolaires",
    blurb: "Encadrement, sécurité et transparence du devis pour les établissements et les parents.",
  },
  {
    href: "/entreprises#associations",
    icon: <IcoShield size={18} />,
    title: "Associations & Clubs",
    blurb: "Des trajets fiables pour vos compétitions, sorties et rassemblements, sans budget surdimensionné.",
  },
  {
    href: "/entreprises#evenements",
    icon: <IcoCalendar size={18} />,
    title: "Comités d'Entreprise & Événements",
    blurb: "Gestion d'effectifs variables, horaires multiples, coordination de plusieurs véhicules le même jour.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Le montant affiché par l'assistant est-il définitif ?",
    a: "C'est une estimation. Un conseiller NeoTravel la confirme sous 24h en fonction des disponibilités réelles et des options choisies.",
  },
  {
    q: "Quelles zones desservez-vous ?",
    a: "Tous les trajets de groupe en France métropolitaine, et à l'international sur demande spécifique (Europe notamment).",
  },
  {
    q: "Quels types de véhicules proposez-vous ?",
    a: "De la navette 9 places à l'autocar grand tourisme 90 places. Le détail complet est disponible sur la page Flotte.",
  },
  {
    q: "Puis-je modifier ma demande après l'avoir envoyée ?",
    a: "Oui : poursuivez simplement la conversation avec l'assistant, le billet de devis se met à jour en direct.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Après validation du devis par un conseiller, vous recevez une facture avec plusieurs options de paiement, y compris en plusieurs fois pour les groupes importants.",
  },
  {
    q: "Mes données sont-elles conservées ?",
    a: "Uniquement le temps de traiter votre demande, sans partage à des tiers — conformément au RGPD.",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "En moins de deux minutes, j'avais un devis complet pour 60 personnes. On a signé dans la foulée.",
    author: "Sophie M.",
    role: "DRH",
    company: "École Centrale Lyon",
  },
  {
    quote: "Fini les allers-retours par email. L'assistant a tout capté du premier coup et le devis était impeccable.",
    author: "Thomas R.",
    role: "Responsable événementiel",
    company: "Sanofi France",
  },
  {
    quote: "L'outil idéal pour les sorties scolaires. Simple, rapide, et les parents ont adoré la transparence du devis.",
    author: "Marie-Claire D.",
    role: "Directrice pédagogique",
    company: "Lycée Saint-Exupéry",
  },
];
