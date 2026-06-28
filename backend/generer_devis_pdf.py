"""
GÉNÉRATEUR DE DEVIS PDF — NEOTRAVEL
─────────────────────────────────────────────────────────────────────────────
Prend en entrée le dict retourné par calculer_devis() et produit un PDF
professionnel prêt à être envoyé au prospect.

Usage :
    python generer_devis_pdf.py          → génère un devis de démonstration
    from generer_devis_pdf import generer_devis_pdf  → import dans ton agent
─────────────────────────────────────────────────────────────────────────────
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ─── PALETTE NEOTRAVEL ────────────────────────────────────────────────────────
VERT_NEO    = colors.HexColor("#2D6A4F")   # vert foncé — en-tête, accents
VERT_CLAIR  = colors.HexColor("#52B788")   # vert moyen — bandeau tarif
GRIS_FOND   = colors.HexColor("#F8F9FA")   # fond lignes alternées
GRIS_BORD   = colors.HexColor("#DEE2E6")   # bordures tableau
NOIR        = colors.HexColor("#212529")
BLANC       = colors.white

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm


# ─── STYLES TYPOGRAPHIQUES ────────────────────────────────────────────────────
def _styles():
    return {
        "titre_doc": ParagraphStyle(
            "titre_doc", fontName="Helvetica-Bold", fontSize=20,
            textColor=BLANC, alignment=TA_LEFT, spaceAfter=2
        ),
        "sous_titre_doc": ParagraphStyle(
            "sous_titre_doc", fontName="Helvetica", fontSize=10,
            textColor=colors.HexColor("#B7E4C7"), alignment=TA_LEFT
        ),
        "numero_devis": ParagraphStyle(
            "numero_devis", fontName="Helvetica-Bold", fontSize=11,
            textColor=BLANC, alignment=TA_RIGHT
        ),
        "label": ParagraphStyle(
            "label", fontName="Helvetica-Bold", fontSize=8,
            textColor=colors.HexColor("#6C757D"), spaceAfter=1
        ),
        "valeur": ParagraphStyle(
            "valeur", fontName="Helvetica", fontSize=10,
            textColor=NOIR, spaceAfter=4
        ),
        "section_title": ParagraphStyle(
            "section_title", fontName="Helvetica-Bold", fontSize=11,
            textColor=VERT_NEO, spaceBefore=10, spaceAfter=6,
            borderPad=2
        ),
        "cell_header": ParagraphStyle(
            "cell_header", fontName="Helvetica-Bold", fontSize=9,
            textColor=BLANC, alignment=TA_LEFT
        ),
        "cell_body": ParagraphStyle(
            "cell_body", fontName="Helvetica", fontSize=9,
            textColor=NOIR, alignment=TA_LEFT
        ),
        "cell_right": ParagraphStyle(
            "cell_right", fontName="Helvetica", fontSize=9,
            textColor=NOIR, alignment=TA_RIGHT
        ),
        "cell_bold_right": ParagraphStyle(
            "cell_bold_right", fontName="Helvetica-Bold", fontSize=9,
            textColor=NOIR, alignment=TA_RIGHT
        ),
        "prix_ttc_label": ParagraphStyle(
            "prix_ttc_label", fontName="Helvetica-Bold", fontSize=12,
            textColor=BLANC, alignment=TA_RIGHT
        ),
        "prix_ttc_valeur": ParagraphStyle(
            "prix_ttc_valeur", fontName="Helvetica-Bold", fontSize=22,
            textColor=BLANC, alignment=TA_RIGHT
        ),
        "mention": ParagraphStyle(
            "mention", fontName="Helvetica", fontSize=7.5,
            textColor=colors.HexColor("#6C757D"), spaceAfter=3
        ),
        "footer": ParagraphStyle(
            "footer", fontName="Helvetica", fontSize=7,
            textColor=colors.HexColor("#ADB5BD"), alignment=TA_CENTER
        ),
    }


# ─── HELPERS ──────────────────────────────────────────────────────────────────
def _fmt_eur(val):
    return f"{val:,.2f} €".replace(",", " ")

def _fmt_date(iso_str):
    try:
        return datetime.fromisoformat(iso_str).strftime("%d/%m/%Y")
    except Exception:
        return iso_str

def _num_devis(devis_id: str = None):
    """Génère un numéro de devis unique si aucun n'est fourni."""
    if devis_id:
        return devis_id
    return "D-" + datetime.now().strftime("%Y%m%d-%H%M")

