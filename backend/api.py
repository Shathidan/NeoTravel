"""
API NEOTRAVEL — Moteur de tarification & génération de devis
─────────────────────────────────────────────────────────────────────────────
Stack : FastAPI + Uvicorn
Lancement : uvicorn api:app --reload --port 8000

Endpoints disponibles :
  POST /devis/calculer        → calcule le prix selon les règles métier
  POST /devis/generer-pdf     → calcule + génère le PDF, le retourne en download
  GET  /devis/{devis_id}/pdf  → retélécharge un PDF déjà généré
  GET  /health                → statut de l'API
  GET  /docs                  → Swagger UI (automatique avec FastAPI)
─────────────────────────────────────────────────────────────────────────────
"""

import os
import uuid
import tempfile
from datetime import date, datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field, field_validator

# ── Import du générateur PDF (même dossier) ───────────────────────────────────
from generer_devis_pdf import generer_devis_pdf

# ─────────────────────────────────────────────────────────────────────────────
# MOTEUR DE TARIFICATION (réimplémenté en Python depuis calculer_devis.js)
# Même logique, même tables — le calcul reste déterministe et auditable.
# ─────────────────────────────────────────────────────────────────────────────

GRILLE_FORFAIT = [
    (10, 250), (20, 250), (30, 250), (40, 320), (50, 350),
    (60, 390), (70, 430), (80, 500), (90, 540), (100, 580),
    (110, 620), (120, 660), (130, 700), (140, 740), (150, 780),
    (160, 820), (170, 860), (180, 900),
]

COEFF_SAISONNALITE = {
    1: -0.07, 2: -0.07, 3: 0.10, 4: 0.10,
    5: 0.15,  6: 0.15,  7: 0.10, 8: -0.07,
    9: 0.00, 10: 0.00, 11: -0.07, 12: 0.00,
}

LABEL_SAISON = {
    1: "Basse", 2: "Basse", 3: "Haute", 4: "Haute",
    5: "Très haute", 6: "Très haute", 7: "Haute", 8: "Basse",
    9: "Moyenne", 10: "Moyenne", 11: "Basse", 12: "Moyenne",
}

PONDERATION_DELAI = [
    ("DD_PRIORITAIRE", 14,       0.10),
    ("DD_URGENT",      30,       0.05),
    ("DD_NORMAL",      90,      -0.05),
    ("DD_3MOISETPLUS", 99999,   -0.10),
]

PONDERATION_CAPACITE = [
    (19,  -0.05),
    (53,   0.00),
    (63,   0.15),
    (67,   0.20),
    (85,   0.40),
]

MARGE = 0.15
TVA   = 0.10


def _arrondir(n: float) -> float:
    return round(n * 100) / 100


def _prix_base_aller(km: float) -> float:
    for max_km, prix in GRILLE_FORFAIT:
        if km <= max_km:
            return prix
    return (km * 2) * 2.5  # Au-delà de 180 km


def _coeff_capacite(nb: int) -> float:
    for max_p, coeff in PONDERATION_CAPACITE:
        if nb <= max_p:
            return coeff
    raise ValueError(
        f"FLUX_MANUEL : {nb} passagers > 85. Ce dossier doit être traité manuellement par un commercial."
    )


def _coeff_delai(jours: int):
    for code, max_j, coeff in PONDERATION_DELAI:
        if jours <= max_j:
            return code, coeff
    return "DD_3MOISETPLUS", -0.10


