# Section I.3 — Coordination d'Équipe et Outils Collaboratifs

## 1. Organisation de l'équipe

### Répartition des rôles

| Membre | Rôle principal | Responsabilités |
|--------|---------------|-----------------|
| **Samen Djiaha Migouel Steeve** | Chef de projet / Développeur full-stack | Planification, suivi budgétaire, coordination, dashboard KPI, CI/CD |
| Youessah Lele Audrey | Développeuse full-stack | API Clients, API Fidélité, tests backend, documentation API, UI commandes |
| Kwitat Noutat Carmel | Développeur full-stack | Architecture technique, API Commandes, API Avis, déploiement cloud, UI clients |

### Ajustements en cours de projet

| Sprint | Ajustement | Raison |
|--------|------------|--------|
| Sprint 3 | Réaffectation de Carmel sur les maquettes UI | Retard dans la conception UX (montée en compétence Tailwind) |
| Sprint 6 | Audrey prend en charge les tests unitaires backend | Carmel accaparé par le déploiement cloud AWS |
| Sprint 8 | Samen reprend le développement du dashboard KPI | Charge organisationnelle réduite après le jalon J2 |

---

## 2. Outils collaboratifs

### 2.1 Gestion de projet — Jira (tableau Kanban)

Un tableau Kanban Jira a été mis en place avec les colonnes suivantes :

```
Backlog → Sprint Backlog → In Progress → In Review → Done
```

**Configuration du tableau :**
- 6 colonnes (Backlog, To Do, In Progress, Review, Testing, Done)
- 3 épics : Backend, Frontend, Infrastructure
- Story points estimés en taille de t-shirt (XS=1, S=2, M=3, L=5, XL=8)
- 1 sprint = 2 semaines (du lundi au vendredi de la semaine suivante)

### 2.2 Versionnement du code — Git + GitHub

- Dépôt : `github.com/camtech-solutions/digitrans-cm-crm`
- Branche principale : `main` (protégée — revue obligatoire)
- Branches de fonctionnalités : `feature/C-2-api-clients`, `feature/D-3-ui-commandes`, etc.
- Conventions de commit : `[#GH-123] type(scope): description` (Conventional Commits)
- Protection : 1 approbation requise avant merge, pipeline CI/CD doit passer
- **Projet GitHub** : board Kanban avec 6 colonnes, 56 issues réparties entre les 3 membres (détail complet dans `docs/github-projet/README.md`)

### 2.3 Communication

| Outil | Usage |
|-------|-------|
| Slack | Communication quotidienne, canal #projet-digitrans-crm |
| Google Meet | Daily stand-up (10 min, 8h30), sprint reviews |
| Notion | Wiki projet, documentation partagée, compte-rendu de réunions |
| WhatsApp | Groupe d'urgence (coupures réseau, alertes) |

### 2.4 Documentation partagée

Un espace Notion a été créé avec les sections suivantes :
- **Dashboard projet** : vue d'ensemble, jalons, KPI en temps réel
- **Spécifications fonctionnelles** : validées par AGROCAM
- **Documentation technique** : architecture, BDD, endpoints API
- **Sprint logs** : compte-rendu de chaque sprint
- **Compte-rendu de réunions** : décisions et actions

---

## 3. Journal de bord (Sprint Log)

### Sprint 1 (01-14 Juin 2026)

**Objectif :** Cadrage et lancement du module CRM

| Date | Activité | Participants | Décisions / Points clés |
|------|----------|-------------|------------------------|
| 01/06 | Kickoff module CRM | Toute l'équipe | Validation du périmètre CRM, définition des user stories |
| 03/06 | Atelier métier SavoirManger | Samen, Audrey | Analyse du processus de commande actuel (legacy 2009) |
| 05/06 | Design Review architecture | Carmel, Samen | Choix de PostgreSQL vs MySQL → PostgreSQL retenu pour la fiabilité |
| 08/06 | Sprint planning S1 | Toute l'équipe | 18 story points engagés |
| 12/06 | Sprint review S1 | Toute l'équipe | 16 SP livrés (88%) — léger retard sur l'analyse métier |

**Problème rencontré :** Difficulté d'accès aux données du legacy (format propriétaire). Solution : atelier complémentaire avec le DSI d'AGROCAM programmé en S2.

**Décisions :**
- Adoption d'une architecture offline-first (contrainte connectivité)
- PostgreSQL comme SGBD principal
- Hébergement BDD sur serveur local Cameroun (Camtel数据中心 à Douala)

### Sprint 2 (15-28 Juin 2026)

**Objectif :** Modélisation BDD, maquettes UI, spécifications API

