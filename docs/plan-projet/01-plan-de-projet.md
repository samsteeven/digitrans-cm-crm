# PLAN DE PROJET — Module CRM SavoirManger

## 1. Présentation du module CRM

Le module CRM (Customer Relationship Management) du projet DIGITRANS-CM vise à moderniser la gestion de la relation client des restaurants **SavoirManger** (enseigne du groupe AGROCAM S.A. présente à Douala, Yaoundé, Bafoussam, Garoua et Ngaoundéré).

### Fonctionnalités clés

| # | Fonctionnalité | Description |
|---|---------------|-------------|
| F01 | Gestion des clients | Profil client, historique des commandes, segmentation (fréquence, panier moyen) |
| F02 | Gestion des commandes | Prise de commande, suivi en temps réel, facturation |
| F03 | Programme de fidélité | Points de fidélité, paliers, récompenses, notifications |
| F04 | Avis et satisfaction | Collecte des avis, notation, analyse de sentiment |
| F05 | Tableau de bord | KPI en temps réel : CA par restaurant, clients actifs, taux de fidélisation |

### Contraintes spécifiques au contexte camerounais

- **Coupures électriques fréquentes** (6–12h/jour à Douala en période de délestage)
- **Connectivité inégale** : débits variables selon les zones (offline-first requis pour les zones rurales)
- **Latence réseau** : 150–250 ms entre Douala et les régions cloud Europe/USA
- **Hébergement des données sensibles** : données clients hébergées sur le sol camerounais (conformité loi n°2010/012)
- **Budget contraint** : 96 000 000 FCFA pour le module CRM

---

## 2. Choix méthodologique : Approche hybride Agile / Forfait

### Justification

Le projet DIGITRANS-CM est un projet au forfait (budget et délais fixés contractuellement avec AGROCAM S.A.), mais il présente des incertitudes techniques fortes (adaptation au système legacy de 2009, contraintes réseau locales). Une approche purement prédictive (cycle en V) serait trop rigide face aux aléas du contexte camerounais. Une approche Agile pure serait incompatible avec l'engagement forfaitaire.

**Méthodologie retenue : Hybride (Agile cadré par des jalons contractuels)**

| Aspect | Choix |
|--------|-------|
| Cycles | Sprints de 2 semaines (itératif) |
| Cérémonies | Daily stand-up (10 min), Sprint planning (2h), Sprint review (1h), Rétrospective (1h) |
| Périmètre | Fixé par module (forfait), mais priorisation flexible des user stories |
| Jalons contractuels | 5 jalons fermes sur 18 mois (voir section 6) |
| Outil de suivi | Jira (tableau Kanban) |
| Gestion des risques | Risk backlog mis à jour chaque sprint |

---

## 3. Work Breakdown Structure (WBS) du module CRM

### LOT A — Gestion de projet et coordination (22 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| A.1 | Cadrage et spécifications fonctionnelles | 5 | Samen |
| A.2 | Planification et organisation des sprints | 4 | Samen |
| A.3 | Suivi de projet (indicateurs, reporting client) | 6 | Samen |
| A.4 | Revues d'avancement et RETEX | 4 | Samen |
| A.5 | Coordination d'équipe et gestion des risques | 3 | Samen |

### LOT B — Analyse et conception (20 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| B.1 | Analyse des processus métier SavoirManger | 5 | Audrey |
| B.2 | Conception de l'architecture technique | 4 | Carmel |
| B.3 | Modélisation de la base de données (MCD/MLD) | 4 | Audrey |
| B.4 | Design des maquettes UI/UX (Wireframes) | 4 | Carmel |
| B.5 | Spécification des APIs REST | 3 | Audrey |

### LOT C — Développement Backend (40 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| C.1 | Mise en place de l'infrastructure Laravel + BDD | 4 | Carmel |
| C.2 | API Gestion des clients (CRUD + recherche) | 8 | Audrey |
| C.3 | API Gestion des commandes et réservations | 8 | Carmel |
| C.4 | API Programme de fidélité | 6 | Audrey |
| C.5 | API Avis et satisfaction | 4 | Carmel |
| C.6 | API Tableau de bord / Statistiques | 6 | Samen |
| C.7 | Authentification et sécurisation des endpoints | 4 | Carmel |