def calculer_devis_python(
    distance_km: float,
    aller_retour: bool,
    nb_passagers: int,
    date_demande: date,
    date_depart: date,
    nb_jours_guide: int = 0,
    nb_nuits_chauffeur: int = 0,
    peages_inclus: bool = False,
    forfait_peages: float = 0.0,
) -> dict:
    """Moteur de calcul Python — même logique que calculer_devis.js."""

    if date_depart < date_demande:
        raise ValueError("date_depart ne peut pas être antérieure à date_demande.")

    jours = (date_depart - date_demande).days
    mois  = date_depart.month

    prix_base_aller = _prix_base_aller(distance_km)
    prix_base       = prix_base_aller * (2 if aller_retour else 1)

    coeff_saison            = COEFF_SAISONNALITE[mois]
    code_delai, coeff_delai = _coeff_delai(jours)
    coeff_capacite          = _coeff_capacite(nb_passagers)

    total_coeffs     = coeff_saison + coeff_delai + coeff_capacite
    prix_apres_coeffs = prix_base * (1 + total_coeffs)

    suppl_guide     = nb_jours_guide     * 80
    suppl_chauffeur = nb_nuits_chauffeur * 120
    suppl_peages    = forfait_peages if peages_inclus else 0
    total_options   = suppl_guide + suppl_chauffeur + suppl_peages

    sous_total    = prix_apres_coeffs + total_options
    montant_marge = sous_total * MARGE
    prix_ht       = sous_total + montant_marge
    montant_tva   = prix_ht * TVA
    prix_ttc      = prix_ht + montant_tva

    return {
        "input": {
            "distanceKm":        distance_km,
            "allerRetour":       aller_retour,
            "nbPassagers":       nb_passagers,
            "dateDemande":       date_demande.isoformat(),
            "dateDepart":        date_depart.isoformat(),
            "joursAvantDepart":  jours,
            "moisDepart":        mois,
            "options": {
                "nbJoursGuide":       nb_jours_guide,
                "nbNuitsChauffeur":   nb_nuits_chauffeur,
                "peagesInclus":       peages_inclus,
                "forfaitPeages":      forfait_peages,
            },
        },
        "detail": {
            "prixBaseAller":            _arrondir(prix_base_aller),
            "multiplicateurAllerRetour": 2 if aller_retour else 1,
            "prixBase":                 _arrondir(prix_base),
            "coefficients": {
                "saisonnalite": {
                    "mois":   mois,
                    "valeur": coeff_saison,
                    "label":  LABEL_SAISON[mois],
                },
                "delai": {
                    "joursAvantDepart": jours,
                    "code":             code_delai,
                    "valeur":           coeff_delai,
                },
                "capacite": {
                    "nbPassagers": nb_passagers,
                    "valeur":      coeff_capacite,
                },
                "totalCoeffs": total_coeffs,
            },
            "prixApresCoeffs": _arrondir(prix_apres_coeffs),
            "options": {
                "supplementGuide":     suppl_guide,
                "supplementChauffeur": suppl_chauffeur,
                "supplementPeages":    suppl_peages,
                "totalOptions":        total_options,
            },
            "sousTotal":    _arrondir(sous_total),
            "marge":        {"taux": MARGE, "montant": _arrondir(montant_marge)},
            "prixHT":       _arrondir(prix_ht),
            "tva":          {"taux": TVA, "montant": _arrondir(montant_tva)},
        },
        "prixTTC": _arrondir(prix_ttc),
        "prixHT":  _arrondir(prix_ht),
        "meta": {
            "version":    "1.0.0",
            "calculeLe":  datetime.now().isoformat(),
            "auditOk":    True,
        },
    }


# ─────────────────────────────────────────────────────────────────────────────
# SCHÉMAS PYDANTIC (validation automatique des entrées)
# ─────────────────────────────────────────────────────────────────────────────

class OptionsDevis(BaseModel):
    nb_jours_guide:     int   = Field(0,     ge=0, description="Nombre de jours avec guide/accompagnateur (80 €/j)")
    nb_nuits_chauffeur: int   = Field(0,     ge=0, description="Nombre de nuits chauffeur (120 €/nuit)")
    peages_inclus:      bool  = Field(False,       description="Inclure un forfait péages")
    forfait_peages:     float = Field(0.0,   ge=0, description="Montant du forfait péages si inclus")


class DemandeDevis(BaseModel):
    distance_km:  float = Field(..., gt=0,  description="Distance en km (trajet aller)")
    aller_retour: bool  = Field(...,        description="true = aller/retour, false = aller simple")
    nb_passagers: int   = Field(..., gt=0,  description="Nombre de passagers (max 85 — au-delà : flux manuel)")
    date_demande: date  = Field(...,        description="Date de réception de la demande (YYYY-MM-DD)")
    date_depart:  date  = Field(...,        description="Date du départ (YYYY-MM-DD)")
    options:      OptionsDevis = Field(default_factory=OptionsDevis)

    @field_validator("date_depart")
    @classmethod
    def depart_apres_demande(cls, v, info):
        if "date_demande" in info.data and v < info.data["date_demande"]:
            raise ValueError("date_depart doit être postérieure ou égale à date_demande.")
        return v


class Prospect(BaseModel):
    nom:   str = Field("", description="Nom ou raison sociale du prospect")
    email: str = Field("", description="Email du prospect")
    tel:   str = Field("", description="Téléphone du prospect")


