# Interfaces Airtable - CRM NeoTravel

Ce document présente les interfaces Airtable créées pour le suivi commercial du projet NeoTravel.

Les interfaces Airtable permettent à l’équipe commerciale de consulter les demandes clients, suivre les devis, gérer les relances et visualiser les indicateurs clés du pipeline commercial. Elles servent également de support à la reprise humaine lorsqu’une demande nécessite l’intervention d’un conseiller.

## 1. Tableau de bord CRM

### Objectif

L’interface `Tableau de bord` permet d’avoir une vision globale de l’activité commerciale générée automatiquement par le workflow n8n.

Elle centralise les indicateurs principaux liés aux demandes clients, aux devis générés et aux relances à traiter.

### Éléments affichés

* nombre total de demandes ;
* demandes par statut ;
* devis générés ;
* montants des devis ;
* relances prévues ;
* demandes nécessitant une intervention humaine.

### Utilité métier

Cette interface permet au responsable commercial de suivre rapidement l’état du pipeline et d’identifier les dossiers prioritaires.

Capture associée :

```text
airtable/captures/dashboard.png
```

---

## 2. Interface de gestion des demandes

### Objectif

L’interface `Gestion des demandes` permet de consulter toutes les demandes clients créées automatiquement par n8n après qualification de l’agent IA.

### Données affichées

* nom du client ;
* email ;
* téléphone ;
* destination ;
* date de départ ;
* nombre de passagers ;
* statut de la demande ;
* source de la demande ;
* historique des interactions ;
* notes internes.

### Utilité métier

Cette interface permet à l’équipe commerciale de suivre les demandes entrantes et de reprendre manuellement un dossier si nécessaire.

Elle est particulièrement utile lorsque le champ `Statut` indique une escalade humaine ou lorsqu’une demande nécessite une vérification commerciale.

Capture associée :

```text
airtable/captures/demandes.png
```

---

## 3. Interface de gestion des devis

### Objectif

L’interface `Gestion des devis` permet de suivre les devis créés automatiquement par le workflow n8n.

### Données affichées

* montant TTC ;
* date de création ;
* lien du PDF généré ;
* statut du devis ;
* demande associée.

### Utilité métier

Cette interface permet de vérifier les devis générés, d’accéder au PDF envoyé au client et de suivre l’évolution commerciale du devis.

Le lien PDF est mis à jour automatiquement après génération du document via APITemplate.io.

Capture associée :

```text
airtable/captures/devis.png
```

---

## 4. Interface de gestion des relances

### Objectif

L’interface `Gestion des relances` permet de suivre les relances commerciales créées automatiquement après l’envoi d’un devis.

### Données affichées

* date de relance ;
* statut de la relance ;
* commentaire ;
* demande associée ;
* devis associé.

### Utilité métier

Cette interface aide l’équipe commerciale à identifier les clients à relancer et à organiser le suivi après l’envoi du devis.

Dans le prototype, une relance est créée automatiquement après la génération du devis.

Capture associée :

```text
airtable/captures/relances.png
```

---

## 5. Interface des paramètres de tarification

### Objectif

L’interface `Paramètres de tarification` permet de consulter les règles métier utilisées pour calculer les devis.

Elle regroupe les tables de paramétrage suivantes :

* `Tarifs_Transfert` ;
* `Coeff_Saisonnalite` ;
* `Coeff_Urgence` ;
* `Coeff_Capacite` ;
* `Parametres_Generaux`.

### Utilité métier

Cette interface permet de rendre les règles de calcul plus lisibles et compréhensibles pour l’équipe métier.

Elle documente les paramètres utilisés par le moteur de calcul déterministe dans n8n : tarifs par distance, coefficients de saisonnalité, urgence, capacité, marge et TVA.

Capture associée :

```text
airtable/captures/parametres-tarification.png
```

---

## 6. Rôle des interfaces dans l’architecture NeoTravel

Les interfaces Airtable ne déclenchent pas directement le calcul du devis. Elles servent principalement à :

* visualiser les données créées automatiquement par n8n ;
* suivre les demandes clients ;
* consulter les devis générés ;
* accéder aux PDF ;
* organiser les relances ;
* permettre une reprise humaine par un commercial ;
* suivre les indicateurs du pipeline commercial.

Le workflow n8n reste responsable de l’automatisation : qualification IA, calcul déterministe, création du devis, génération PDF, email et relance.

Airtable joue le rôle de CRM centralisé et d’interface de pilotage métier.

## 7. Sécurité et données

Les captures d’écran ajoutées dans le dépôt GitHub doivent éviter d’exposer des données personnelles réelles.

Avant publication, les éléments suivants doivent être anonymisés si nécessaire :

* adresses email ;
* numéros de téléphone ;
* noms de clients réels ;
* liens privés ;
* informations commerciales sensibles.