### LOT D — Développement Frontend (30 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| D.1 | Setup React + Vite + TailwindCSS | 3 | Audrey |
| D.2 | Interface gestion des clients | 6 | Carmel |
| D.3 | Interface commandes / réservations | 6 | Audrey |
| D.4 | Interface programme de fidélité | 5 | Carmel |
| D.5 | Interface avis clients | 4 | Audrey |
| D.6 | Tableau de bord KPI (graphiques) | 6 | Samen |

### LOT E — Intégration, Tests et Déploiement (22 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| E.1 | Tests unitaires et d'intégration (PHPUnit) | 6 | Audrey |
| E.2 | Tests frontend (Vitest + React Testing Library) | 4 | Carmel |
| E.3 | Mise en place pipeline CI/CD (GitHub Actions) | 4 | Samen |
| E.4 | Déploiement staging AWS Afrique du Sud | 3 | Carmel |
| E.5 | Tests UAT (User Acceptance Testing) | 3 | Samen |
| E.6 | Déploiement production | 2 | Carmel |

### LOT F — Documentation et Formation (18 JH)

| Code | Tâche | JH | Responsable |
|------|-------|----|-------------|
| F.1 | Documentation technique des APIs (Swagger/OpenAPI) | 5 | Audrey |
| F.2 | Guide utilisateur (restaurants SavoirManger) | 4 | Carmel |
| F.3 | Formation des équipes AGROCAM (présentiel) | 4 | Samen |
| F.4 | Rapport collectif et soutenance | 5 | Équipe |

### Récapitulatif des charges

| Lot | Intitulé | JH prévisionnels | Répartition |
|-----|----------|-----------------|-------------|
| A | Gestion de projet | 22 | 18% |
| B | Analyse et conception | 20 | 17% |
| C | Développement Backend | 40 | 33% |
| D | Développement Frontend | 30 | 25% |
| E | Intégration, Tests, Déploiement | 22 | 18% |
| F | Documentation et Formation | 18 | 15% |
| **TOTAL** | | **152** | **100%** |

---

## 4. Planning prévisionnel (Diagramme de Gantt textuel)

