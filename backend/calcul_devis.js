/**
 * MOTEUR DE TARIFICATION NEOTRAVEL
 * ─────────────────────────────────────────────────────────────────────────────
 * Calcul déterministe, documenté et auditable.
 * Ce moteur ne fait JAMAIS appel à un LLM — chaque étape est traçable.
 *
 * Règle d'or : l'IA décide quoi appeler, ce code exécute le calcul.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// TABLES DE RÉFÉRENCE (pilotables sans toucher à la logique)
// ─────────────────────────────────────────────────────────────────────────────

/** Grille forfaitaire transfert simple aller (jusqu'à 180 km) */
const GRILLE_FORFAIT = [
  { maxKm: 10,  prix: 250 },
  { maxKm: 20,  prix: 250 },
  { maxKm: 30,  prix: 250 },
  { maxKm: 40,  prix: 320 },
  { maxKm: 50,  prix: 350 },
  { maxKm: 60,  prix: 390 },
  { maxKm: 70,  prix: 430 },
  { maxKm: 80,  prix: 500 },
  { maxKm: 90,  prix: 540 },
  { maxKm: 100, prix: 580 },
  { maxKm: 110, prix: 620 },
  { maxKm: 120, prix: 660 },
  { maxKm: 130, prix: 700 },
  { maxKm: 140, prix: 740 },
  { maxKm: 150, prix: 780 },
  { maxKm: 160, prix: 820 },
  { maxKm: 170, prix: 860 },
  { maxKm: 180, prix: 900 },
];

/**
 * Coefficients de saisonnalité par mois (1 = janvier … 12 = décembre)
 * Valeur : multiplicateur additionnel (ex: -0.07 = -7%)
 */
const COEFF_SAISONNALITE = {
  1:  -0.07, // Janvier   — basse
  2:  -0.07, // Février   — basse
  3:   0.10, // Mars      — haute
  4:   0.10, // Avril     — haute
  5:   0.15, // Mai       — très haute
  6:   0.15, // Juin      — très haute
  7:   0.10, // Juillet   — haute
  8:  -0.07, // Août      — basse
  9:   0.00, // Septembre — moyenne
  10:  0.00, // Octobre   — moyenne
  11: -0.07, // Novembre  — basse
  12:  0.00, // Décembre  — moyenne
};

/**
 * Pondération date de demande vs date de départ
 * Intervalle en jours entre la demande et le départ
 */
const PONDERATION_DELAI = [
  { code: "DD_PRIORITAIRE",   maxJours: 14,  coeff:  0.10 },
  { code: "DD_URGENT",        maxJours: 30,  coeff:  0.05 },
  { code: "DD_NORMAL",        maxJours: 90,  coeff: -0.05 },
  { code: "DD_3MOISETPLUS",   maxJours: Infinity, coeff: -0.10 },
];

/**
 * Pondération capacité véhicule (nombre de passagers)
 * au-delà de 85 passagers : flux manuel vers commercial
 */
const PONDERATION_CAPACITE = [
  { maxPassagers: 19,  coeff: -0.05 },
  { maxPassagers: 53,  coeff:  0.00 },
  { maxPassagers: 63,  coeff:  0.15 },
  { maxPassagers: 67,  coeff:  0.20 },
  { maxPassagers: 85,  coeff:  0.40 },
];

/** Marge commerciale appliquée avant envoi au client */
const MARGE = 0.15;

/** TVA applicable (transport de personnes en France) */
const TVA = 0.10;

// ─────────────────────────────────────────────────────────────────────────────
// FONCTIONS UTILITAIRES INTERNES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule le prix de base HT pour un transfert simple aller selon la distance.
 * @param {number} km
 * @returns {number} Prix HT en euros
 */