| Date | Activité | Participants | Décisions / Points clés |
|------|----------|-------------|------------------------|
| 15/06 | Spécification API endpoints | Toute l'équipe | Validation du contrat OpenAPI |
| 18/06 | Revue des maquettes UI | Carmel, Samen | Retour AGROCAM : ajouter un mode hors-ligne pour les commandes |
| 22/06 | Session pair-programming | Audrey, Carmel | Montée en compétence Laravel Eloquent (relations complexes) |
| 26/06 | Sprint review S2 | Toute l'équipe | 20 SP livrés (100%) |

**Problème rencontré :** Coupure électrique de 8h le 22/06 — perte de 4h de travail. Solution : adoption d'un UPS APC 1500VA pour le poste partagé.

### Sprint 3 (29 Juin — 12 Juillet 2026)

**Objectif :** Développement backend (API Clients), setup frontend

| Date | Activité | Participants |
|------|----------|-------------|
| 29/06 | Début développement API Clients | Audrey |
| 02/07 | Setup React + Vite + TailwindCSS | Carmel |
| 05/07 | Revue de code API Clients | Toute l'équipe |
| 10/07 | Sprint review S3 | Toute l'équipe |

**Problème technique :** Latence élevée (220ms) entre Douala et AWS Afrique du Sud lors du pull des images Docker. Solution : mise en place d'un registry Docker local (Harbor) sur le serveur CAMTECH à Douala.

### Sprint 4 (13-26 Juillet 2026)

**Objectif :** API Commandes, UI Clients

| Date | Activité | Participants |
|------|----------|-------------|
| 15/07 | Développement API Commandes | Carmel |
| 18/07 | Sprint planning S4 | Toute l'équipe |
| 22/07 | Revue de code UI Clients | Samen, Audrey |
| 26/07 | Sprint review S4 | Toute l'équipe |

### Sprint 5 (27 Juillet — 09 Août 2026)

**Objectif :** API Fidélité, UI Commandes, Pipeline CI/CD

| Date | Activité | Participants |
|------|----------|-------------|
| 29/07 | Développement API Fidélité | Audrey |
| 01/08 | Mise en place GitHub Actions CI/CD | Samen |
| 05/08 | Revue de code pipeline CI/CD | Carmel, Samen |
| 09/08 | Sprint review S5 | Toute l'équipe |

### Sprint 6 (10-23 Août 2026)

**Objectif :** API Avis, déploiement staging

| Date | Activité | Participants |
|------|----------|-------------|
| 12/08 | Développement API Avis | Carmel |
| 15/08 | Déploiement staging AWS | Carmel, Samen |
| 19/08 | Tests UAT (phase 1) | Toute l'équipe |
| 23/08 | Sprint review S6 | Toute l'équipe |

---

## 4. Actions de montée en compétences

| Date | Sujet | Format | Intervenant | Participants |
|------|-------|--------|-------------|-------------|
| 05/06 | Laravel 11 — Nouvelles fonctionnalités | Tutoriel vidéo (auto-formation) | — | Audrey, Carmel |
| 12/06 | PostgreSQL avancé — Indexation et performance | Pair-programming | Carmel | Audrey |
| 22/06 | TailwindCSS — Composants responsives | Atelier pratique | Audrey | Carmel |
| 01/07 | GitHub Actions — CI/CD pour Laravel | Documentation + TP | Samen | Toute l'équipe |
| 15/07 | Tests PHPUnit — Bonnes pratiques | Revue de code commentée | Audrey | Carmel |
| 28/07 | Architecture offline-first avec Service Workers | Session technique | Carmel | Toute l'équipe |
| 10/08 | Monitoring Prometheus + Grafana | Atelier pratique | Samen | Toute l'équipe |

---

## 5. Dynamique d'équipe et réflexivité

### Difficultés rencontrées

1. **Fuseaux horaires et disponibilités** : Les membres de l'équipe ont des contraintes personnelles différentes. Solution : plage horaire commune obligatoire de 9h à 12h (heures Cameroun).

2. **Courbe d'apprentissage Laravel** : Deux membres découvraient Laravel. Solution : sessions de pair-programming et documentation systématique.

3. **Coupures Internet** : 3 incidents en 6 sprints. Solution : documentation hors-ligne (PDF des docs Laravel/React) et partage de connexion 4G.

4. **Alignement des interfaces** : Divergences UI entre les composants développés par Audrey et Carmel. Solution : création d'un Design System minimal (composants Tailwind réutilisables).

### Points forts

- Communication transparente via le daily stand-up Slack
- Revue de code systématique avant merge (qualité du code)
- Résolution rapide des problèmes techniques grâce à la veille collective
- Bonne entente et esprit d'équipe malgré les difficultés techniques

### Enseignements pour les prochains projets

- Investir dans un Design System dès le début du projet
- Prévoir un buffer de 20% sur les JH pour les imprévus techniques (vs 10% actuel)
- Organiser des ateliers de formation en amont sur la stack technique
- Documenter les décisions architecturales dans une Architecture Decision Record (ADR)
