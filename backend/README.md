# Backend

Ce dossier contient l'API, la logique métier et le calcul des devis.

Architecture du moteur en 2 fichiers
calculer_devis.js          ← moteur de règles (JS, dans ton agent)
generer_devis_pdf.py       ← générateur PDF (Python, côté serveur)

Le PDF est structuré en 5 blocs :

1 - En-tête — bande verte NEOTRAVEL avec numéro de devis auto-généré (D-YYYYMMDD-HH:MM)

2 - Infos client — nom, email, téléphone du prospect (optionnel, vide si non fourni)

3 - Détail du trajet — formule (simple/aller-retour), distance, nb passagers, date de départ, + les 3 coefficients appliqués avec leur libellé lisible (ex. Très haute (+15%), DD_URGENT (+5%))

4 - Décomposition tarifaire — toutes les lignes : prix base → ajustements → options (guide, nuit chauffeur, péages) → marge 15% → TVA 10%

5 - Bandeau TTC vert — le prix final en gros, visible immédiatement