function _prixBaseTransfertSimple(km) {
  if (km <= 0) throw new Error("La distance doit être supérieure à 0 km.");

  // Forfait jusqu'à 180 km
  const tranche = GRILLE_FORFAIT.find((t) => km <= t.maxKm);
  if (tranche) return tranche.prix;

  // Au-delà de 180 km : (km × 2) × 2,5 €/km
  return (km * 2) * 2.5;
}

/**
 * Retourne le coefficient de saisonnalité pour un mois donné.
 * @param {number} mois — 1 à 12
 * @returns {number}
 */
function _coeffSaisonnalite(mois) {
  if (mois < 1 || mois > 12) throw new Error(`Mois invalide : ${mois}`);
  return COEFF_SAISONNALITE[mois];
}

/**
 * Retourne le code et le coefficient de pondération selon le délai avant départ.
 * @param {number} joursAvantDepart
 * @returns {{ code: string, coeff: number }}
 */
function _ponterationDelai(joursAvantDepart) {
  if (joursAvantDepart < 0) throw new Error("Le départ ne peut pas être dans le passé.");
  const tranche = PONDERATION_DELAI.find((t) => joursAvantDepart <= t.maxJours);
  return { code: tranche.code, coeff: tranche.coeff };
}

/**
 * Retourne le coefficient de pondération selon la capacité du véhicule.
 * Lève une erreur si le nombre de passagers dépasse 85 (flux manuel).
 * @param {number} nbPassagers
 * @returns {number}
 */
function _coeffCapacite(nbPassagers) {
  if (nbPassagers <= 0) throw new Error("Le nombre de passagers doit être > 0.");
  const tranche = PONDERATION_CAPACITE.find((t) => nbPassagers <= t.maxPassagers);
  if (!tranche) {
    throw new Error(
      `FLUX_MANUEL : ${nbPassagers} passagers dépassent la capacité automatisée (>85). Transmettre au commercial.`
    );
  }
  return tranche.coeff;
}

/**
 * Calcule le nombre de jours entre deux dates.
 * @param {Date} dateDemande
 * @param {Date} dateDepart
 * @returns {number}
 */
function _joursEntre(dateDemande, dateDepart) {
  const msParJour = 1000 * 60 * 60 * 24;
  return Math.floor((dateDepart - dateDemande) / msParJour);
}

// ─────────────────────────────────────────────────────────────────────────────
// FONCTION PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule le devis TTC Neotravel pour un transfert en autocar.
 *
 * @param {Object} params
 * @param {number}  params.distanceKm         — Distance en kilomètres (trajet aller)
 * @param {boolean} params.allerRetour         — true = aller/retour, false = aller simple
 * @param {number}  params.nbPassagers         — Nombre de passagers (détermine la pondération capacité)
 * @param {Date}    params.dateDemande          — Date à laquelle la demande est reçue
 * @param {Date}    params.dateDepart           — Date du départ
 * @param {Object}  [params.options]            — Options facultatives
 * @param {number}  [params.options.nbJoursGuide=0]      — Nombre de jours avec guide/accompagnateur
 * @param {number}  [params.options.nbNuitssChauffeur=0] — Nombre de nuits chauffeur
 * @param {boolean} [params.options.peagesInclus=false]  — Inclure un forfait péages
 * @param {number}  [params.options.forfaitPeages=0]     — Montant forfait péages si inclus
 *
 * @returns {Object} Détail complet du calcul + prix TTC final
 */