def _label_formule(allerRetour: bool, km: float):
    if allerRetour:
        return "Transfert Aller / Retour"
    return "Transfert Aller Simple"

def _label_coeff(valeur: float):
    if valeur > 0:
        return f"+{int(valeur * 100)} %"
    elif valeur < 0:
        return f"{int(valeur * 100)} %"
    return "0 %"


# ─── BLOCS DE CONTENU ─────────────────────────────────────────────────────────

def _bloc_entete(styles, devis_id, date_emission):
    """Bande verte supérieure avec logo texte + numéro de devis."""
    col_w = (PAGE_W - 2 * MARGIN)
    left = [
        [
            Paragraph("NEOTRAVEL", styles["titre_doc"]),
            Paragraph("Transport de groupes · Devis automatisé", styles["sous_titre_doc"]),
        ]
    ]
    right = [
        [
            Paragraph(f"DEVIS N° {devis_id}", styles["numero_devis"]),
            Paragraph(f"Émis le {date_emission}", ParagraphStyle(
                "date", fontName="Helvetica", fontSize=9,
                textColor=colors.HexColor("#B7E4C7"), alignment=TA_RIGHT
            )),
        ]
    ]
    data = [[
        Table(left, colWidths=[col_w * 0.55]),
        Table(right, colWidths=[col_w * 0.45]),
    ]]
    t = Table(data, colWidths=[col_w * 0.55, col_w * 0.45])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), VERT_NEO),
        ("LEFTPADDING",  (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("TOPPADDING",   (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t


def _bloc_infos_client(styles, prospect: dict):
    """Bloc coordonnées prospect (optionnel)."""
    col_w = (PAGE_W - 2 * MARGIN)
    s = styles
    rows = [
        [Paragraph("À L'ATTENTION DE", s["label"]),  Paragraph("VALIDITÉ DU DEVIS", s["label"])],
        [Paragraph(prospect.get("nom", "—"),          s["valeur"]),
         Paragraph("30 jours à compter de la date d'émission", s["valeur"])],
        [Paragraph(prospect.get("email", ""),         s["valeur"]),
         Paragraph("", s["valeur"])],
        [Paragraph(prospect.get("tel", ""),           s["valeur"]),
         Paragraph("", s["valeur"])],
    ]
    t = Table(rows, colWidths=[col_w * 0.5, col_w * 0.5])
    t.setStyle(TableStyle([
        ("TOPPADDING",    (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
    ]))
    return t


def _bloc_voyage(styles, result: dict):
    """Tableau récapitulatif du voyage."""
    inp = result["input"]
    col_w = PAGE_W - 2 * MARGIN
    s = styles

    formule = _label_formule(inp["allerRetour"], inp["distanceKm"])
    date_dep = _fmt_date(inp["dateDepart"])
    saison_info = result["detail"]["coefficients"]["saisonnalite"]
    delai_info  = result["detail"]["coefficients"]["delai"]

    data = [
        # En-tête
        [Paragraph("DÉTAIL DU VOYAGE", s["cell_header"]),
         Paragraph("", s["cell_header"]),
         Paragraph("", s["cell_header"]),
         Paragraph("", s["cell_header"])],
        # Ligne 1
        [Paragraph("Formule", s["label"]),
         Paragraph("Distance", s["label"]),
         Paragraph("Passagers", s["label"]),
         Paragraph("Date de départ", s["label"])],
        [Paragraph(formule, s["cell_body"]),
         Paragraph(f"{inp['distanceKm']} km", s["cell_body"]),
         Paragraph(str(inp["nbPassagers"]), s["cell_body"]),
         Paragraph(date_dep, s["cell_body"])],
        # Ligne 2
        [Paragraph("Saisonnalité", s["label"]),
         Paragraph("Délai demande/départ", s["label"]),
         Paragraph("Coefficient capacité", s["label"]),
         Paragraph("", s["label"])],
        [Paragraph(f"{saison_info['label']} ({_label_coeff(saison_info['valeur'])})", s["cell_body"]),
         Paragraph(f"{delai_info['code']}  ({_label_coeff(delai_info['valeur'])})", s["cell_body"]),
         Paragraph(_label_coeff(result["detail"]["coefficients"]["capacite"]["valeur"]), s["cell_body"]),
         Paragraph("", s["cell_body"])],
    ]

    cw = col_w / 4
    t = Table(data, colWidths=[cw] * 4)
    t.setStyle(TableStyle([
        # En-tête verte
        ("BACKGROUND",    (0, 0), (-1, 0), VERT_NEO),
        ("TEXTCOLOR",     (0, 0), (-1, 0), BLANC),
        ("SPAN",          (0, 0), (-1, 0)),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 10),
        ("TOPPADDING",    (0, 0), (-1, 0), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4 * mm),
        ("LEFTPADDING",   (0, 0), (-1, 0), 4 * mm),
        # Corps
        ("BACKGROUND",    (0, 1), (-1, -1), GRIS_FOND),
        ("TOPPADDING",    (0, 1), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 3),
        ("LEFTPADDING",   (0, 1), (-1, -1), 4 * mm),
        ("RIGHTPADDING",  (0, 1), (-1, -1), 3 * mm),
        ("BOX",           (0, 0), (-1, -1), 0.5, GRIS_BORD),
        ("INNERGRID",     (0, 1), (-1, -1), 0.3, GRIS_BORD),
    ]))
    return t


def _bloc_tarification(styles, result: dict):
    """Tableau de décomposition du prix."""
    d   = result["detail"]
    s   = styles
    col_w = PAGE_W - 2 * MARGIN
    cw = [col_w * 0.65, col_w * 0.35]

    lignes = [
        # En-tête
        [Paragraph("DÉCOMPOSITION TARIFAIRE", s["cell_header"]),
         Paragraph("MONTANT HT", s["cell_header"])],
        # Base
        [Paragraph("Prix de base (trajet aller)", s["cell_body"]),
         Paragraph(_fmt_eur(d["prixBaseAller"]), s["cell_right"])],
    ]

    if result["input"]["allerRetour"]:
        lignes.append([
            Paragraph("  × 2 (formule aller/retour)", s["cell_body"]),
            Paragraph(_fmt_eur(d["prixBase"]), s["cell_right"]),
        ])

    lignes.append([
        Paragraph(f"Après ajustements (saisonnalité, délai, capacité)", s["cell_body"]),
        Paragraph(_fmt_eur(d["prixApresCoeffs"]), s["cell_right"]),
    ])

    # Options
    opts = d["options"]
    if opts["supplementGuide"] > 0:
        lignes.append([
            Paragraph(f"  + Guide / accompagnateur", s["cell_body"]),
            Paragraph(_fmt_eur(opts["supplementGuide"]), s["cell_right"]),
        ])
    if opts["supplementChauffeur"] > 0:
        lignes.append([
            Paragraph(f"  + Nuit(s) chauffeur", s["cell_body"]),
            Paragraph(_fmt_eur(opts["supplementChauffeur"]), s["cell_right"]),
        ])
    if opts["supplementPeages"] > 0:
        lignes.append([
            Paragraph(f"  + Forfait péages", s["cell_body"]),
            Paragraph(_fmt_eur(opts["supplementPeages"]), s["cell_right"]),
        ])

    lignes.append([
        Paragraph("Marge commerciale (+15 %)", s["cell_body"]),
        Paragraph(_fmt_eur(d["marge"]["montant"]), s["cell_right"]),
    ])

    # Sous-total HT
    lignes.append([
        Paragraph("TOTAL HT", ParagraphStyle(
            "ht", fontName="Helvetica-Bold", fontSize=9,
            textColor=VERT_NEO, alignment=TA_LEFT
        )),
        Paragraph(_fmt_eur(result["prixHT"]), ParagraphStyle(
            "ht_r", fontName="Helvetica-Bold", fontSize=9,
            textColor=VERT_NEO, alignment=TA_RIGHT
        )),
    ])
    lignes.append([
        Paragraph("TVA 10 % (transport de personnes)", s["cell_body"]),
        Paragraph(_fmt_eur(d["tva"]["montant"]), s["cell_right"]),
    ])

    n_rows = len(lignes)
    t = Table(lignes, colWidths=cw)

    # Style de base
    ts = [
        # En-tête
        ("BACKGROUND",    (0, 0), (-1, 0), VERT_NEO),
        ("TEXTCOLOR",     (0, 0), (-1, 0), BLANC),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 10),
        ("TOPPADDING",    (0, 0), (-1, 0), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4 * mm),
        ("LEFTPADDING",   (0, 0), (-1, 0), 4 * mm),
        ("RIGHTPADDING",  (0, 0), (-1, 0), 4 * mm),
        # Corps
        ("TOPPADDING",    (0, 1), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
        ("LEFTPADDING",   (0, 1), (-1, -1), 4 * mm),
        ("RIGHTPADDING",  (0, 1), (-1, -1), 4 * mm),
        ("BOX",           (0, 0), (-1, -1), 0.5, GRIS_BORD),
        ("LINEBELOW",     (0, 0), (-1, -2), 0.3, GRIS_BORD),
    ]
    # Fond alterné
    for i in range(1, n_rows):
        bg = GRIS_FOND if i % 2 == 0 else BLANC
        ts.append(("BACKGROUND", (0, i), (-1, i), bg))

    # Ligne sous-total HT en vert clair
    ht_row = n_rows - 2
    ts += [
        ("BACKGROUND",    (0, ht_row), (-1, ht_row), colors.HexColor("#D8F3DC")),
        ("LINEABOVE",     (0, ht_row), (-1, ht_row), 1, VERT_NEO),
        ("LINEBELOW",     (0, ht_row), (-1, ht_row), 1, VERT_NEO),
    ]

    t.setStyle(TableStyle(ts))
    return t


def _bloc_prix_ttc(styles, result: dict):
    """Bandeau final prix TTC."""
    col_w = PAGE_W - 2 * MARGIN
    s = styles
    data = [[
        Paragraph("TARIF TOTAL TTC", s["prix_ttc_label"]),
        Paragraph(_fmt_eur(result["prixTTC"]), s["prix_ttc_valeur"]),
    ]]
    t = Table(data, colWidths=[col_w * 0.5, col_w * 0.5])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), VERT_CLAIR),
        ("LEFTPADDING",   (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 6 * mm),
        ("TOPPADDING",    (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t


def _bloc_mentions(styles):
    s = styles
    return [
        Paragraph("Ce devis est valable 30 jours à compter de sa date d'émission.", s["mention"]),
        Paragraph(
            "Les prestations de transport de personnes sont soumises à la TVA au taux de 10 %. "
            "Le prix comprend : l'assurance responsabilité civile professionnelle du prestataire. "
            "Restent à la charge du client : péages autoroutiers et parkings éventuels (sauf option souscrite).",
            s["mention"]
        ),
        Paragraph(
            "Devis généré automatiquement par le moteur de tarification Neotravel — "
            "calcul déterministe, documenté et auditable.",
            s["mention"]
        ),
    ]


def _footer_text(styles, devis_id, date_emission):
    return Paragraph(
        f"Neotravel · Transport de groupes · devis@neotravel.fr · www.neotravel.fr  "
        f"| {devis_id} · {date_emission}",
        styles["footer"]
    )


# ─── FONCTION PRINCIPALE ──────────────────────────────────────────────────────

def generer_devis_pdf(
    result: dict,
    output_path: str,
    prospect: dict = None,
    devis_id: str = None,
):
    """
    Génère un PDF de devis à partir du résultat de calculer_devis().

    Paramètres
    ----------
    result      : dict retourné par calculer_devis()
    output_path : chemin de sortie du fichier PDF (ex: "devis_D-20250601.pdf")
    prospect    : dict optionnel avec clés 'nom', 'email', 'tel'
    devis_id    : identifiant personnalisé du devis (généré automatiquement sinon)

    Retourne
    --------
    str : chemin absolu du PDF généré
    """
    if prospect is None:
        prospect = {}

    devis_id      = _num_devis(devis_id)
    date_emission = datetime.now().strftime("%d/%m/%Y")
    styles        = _styles()

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN,  bottomMargin=MARGIN + 10 * mm,
        title=f"Devis Neotravel {devis_id}",
        author="Neotravel",
    )

    story = []

    # 1. En-tête
    story.append(_bloc_entete(styles, devis_id, date_emission))
    story.append(Spacer(1, 6 * mm))

    # 2. Infos client
    if any(prospect.values()):
        story.append(_bloc_infos_client(styles, prospect))
        story.append(Spacer(1, 5 * mm))

    # 3. Détail voyage
    story.append(KeepTogether([
        Paragraph("VOTRE TRAJET", styles["section_title"]),
        _bloc_voyage(styles, result),
    ]))
    story.append(Spacer(1, 5 * mm))

    # 4. Décomposition tarifaire
    story.append(KeepTogether([
        Paragraph("DÉCOMPOSITION DU PRIX", styles["section_title"]),
        _bloc_tarification(styles, result),
    ]))
    story.append(Spacer(1, 4 * mm))

    # 5. Prix TTC
    story.append(_bloc_prix_ttc(styles, result))
    story.append(Spacer(1, 5 * mm))

    # 6. Mentions légales
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRIS_BORD))
    story.append(Spacer(1, 3 * mm))
    story.extend(_bloc_mentions(styles))
    story.append(Spacer(1, 4 * mm))

    # 7. Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRIS_BORD))
    story.append(Spacer(1, 2 * mm))
    story.append(_footer_text(styles, devis_id, date_emission))

    doc.build(story)
    return os.path.abspath(output_path)


# ─── DÉMONSTRATION ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Simule un résultat de calculer_devis() — en production : appelle la vraie fonction
    result_demo = {
        "input": {
            "distanceKm": 120,
            "allerRetour": True,
            "nbPassagers": 45,
            "dateDemande": "2025-05-20T00:00:00",
            "dateDepart":  "2025-06-14T00:00:00",
            "joursAvantDepart": 25,
            "moisDepart": 6,
            "options": {"nbJoursGuide": 1, "nbNuitsChauffeur": 0},
        },
        "detail": {
            "prixBaseAller": 660,
            "multiplicateurAllerRetour": 2,
            "prixBase": 1320,
            "coefficients": {
                "saisonnalite": {"mois": 6, "valeur": 0.15, "label": "Très haute"},
                "delai":        {"joursAvantDepart": 25, "code": "DD_URGENT", "valeur": 0.05},
                "capacite":     {"nbPassagers": 45, "valeur": 0.0},
                "totalCoeffs":  0.20,
            },
            "prixApresCoeffs": 1584.0,
            "options": {
                "supplementGuide": 80,
                "supplementChauffeur": 0,
                "supplementPeages": 0,
                "totalOptions": 80,
            },
            "sousTotal": 1664.0,
            "marge": {"taux": 0.15, "montant": 249.6},
            "prixHT": 1913.6,
            "tva":    {"taux": 0.10, "montant": 191.36},
        },
        "prixTTC": 2104.96,
        "prixHT":  1913.6,
        "meta": {"version": "1.0.0", "calculeLe": "2025-05-20T10:00:00", "auditOk": True},
    }

    prospect_demo = {
        "nom":   "Association Sportive Clémentine",
        "email": "contact@as-clementine.fr",
        "tel":   "06 12 34 56 78",
    }

    path = generer_devis_pdf(
        result=result_demo,
        output_path="/mnt/user-data/outputs/devis_neotravel_demo.pdf",
        prospect=prospect_demo,
        devis_id="D-20250520-001",
    )
    print(f"✅ PDF généré : {path}")