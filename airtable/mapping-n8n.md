# Mapping n8n vers Airtable

## Création d’une demande

Le nœud n8n `Creer_Demande` insère une nouvelle ligne dans la table `Demandes`.

| Donnée n8n | Champ Airtable |
|---|---|
| `nom` | Nom |
| `email` | Email |
| `telephone` | Téléphone |
| `destination` | Destination |
| `dateDepartAirtable` | Date de départ |
| `nombrePassagersAirtable` | Nombre de passagers |
| `resume` | Historique des interactions |
| `categorie`, `distanceKm`, `typeTrajet` | Notes internes |

## Création d’un devis

Le nœud `Creer_Devis` crée une ligne dans la table `Devis`.

| Donnée n8n | Champ Airtable |
|---|---|
| `montantTTC` | Montant TTC |
| Date du jour | Date de création |

## Mise à jour du lien PDF

Le nœud `Mettre_A_Jour_Devis_PDF` met à jour le champ `Lien PDF` dans la table `Devis`.

| Donnée n8n | Champ Airtable |
|---|---|
| `pdfUrl` | Lien PDF |

## Création d’une relance

Le nœud `Creer_Relance` crée une relance automatique après génération du devis.

| Donnée n8n | Champ Airtable |
|---|---|
| Date J+2 | Date relance |
| Statut | Statut |
| Commentaire automatique | Commentaire |