function calculer_devis({
  distanceKm,
  allerRetour = false,
  nbPassagers,
  dateDemande,
  dateDepart,
  options = {},
}) {
  // ── 1. Validation des entrées ──────────────────────────────────────────────
  if (typeof distanceKm !== "number" || distanceKm <= 0)
    throw new Error("distanceKm doit être un nombre positif.");
  if (typeof nbPassagers !== "number" || nbPassagers <= 0)
    throw new Error("nbPassagers doit être un entier positif.");
  if (!(dateDemande instanceof Date) || !(dateDepart instanceof Date))
    throw new Error("dateDemande et dateDepart doivent être des objets Date.");
  if (dateDepart < dateDemande)
    throw new Error("dateDepart ne peut pas être antérieure à dateDemande.");

  // ── 2. Prix base (transfert simple aller) ─────────────────────────────────
  const prixBaseAller = _prixBaseTransfertSimple(distanceKm);
  const prixBase = allerRetour ? prixBaseAller * 2 : prixBaseAller;

  // ── 3. Coefficients ───────────────────────────────────────────────────────
  const moisDepart = dateDepart.getMonth() + 1; // getMonth() retourne 0-11
  const coeffSaison = _coeffSaisonnalite(moisDepart);

  const joursAvantDepart = _joursEntre(dateDemande, dateDepart);
  const { code: codeDelai, coeff: coeffDelai } = _ponterationDelai(joursAvantDepart);

  const coeffCapacite = _coeffCapacite(nbPassagers);

  // ── 4. Application des coefficients (additifs sur la base) ────────────────
  const totalCoeffs = coeffSaison + coeffDelai + coeffCapacite;
  const prixApresCoeffs = prixBase * (1 + totalCoeffs);

  // ── 5. Options supplémentaires ────────────────────────────────────────────
  const {
    nbJoursGuide = 0,
    nbNuitsChauffeur = 0,
    peagesInclus = false,
    forfaitPeages = 0,
  } = options;

  const supplementGuide     = nbJoursGuide     * 80;   // 80 € HT / jour
  const supplementChauffeur = nbNuitsChauffeur * 120;  // 120 € HT / nuit
  const supplementPeages    = peagesInclus ? forfaitPeages : 0;

  const totalOptions = supplementGuide + supplementChauffeur + supplementPeages;

  // ── 6. Sous-total HT avant marge ─────────────────────────────────────────
  const sousTotal = prixApresCoeffs + totalOptions;

  // ── 7. Marge commerciale (+15%) ──────────────────────────────────────────
  const montantMarge = sousTotal * MARGE;
  const prixHT = sousTotal + montantMarge;

  // ── 8. TVA (10%) ─────────────────────────────────────────────────────────
  const montantTVA = prixHT * TVA;
  const prixTTC = prixHT + montantTVA;

  // ── 9. Résultat détaillé (audit trail complet) ────────────────────────────
  return {
    // Paramètres d'entrée
    input: {
      distanceKm,
      allerRetour,
      nbPassagers,
      dateDemande: dateDemande.toISOString(),
      dateDepart:  dateDepart.toISOString(),
      joursAvantDepart,
      moisDepart,
      options,
    },

    // Détail du calcul
    detail: {
      prixBaseAller,
      multiplicateurAllerRetour: allerRetour ? 2 : 1,
      prixBase,

      coefficients: {
        saisonnalite: {
          mois: moisDepart,
          valeur: coeffSaison,
          label: _labelSaison(moisDepart),
        },
        delai: {
          joursAvantDepart,
          code: codeDelai,
          valeur: coeffDelai,
        },
        capacite: {
          nbPassagers,
          valeur: coeffCapacite,
        },
        totalCoeffs,
      },

      prixApresCoeffs: _arrondir(prixApresCoeffs),

      options: {
        supplementGuide,
        supplementChauffeur,
        supplementPeages,
        totalOptions,
      },

      sousTotal:     _arrondir(sousTotal),
      marge:         { taux: MARGE, montant: _arrondir(montantMarge) },
      prixHT:        _arrondir(prixHT),
      tva:           { taux: TVA,   montant: _arrondir(montantTVA) },
    },

    // Prix final
    prixTTC: _arrondir(prixTTC),
    prixHT:  _arrondir(prixHT),

    // Métadonnées
    meta: {
      version: "1.0.0",
      calculeLe: new Date().toISOString(),
      auditOk: true,
    },
  };
}

/** Arrondit à 2 décimales */
function _arrondir(n) {
  return Math.round(n * 100) / 100;
}