Période : **Juin 2026 — Novembre 2026** (6 mois pour le module CRM dans l'enveloppe des 18 mois)

### Mois 1-2 (Sprints 1-4) : Fondations

```
Tâche                  S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12
A.1 Cadrage            ██  ██
A.2 Planification      ██
B.1 Analyse métier     ██  ██
B.2 Architecture       ██  ██
B.3 Modélisation BDD       ██  ██
B.4 Maquettes UI/UX         ██  ██  ██
B.5 Spécification API           ██  ██
```

### Mois 3-4 (Sprints 5-8) : Développement

```
Tâche                  S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12
C.1 Setup Laravel                      ██
C.2 API Clients                        ██  ██
C.3 API Commandes                          ██  ██
C.4 API Fidélité                           ██  ██
C.5 API Avis                                   ██
C.6 API Dashboard                               ██  ██
D.1 Setup React                          ██
D.2 UI Clients                              ██  ██
D.3 UI Commandes                             ██  ██
D.4 UI Fidélité                              ██  ██
```

### Mois 5-6 (Sprints 9-12) : Intégration et Finalisation

```
Tâche                  S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12
D.5 UI Avis                                                ██
D.6 UI Dashboard                                           ██  ██
E.1 Tests unitaires                               ██  ██  ██  ██
E.2 Tests frontend                                ██  ██  ██
E.3 Pipeline CI/CD                                           ██
E.4 Déploiement staging                                       ██
E.5 Tests UAT                                                 ██  ██
E.6 Déploiement production                                       ██
F.1 Documentation API                              ██  ██  ██  ██
F.2 Guide utilisateur                                         ██  ██
F.3 Formation                                                    ██
F.4 Rapport                                                        ██
```

---

## 5. Identification et analyse des risques

### Matrice des risques (contexte Cameroun)

| ID | Risque | Probabilité | Impact | Niveau | Cause |
|----|--------|-------------|--------|--------|-------|
| R01 | Coupures électriques prolongées (>6h) | Élevée (4/5) | Critique (5/5) | **20 — Extrême** | Délestages Eneo récurrents à Douala |
| R02 | Connectivité Internet instable | Élevée (4/5) | Élevé (4/5) | **16 — Élevé** | Infrastructure réseau dégradée |
| R03 | Turnover des équipes techniques | Moyenne (3/5) | Élevé (4/5) | **12 — Élevé** | Pénurie de talents numériques au Cameroun |
| R04 | Contraintes de licences logicielles | Faible (2/5) | Moyen (3/5) | **6 — Modéré** | Coût des licences propriétaires |
| R05 | Latence réseau Douala-Cloud | Élevée (4/5) | Moyen (3/5) | **12 — Élevé** | Absence de data center local |
| R06 | Non-conformité réglementaire (données) | Faible (2/5) | Critique (5/5) | **10 — Élevé** | Loi n°2010/012 cybersécurité |
| R07 | Dérive budgétaire / dépassement des coûts | Moyenne (3/5) | Élevé (4/5) | **12 — Élevé** | Complexité technique du legacy |
| R08 | Mauvaise adoption par les utilisateurs | Moyenne (3/5) | Élevé (4/5) | **12 — Élevé** | Résistance au changement |

---

## 6. Plan de mitigation des risques

| ID | Risque | Action préventive | Action corrective |
|----|--------|-------------------|-------------------|
| R01 | Coupures électriques | Onduleurs (UPS) pour les postes de dev + PC portable avec batterie autonome | Télétravail prioritaire en période de délestage ; documentation hors-ligne |
| R02 | Connectivité instable | Architecture offline-first ; cache local (IndexedDB/Redis) ; développement en local avec synchronisation différée | Utilisation d'un VPN + connexion 4G de secours (partage de connexion mobile) |
| R03 | Turnover équipe | Documentation systématique du code ; pair-programming ; revue de code obligatoire | Constitution d'une réserve de compétences via la formation interne CAMTECH |
| R04 | Licences logicielles | Choix d'open source (Laravel, React, PostgreSQL, Redis) ; audit des licences | Négociation de licences éducation / partenariat |
| R05 | Latence réseau | Déploiement AWS Afrique du Sud (capetown) ; CDN CloudFront ; cache Redis local | Optimisation des requêtes API (pagination, eager loading) |
| R06 | Non-conformité RGPD-Cameroun | Hébergement BDD PostgreSQL sur serveur local Cameroun ; chiffrement AES-256 des données sensibles | Audit de conformité externe |
| R07 | Dérive budgétaire | Suivi hebdomadaire des JH consommés ; buffer de 10% sur chaque lot | Réallocation des ressources des modules en sous-consommation (CRM, BI) |
| R08 | Adoption utilisateurs | Ateliers de co-conception avec les équipes SavoirManger ; formation en présentiel | Hotline support dédiée pendant 1 mois post-déploiement |

---

## 7. Jalons contractuels

| Jalon | Date | Livrable | Critère de validation |
|-------|------|----------|----------------------|
| **J0** | 05 Jan 2026 | Kickoff projet | Réunion de lancement avec AGROCAM S.A. |
| **J1** | 28 Fév 2026 | Spécifications fonctionnelles validées | Document signé par le DG Henri-Claude MOUKAM |
| **J2** | 15 Mai 2026 | MVP CRM livré (clients + commandes) | Démo fonctionnelle des fonctionnalités de base |
| **J3** | 15 Août 2026 | Version complète CRM (fidélité + avis + dashboard) | Recette UAT validée par les responsables SavoirManger |
| **J4** | 15 Oct 2026 | Déploiement production CRM | Mise en production réelle dans 3 restaurants pilotes |
| **J5** | 30 Nov 2026 | Généralisation aux 12 restaurants | Rapport de satisfaction + passage en maintien en conditions opérationnelles |

---

## 8. Budget prévisionnel du module CRM

| Poste de charge | Montant (FCFA) | % |
|-----------------|----------------|---|
| Ressources humaines (152 JH × 250 000 FCFA/JH) | 38 000 000 | 40% |
| Infrastructure cloud (AWS Afrique du Sud, 6 mois) | 18 000 000 | 19% |
| Licences et outils | 8 000 000 | 8% |
| Formation et accompagnement | 12 000 000 | 13% |
| Réserve pour aléas (10%) | 9 600 000 | 10% |
| Frais de gestion CAMTECH | 10 400 000 | 10% |
| **TOTAL** | **96 000 000** | **100%** |
