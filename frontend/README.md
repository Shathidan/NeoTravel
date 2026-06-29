# NeoTravel - Frontend

Ce dépôt contient le code source de l'interface utilisateur de NeoTravel, développée avec Next.js (App Router) et Tailwind CSS.

## Architecture et flux de données

L'application repose sur une architecture simplifiée pour la gestion des données :
- Frontend : Interface client et site vitrine, hébergés sur Vercel.
- Automatisation : Les interactions de l'utilisateur déclenchent des processus via des webhooks n8n.
- Base de données : Les informations sont centralisées et gérées sur Airtable, qui sert également de tableau de bord pour la direction.

## Fonctionnalités principales

### Espace Client
- /client/dashboard : Suivi de l'état d'avancement du dossier en temps réel.
- /client/itineraire : Détails du séjour (vols, hébergements, activités).
- /client/documents : Accès et téléchargement des pièces justificatives et billets.

### Site Vitrine
- Pages de présentation : Accueil, présentation de la flotte et offres dédiées aux entreprises.
- Composants interactifs : Console d'assistance virtuelle et carrousel de photographies.

## Installation et développement local

### Prérequis
Node.js doit être installé sur votre machine.

### Procédure

1. Installer les dépendances du projet :
   ```bash
   npm install