/** Libellé lisible de la saison */
function _labelSaison(mois) {
  const labels = {
    1: "Basse", 2: "Basse", 3: "Haute", 4: "Haute",
    5: "Très haute", 6: "Très haute", 7: "Haute", 8: "Basse",
    9: "Moyenne", 10: "Moyenne", 11: "Basse", 12: "Moyenne",
  };
  return labels[mois];
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

// Node.js / ESM
if (typeof module !== "undefined") module.exports = { calculer_devis };
// ESM : export { calculer_devis };

// ─────────────────────────────────────────────────────────────────────────────
// JEU DE TESTS (à exécuter avec : node calculer_devis.js)
// ─────────────────────────────────────────────────────────────────────────────

function _runTests() {
  console.log("═══════════════════════════════════════════");
  console.log("  TESTS MOTEUR NEOTRAVEL — calculer_devis()");
  console.log("═══════════════════════════════════════════\n");

  const cas = [
    {
      label: "CAS 1 — Transfert simple 50 km, 21 passagers, départ dans 45j (mai)",
      params: {
        distanceKm: 50,
        allerRetour: false,
        nbPassagers: 21,
        dateDemande: new Date("2025-03-21"),
        dateDepart:  new Date("2025-05-05"),
      },
    },
    {
      label: "CAS 2 — Aller/retour 120 km, 60 passagers, départ dans 10j (juin)",
      params: {
        distanceKm: 120,
        allerRetour: true,
        nbPassagers: 60,
        dateDemande: new Date("2025-06-01"),
        dateDepart:  new Date("2025-06-11"),
      },
    },
    {
      label: "CAS 3 — Au-delà 180 km (200 km), 15 passagers, départ dans 100j (novembre)",
      params: {
        distanceKm: 200,
        allerRetour: false,
        nbPassagers: 15,
        dateDemande: new Date("2025-07-01"),
        dateDepart:  new Date("2025-10-09"),
      },
    },
    {
      label: "CAS 4 — Avec options (guide 2j + 1 nuit chauffeur), 80 km, 35 passagers, départ dans 20j (mars)",
      params: {
        distanceKm: 80,
        allerRetour: true,
        nbPassagers: 35,
        dateDemande: new Date("2025-03-01"),
        dateDepart:  new Date("2025-03-21"),
        options: { nbJoursGuide: 2, nbNuitsChauffeur: 1 },
      },
    },
    {
      label: "CAS LIMITE — 86 passagers → doit lever une erreur (flux manuel)",
      params: {
        distanceKm: 100,
        allerRetour: false,
        nbPassagers: 86,
        dateDemande: new Date("2025-04-01"),
        dateDepart:  new Date("2025-04-20"),
      },
      expectError: true,
    },
  ];

  let passed = 0;
  let failed = 0;

  cas.forEach(({ label, params, expectError }) => {
    console.log(`▶ ${label}`);
    try {
      const result = calculer_devis(params);
      if (expectError) {
        console.log("  ✗ ÉCHEC — une erreur était attendue mais aucune n'a été levée.\n");
        failed++;
      } else {
        console.log(`  Prix TTC : ${result.prixTTC} €  |  Prix HT : ${result.prixHT} €`);
        console.log(`  Coeffs   : saison=${result.detail.coefficients.saisonnalite.label}, délai=${result.detail.coefficients.delai.code}, capacité=${result.detail.coefficients.capacite.valeur}`);
        console.log(`  ✓ OK\n`);
        passed++;
      }
    } catch (err) {
      if (expectError) {
        console.log(`  ✓ Erreur attendue : ${err.message}\n`);
        passed++;
      } else {
        console.log(`  ✗ ERREUR inattendue : ${err.message}\n`);
        failed++;
      }
    }
  });

  console.log("═══════════════════════════════════════════");
  console.log(`  Résultats : ${passed} passés — ${failed} échoués`);
  console.log("═══════════════════════════════════════════");
}

// Lancer les tests si exécuté directement
if (require.main === module) _runTests();