class DemandeDevisPDF(BaseModel):
    devis:    DemandeDevis
    prospect: Prospect = Field(default_factory=Prospect)
    devis_id: Optional[str] = Field(None, description="Identifiant personnalisé (généré auto si absent)")


# ─────────────────────────────────────────────────────────────────────────────
# APP FASTAPI
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="API Neotravel — Moteur de devis",
    description=(
        "Moteur de tarification déterministe et génération de devis PDF automatisés. "
        "Le calcul du prix ne fait jamais appel à un LLM — il est auditable et traçable."
    ),
    version="1.0.0",
    contact={"name": "Neotravel", "email": "devis@neotravel.fr"},
)

# Dossier temporaire pour stocker les PDFs générés
PDF_DIR = tempfile.mkdtemp(prefix="neotravel_devis_")


# ─── GET /health ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["Système"])
def health():
    """Vérifie que l'API est opérationnelle."""
    return {"status": "ok", "version": "1.0.0", "timestamp": datetime.now().isoformat()}


# ─── POST /devis/calculer ─────────────────────────────────────────────────────

@app.post("/devis/calculer", tags=["Devis"])
def calculer(body: DemandeDevis):
    """
    Calcule le prix d'un devis selon les règles métier Neotravel.

    Retourne le détail complet du calcul (audit trail) + prix HT et TTC.
    **Le calcul est 100 % déterministe — aucun LLM impliqué.**
    """
    try:
        result = calculer_devis_python(
            distance_km        = body.distance_km,
            aller_retour       = body.aller_retour,
            nb_passagers       = body.nb_passagers,
            date_demande       = body.date_demande,
            date_depart        = body.date_depart,
            nb_jours_guide     = body.options.nb_jours_guide,
            nb_nuits_chauffeur = body.options.nb_nuits_chauffeur,
            peages_inclus      = body.options.peages_inclus,
            forfait_peages     = body.options.forfait_peages,
        )
        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


# ─── POST /devis/generer-pdf ──────────────────────────────────────────────────

@app.post("/devis/generer-pdf", tags=["Devis"])
def generer_pdf(body: DemandeDevisPDF):
    """
    Calcule le devis ET génère le PDF correspondant.

    Retourne le fichier PDF en téléchargement direct.
    Utilisable pour l'envoi automatique par email (Resend / Brevo).
    """
    try:
        # 1. Calcul du prix
        result = calculer_devis_python(
            distance_km        = body.devis.distance_km,
            aller_retour       = body.devis.aller_retour,
            nb_passagers       = body.devis.nb_passagers,
            date_demande       = body.devis.date_demande,
            date_depart        = body.devis.date_depart,
            nb_jours_guide     = body.devis.options.nb_jours_guide,
            nb_nuits_chauffeur = body.devis.options.nb_nuits_chauffeur,
            peages_inclus      = body.devis.options.peages_inclus,
            forfait_peages     = body.devis.options.forfait_peages,
        )

        # 2. Génération du PDF
        devis_id  = body.devis_id or ("D-" + datetime.now().strftime("%Y%m%d-%H%M%S"))
        pdf_path  = os.path.join(PDF_DIR, f"{devis_id}.pdf")

        generer_devis_pdf(
            result      = result,
            output_path = pdf_path,
            prospect    = body.prospect.model_dump(),
            devis_id    = devis_id,
        )

        # 3. Retourne le fichier
        return FileResponse(
            path         = pdf_path,
            media_type   = "application/pdf",
            filename     = f"devis_neotravel_{devis_id}.pdf",
            headers      = {"X-Devis-Id": devis_id, "X-Prix-TTC": str(result["prixTTC"])},
        )

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur génération PDF : {str(e)}")


# ─── GET /devis/{devis_id}/pdf ────────────────────────────────────────────────

@app.get("/devis/{devis_id}/pdf", tags=["Devis"])
def telecharger_pdf(devis_id: str):
    """
    Retélécharge un PDF déjà généré par son identifiant.
    Utile pour les relances ou le stockage CRM.
    """
    pdf_path = os.path.join(PDF_DIR, f"{devis_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(
            status_code=404,
            detail=f"Aucun PDF trouvé pour le devis '{devis_id}'. Régénérez-le via POST /devis/generer-pdf."
        )
    return FileResponse(
        path       = pdf_path,
        media_type = "application/pdf",
        filename   = f"devis_neotravel_{devis_id}.pdf",
    )


# ─────────────────────────────────────────────────────────────────────────────
# LANCEMENT LOCAL
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)