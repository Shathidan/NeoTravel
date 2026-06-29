# Schéma Airtable - CRM NeoTravel

## Table `Demandes`

| Champ | Type | Description |
|---|---|---|
| Nom | Texte | Nom du client |
| Email | Email | Adresse email du client |
| Téléphone | Téléphone | Numéro du client |
| Destination | Texte | Destination demandée |
| Date de départ | Date | Date prévue du trajet |
| Nombre de passagers | Nombre | Nombre de voyageurs |
| Statut | Single select | Statut commercial de la demande |
| Source de demande | Single select | Origine de la demande, par exemple Chatbot IA |
| Historique des interactions | Long text | Résumé ou historique de la demande |
| Notes internes | Long text | Informations utiles pour le suivi commercial |
| Devis | Linked record | Lien vers la table Devis |
| Relances | Linked record | Lien vers la table Relances |

## Table `Devis`

| Champ | Type | Description |
|---|---|---|
| Montant TTC | Currency / Number | Montant final estimatif du devis |
| Date de création | Date | Date de génération du devis |
| Lien PDF | URL | Lien vers le PDF généré |
| Statut | Single select | Statut du devis |
| Demande | Linked record | Lien vers la demande associée |

## Table `Relances`

| Champ | Type | Description |
|---|---|---|
| Date relance | Date | Date prévue de relance |
| Statut | Single select | État de la relance |
| Commentaire | Long text | Commentaire commercial |
| Demande | Linked record | Demande liée |
| Devis | Linked record | Devis lié |

## Tables de tarification

Les règles de calcul sont structurées dans les tables suivantes :

- `Tarifs_Transfert`
- `Coeff_Saisonnalite`
- `Coeff_Urgence`
- `Coeff_Capacite`
- `Parametres_Generaux`

Ces tables permettent de documenter les règles métier utilisées pour le calcul déterministe du devis.