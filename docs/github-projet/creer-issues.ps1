# Organisation GitHub — Projet DIGITRANS-CM / CRM SavoirManger

Ce dossier documente la structure complète du projet GitHub utilisée pour gérer le travail d'équipe.

## Accès au dépôt

```
URL : https://github.com/camtech-solutions/digitrans-cm-crm
Branche principale : main (protégée)
Branches de fonctionnalités : feature/<code-tache>-<description>
```

## Workflow Git

```
main ──── merge (revue obligatoire) ────┐
   ↑                                    │
   │  feature/D-2-ui-clients ───────────┤
   │  feature/C-2-api-clients ──────────┤
   │  feature/C-3-api-commandes ────────┤
   │  ...                               │
   └────────────────────────────────────┘
```

**Règles :**
- Chaque fonctionnalité dans sa branche `feature/`
- 1 approbation requise avant merge
- Pipeline CI/CD doit passer (GitHub Actions)
- Conventions de commit : `[#GH-XX] type(scope): description`

---

## 1. Projet GitHub (Board)

Un **GitHub Project Board** (vue Kanban) a été créé avec 6 colonnes :

| Colonne | Description |
|---------|-------------|
| 📋 Backlog | Tâches à prioriser |
| 📌 Sprint Backlog | Tâches retenues pour le sprint en cours |
| 🏗 In Progress | En cours de développement |
| 👀 In Review | En revue de code (Pull Request ouverte) |
| ✅ Testing | Tests en cours (QA) |
| 🎉 Done | Terminé et mergé |

**Labels utilisés :**

| Label | Couleur | Signification |
|-------|---------|---------------|
| `backend` | 🔵 Bleu | Tâche côté API Laravel |
| `frontend` | 🟢 Vert | Tâche côté React |
| `infra` | ⚫ Noir | CI/CD, Docker, AWS |
| `docs` | 🟡 Jaune | Documentation |
| `bug` | 🔴 Rouge | Correction d'anomalie |
| `enhancement` | 🟣 Violet | Amélioration |
| `high` | 🟠 Orange | Prioritaire |
| `good first issue` | 🔵 Clair | Pour montée en compétence |

---

## 2. Milestones (Jalons)

| Jalon | Date | Livraison |
|-------|------|-----------|
| J0 — Kickoff | 05 Jan 2026 | Lancement projet |
| J1 — Spécifications | 15 Fév 2026 | Cahier des charges validé |
| J2 — MVP | 30 Mar 2026 | Version minimale (clients + commandes) |
| J3 — Version complète | 15 Août 2026 | Tous les modules |
| J4 — Recette | 15 Oct 2026 | Tests UAT validés |
| J5 — Mise en production | 30 Nov 2026 | Déploiement final |

---

## 3. Liste complète des Issues par personne

### 👤 Samen Djiaha Migouel Steeve — Chef de projet / Développeur

#### Planification et coordination

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-001 | Cadrage fonctionnel du module CRM | task | S1 | 3 |
| GH-002 | Planification des sprints et organisation | task | S1 | 2 |
| GH-003 | Définition et suivi des indicateurs KPI | task | S2 | 2 |
| GH-004 | Rédaction du plan de projet (WBS, Gantt, risques) | task | S1 | 3 |
| GH-005 | Préparation de la revue d'avancement n°1 | task | S5 | 2 |
| GH-006 | Préparation de la revue d'avancement n°2 | task | S9 | 2 |
| GH-007 | Rédaction du RETEX final | task | S10 | 2 |
| GH-008 | Mise à jour du tableau de bord pilotage | task | S5 | 2 |

#### Développement

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-009 | API Dashboard KPI (CA, évolution, top clients) | feat | S5 | 6 |
| GH-010 | API Synchronisation offline-first (SyncController) | feat | S8 | 6 |
| GH-011 | Pipeline CI/CD GitHub Actions (3 jobs) | feat | S4 | 4 |
| GH-012 | Configuration monitoring Prometheus + Grafana | feat | S9 | 3 |
| GH-013 | Composant DataTable (tableau générique réutilisable) | feat | S3 | 3 |
| GH-014 | Page Dashboard KPI (graphiques Recharts) | feat | S6 | 4 |

#### Docs + Coordination

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-015 | Guide utilisateur CRM (8 sections) | docs | S9 | 4 |
| GH-016 | README.md technique du projet | docs | S1 | 1 |
| GH-017 | Animation des daily stand-ups et sprint reviews | task | S1-S10 | 4 |
| GH-018 | Sessions pair-programming (cache Redis, tests) | task | S5 | 2 |

**Total Samen : 22 tâches, 53 JH**

---

### 👩 Audrey Youessah Lele — Développeuse full-stack

#### Backend

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-019 | Analyse des processus métier SavoirManger | task | S1 | 5 |
| GH-020 | Modélisation MCD/MLD de la base de données | task | S2 | 4 |
| GH-021 | API CRUD Clients (endpoints REST) | feat | S3 | 8 |
| GH-022 | Migration base de données clients | feat | S3 | 3 |
| GH-023 | API Fidélité : points, paliers, récompenses | feat | S5 | 6 |
| GH-024 | Endpoint statistiques clients | feat | S4 | 2 |
| GH-025 | Tests unitaires PHPUnit (8 tests API) | test | S6 | 4 |
| GH-026 | Correction DatabaseSeeder (dates échelonnées) | fix | S9 | 1 |

#### Frontend

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-027 | Page Login (authentification) | feat | S3 | 3 |
| GH-028 | Page CommandesList (liste + statuts) | feat | S5 | 4 |
| GH-029 | Page AvisList (avis + analyse) | feat | S7 | 4 |
| GH-030 | Composant StatCard (indicateur réutilisable) | feat | S3 | 2 |
| GH-031 | Hooks React Query (useAvis, useCommandes) | feat | S5 | 3 |

#### Documentation

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-032 | Spécification OpenAPI des endpoints | docs | S2 | 5 |
| GH-033 | Documentation technique des APIs | docs | S8 | 3 |
| GH-034 | Tests Vitest frontend (Stores + AuthContext) | test | S9 | 3 |

**Total Audrey : 16 tâches, 60 JH**

---

### 👨 Carmel Kwitat Noutat — Développeur full-stack

#### Architecture & Infrastructure

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-035 | Conception architecture technique globale | task | S2 | 4 |
| GH-036 | Mise en place infrastructure Docker (5 services) | feat | S1 | 4 |
| GH-037 | Configuration PostgreSQL + Redis | feat | S2 | 3 |
| GH-038 | Déploiement staging AWS Afrique du Sud | feat | S6 | 3 |
| GH-039 | Maquettes UI/UX (wireframes Figma) | task | S2 | 4 |

#### Backend

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-040 | API CRUD Commandes + gestion statuts | feat | S4 | 8 |
| GH-041 | API CRUD Avis clients + analyse | feat | S6 | 4 |
| GH-042 | API Plats et Catégories | feat | S4 | 4 |
| GH-043 | Authentification Sanctum + middlewares | feat | S3 | 4 |
| GH-044 | Endpoint Health check | feat | S2 | 1 |

#### Frontend

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-045 | Setup React + Vite + TailwindCSS + Router | feat | S3 | 5 |
| GH-046 | Interface ClientsList (tableau + filtres) | feat | S4 | 6 |
| GH-047 | Layout principal (sidebar + navigation) | feat | S3 | 3 |
| GH-048 | Page Fidélité (points + récompenses) | feat | S6 | 5 |
| GH-049 | Page PlatsList (catalogue + recherche) | feat | S5 | 3 |
| GH-050 | Store Zustand (auth, dashboard, UI) | feat | S3 | 3 |

#### Documentation

| # | Titre | Type | Sprint | JH |
|---|-------|------|--------|----|
| GH-051 | Tests Vitest DataTable + StatCard + API service | test | S9 | 3 |
| GH-052 | Configuration ESLint + Prettier | task | S3 | 1 |

**Total Carmel : 18 tâches, 70 JH**

---

## 4. Répartition par sprint

| Sprint | Dates | Tâches | SP | Responsable principal |
|--------|-------|--------|----|----------------------|
| S1 | 05-18 Jan | GH-001, 002, 004, 017, 019, 036 | 20 | Samen |
| S2 | 19 Jan-01 Fév | GH-003, 020, 032, 035, 037, 039, 044 | 24 | Carmel |
| S3 | 02-15 Fév | GH-013, 016, 021, 022, 027, 030, 043, 045, 047, 050, 052 | 30 | Équipe |
| S4 | 16 Fév-01 Mar | GH-011, 024, 040, 042, 046 | 22 | Carmel |
| S5 | 02-15 Mar | GH-005, 008, 018, 023, 028, 031, 049 | 24 | Audrey |
| S6 | 16-29 Mar | GH-009, 014, 025, 041, 048, 080 | 22 | Samen |
| S7 | 30 Mar-12 Avr | GH-029, 081 | 10 | Audrey |
| S8 | 13-26 Avr | GH-010, 033, 082 | 12 | Carmel |
| S9 | 27 Avr-10 Mai | GH-006, 012, 015, 026, 034, 051 | 16 | Samen |
| S10 | 11-24 Mai | GH-007 | 4 | Équipe |

---

## 5. Script de création des Issues GitHub

> Pour importer toutes ces issues dans votre dépôt GitHub, installez `gh` (GitHub CLI) puis exécutez le script PowerShell ci-dessous.

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="write">
<｜｜DSML｜｜parameter name="content" string="true"><#
.SYNOPSIS
    Crée toutes les issues GitHub pour le projet DIGITRANS-CM CRM SavoirManger
.DESCRIPTION
    Ce script utilise GitHub CLI (gh) pour créer les issues dans le dépôt
    camtech-solutions/digitrans-cm-crm avec labels, milestones et assignations.
.PRÉREQUIS
    - gh (GitHub CLI) installé : https://cli.github.com/
    - Authentifié : gh auth login
    - Dépôt créé sur GitHub
.NOTES
    Auteur : Samen Djiaha Migouel Steeve
    Projet : DIGITRANS-CM — Module CRM SavoirManger
#>

# Configuration
$repo = "camtech-solutions/digitrans-cm-crm"

# Labels à créer
$labels = @(
    @{name="backend"; color="1d76db"; description="API Laravel / Backend"},
    @{name="frontend"; color="2dbe60"; description="React / Frontend"},
    @{name="infra"; color="000000"; description="CI/CD, Docker, AWS"},
    @{name="docs"; color="fef2c0"; description="Documentation"},
    @{name="bug"; color="d73a4a"; description="Correction d'anomalie"},
    @{name="enhancement"; color="a2eeef"; description="Amélioration"},
    @{name="high"; color="e99695"; description="Prioritaire"},
    @{name="good first issue"; color="7057ff"; description="Pour montée en compétence"}
)

# Création des labels
Write-Host "=== Création des labels ===" -ForegroundColor Cyan
foreach ($l in $labels) {
    gh label create $l.name --color $l.color --description $l.description --repo $repo 2>$null
}

# Milestones (jalons)
$milestones = @(
    @{title="J0 — Kickoff"; due_date="2026-01-05"; description="Lancement du projet"},
    @{title="J1 — Spécifications"; due_date="2026-02-15"; description="Cahier des charges validé"},
    @{title="J2 — MVP"; due_date="2026-03-30"; description="Version minimale clients + commandes"},
    @{title="J3 — Version complète"; due_date="2026-08-15"; description="Tous les modules livrés"},
    @{title="J4 — Recette UAT"; due_date="2026-10-15"; description="Tests utilisateurs validés"},
    @{title="J5 — Mise en production"; due_date="2026-11-30"; description="Déploiement final"}
)

Write-Host "=== Création des milestones ===" -ForegroundColor Cyan
foreach ($m in $milestones) {
    gh api repos/$repo/milestones --field title=$($m.title) --field due_on="$($m.due_date)T23:59:59Z" --field description=$($m.description) 2>$null
}

# Liste des issues : titre | labels | milestone | assignee | body
$issues = @(
    # ── Samen : Planification ──
    @{title="Cadrage fonctionnel du module CRM"; labels="docs,high"; milestone="J0"; assignee=""; body="Définir le périmètre du module CRM avec AGROCAM : fonctionnalités, contraintes, livrables attendus."}
    @{title="Planification des sprints et organisation"; labels="docs"; milestone="J0"; assignee=""; body="Structurer les 10 sprints, définir les cérémonies Agile, configurer Jira."}
    @{title="Définition et suivi des indicateurs KPI"; labels="docs"; milestone="J1"; assignee=""; body="Identifier les 5 KPI du module CRM : tests, bugs, CI/CD, offline, vélocité."}
    @{title="Rédaction du plan de projet (WBS, Gantt, risques)"; labels="docs,high"; milestone="J0"; assignee=""; body="WBS 120 JH, Gantt sprints 1-10, analyse des 6 risques camerounais."}
    @{title="Préparation revue d'avancement n°1"; labels="docs"; milestone="J2"; assignee=""; body="Bilan sprint 1-5, écarts budget, KPI, actions correctives."}
    @{title="Préparation revue d'avancement n°2"; labels="docs"; milestone="J3"; assignee=""; body="Bilan sprint 6-9, mise à jour KPI, projection fin de projet."}
    @{title="Rédaction du RETEX final"; labels="docs,high"; milestone="J5"; assignee=""; body="Bonnes pratiques, axes d'amélioration, enseignements pour futurs projets."}
    @{title="Mise à jour du tableau de bord pilotage"; labels="docs"; milestone="J2"; assignee=""; body="Suivi budget, JH, KPI, écarts, projections."}

    # ── Samen : Développement ──
    @{title="API Dashboard KPI (CA, évolution, top clients)"; labels="backend,high"; milestone="J2"; assignee=""; body="Endpoints : /api/v1/dashboard/kpi, evolution, top-clients, restaurants."}
    @{title="API Synchronisation offline-first (SyncController)"; labels="backend,high"; milestone="J3"; assignee=""; body="Endpoints POST /api/v1/sync et GET /api/v1/sync/pending."}
    @{title="Pipeline CI/CD GitHub Actions (3 jobs)"; labels="infra,high"; milestone="J1"; assignee=""; body="Jobs : tests backend, build frontend, deploy staging."}
    @{title="Configuration monitoring Prometheus + Grafana"; labels="infra"; milestone="J3"; assignee=""; body="Métriques API, latence, uptime, alerting."}
    @{title="Composant DataTable (tableau générique)"; labels="frontend"; milestone="J2"; assignee=""; body="Composant React réutilisable avec colonnes, tri, chargement."}
    @{title="Page Dashboard KPI (graphiques Recharts)"; labels="frontend,high"; milestone="J2"; assignee=""; body="Graphiques CA, commandes, KPI avec Recharts."}

    # ── Samen : Docs ──
    @{title="Guide utilisateur CRM (8 sections)"; labels="docs"; milestone="J4"; assignee=""; body="Guide complet pour les équipes SavoirManger non techniques."}
    @{title="README.md technique du projet"; labels="docs"; milestone="J0"; assignee=""; body="README racine avec badges, installation, structure, API."}

    # ── Audrey : Backend ──
    @{title="Analyse des processus métier SavoirManger"; labels="docs"; milestone="J0"; assignee=""; body="Ateliers avec AGROCAM, analyse du legacy 2009, processus commande."}
    @{title="Modélisation MCD/MLD de la base de données"; labels="docs"; milestone="J1"; assignee=""; body="Schéma PostgreSQL : clients, commandes, plats, fidélité, avis."}
    @{title="API CRUD Clients (endpoints REST)"; labels="backend,high"; milestone="J2"; assignee=""; body="CRUD complet clients + recherche + segmentation."}
    @{title="Migration base de données clients"; labels="backend"; milestone="J2"; assignee=""; body="Migration Laravel pour la table clients."}
    @{title="API Fidélité : points, paliers, récompenses"; labels="backend,high"; milestone="J2"; assignee=""; body="Endpoints points/ajouter, recompenses, echanger."}
    @{title="Endpoint statistiques clients"; labels="backend"; milestone="J2"; assignee=""; body="GET /api/v1/clients/statistiques : totaux, segments, nouveaux."}
    @{title="Tests unitaires PHPUnit (8 tests API)"; labels="backend"; milestone="J2"; assignee=""; body="8 tests : auth, clients, commandes, plats, fidelite, avis, dashboard, sync."}
    @{title="Correction DatabaseSeeder (dates échelonnées)"; labels="backend,bug"; milestone="J3"; assignee=""; body="200 commandes avec created_at échelonnés jan-mai 2026."}

    # ── Audrey : Frontend ──
    @{title="Page Login (authentification)"; labels="frontend"; milestone="J2"; assignee=""; body="Formulaire login avec validation et stockage token."}
    @{title="Page CommandesList (liste + statuts)"; labels="frontend"; milestone="J2"; assignee=""; body="Liste des commandes avec filtres par statut."}
    @{title="Page AvisList (avis + analyse)"; labels="frontend"; milestone="J3"; assignee=""; body="Liste des avis avec filtres et note moyenne."}
    @{title="Composant StatCard (indicateur réutilisable)"; labels="frontend"; milestone="J2"; assignee=""; body="Carte d'indicateur avec label, valeur, loading."}
    @{title="Hooks React Query (useAvis, useCommandes)"; labels="frontend"; milestone="J2"; assignee=""; body="Hooks : useAvis, useCommandes, useRecompenses."}

    # ── Audrey : Documentation ──
    @{title="Spécification OpenAPI des endpoints"; labels="docs,high"; milestone="J1"; assignee=""; body="Documentation OpenAPI 3.0.3 des 38 endpoints API."}
    @{title="Documentation technique des APIs"; labels="docs"; milestone="J3"; assignee=""; body="Documentation détaillée des contrôleurs et modèles."}
    @{title="Tests Vitest frontend (Stores + AuthContext)"; labels="frontend"; milestone="J3"; assignee=""; body="Tests pour les 3 stores Zustand et le AuthContext."}

    # ── Carmel : Architecture ──
    @{title="Conception architecture technique globale"; labels="docs,high"; milestone="J1"; assignee=""; body="Architecture offline-first 3 couches, stack Laravel/React."}
    @{title="Mise en place infrastructure Docker (5 services)"; labels="infra,high"; milestone="J0"; assignee=""; body="docker-compose : backend, frontend, postgres, redis."}
    @{title="Configuration PostgreSQL + Redis"; labels="infra"; milestone="J1"; assignee=""; body="Configuration BDD, cache, sessions, files d'attente."}
    @{title="Déploiement staging AWS Afrique du Sud"; labels="infra,high"; milestone="J3"; assignee=""; body="Déploiement Docker sur AWS EC2 af-south-1."}
    @{title="Maquettes UI/UX (wireframes Figma)"; labels="docs"; milestone="J1"; assignee=""; body="Maquettes des pages : Dashboard, Clients, Commandes."}

    # ── Carmel : Backend ──
    @{title="API CRUD Commandes + gestion statuts"; labels="backend,high"; milestone="J2"; assignee=""; body="CRUD commandes + endpoint PATCH statut."}
    @{title="API CRUD Avis clients + analyse"; labels="backend"; milestone="J3"; assignee=""; body="CRUD avis + endpoint analyse (note moyenne, tendances)."}
    @{title="API Plats et Catégories"; labels="backend"; milestone="J2"; assignee=""; body="CRUD plats + catégories avec filtres."}
    @{title="Authentification Sanctum + middlewares"; labels="backend,high"; milestone="J2"; assignee=""; body="Auth token, middleware auth:sanctum sur toutes les routes."}
    @{title="Endpoint Health check"; labels="backend"; milestone="J1"; assignee=""; body="GET /api/health : statut API, version, BDD."}

    # ── Carmel : Frontend ──
    @{title="Setup React + Vite + TailwindCSS + Router"; labels="frontend,high"; milestone="J2"; assignee=""; body="Configuration initiale du projet frontend."}
    @{title="Interface ClientsList (tableau + filtres)"; labels="frontend,high"; milestone="J2"; assignee=""; body="Page clients avec recherche et filtre par segment."}
    @{title="Layout principal (sidebar + navigation)"; labels="frontend"; milestone="J2"; assignee=""; body="Layout avec sidebar, header, navigation."}
    @{title="Page Fidélité (points + récompenses)"; labels="frontend"; milestone="J3"; assignee=""; body="Page fidélité avec points, paliers, échange récompenses."}
    @{title="Page PlatsList (catalogue + recherche)"; labels="frontend"; milestone="J2"; assignee=""; body="Page plats avec recherche et filtre par catégorie."}
    @{title="Store Zustand (auth, dashboard, UI)"; labels="frontend"; milestone="J2"; assignee=""; body="3 stores : authStore, dashboardStore, uiStore."}

    # ── Carmel : Documentation ──
    @{title="Tests Vitest DataTable + StatCard + API service"; labels="frontend"; milestone="J3"; assignee=""; body="Tests composants et service API."}
    @{title="Configuration ESLint + Prettier"; labels="infra"; milestone="J2"; assignee=""; body="Configuration linting du projet frontend."}
)

Write-Host "=== Création des issues ===" -ForegroundColor Cyan
$i = 0
foreach ($issue in $issues) {
    $i++
    $body = $issue.body -replace '"', '\"'
    $labels = $issue.labels
    $milestone = $issue.milestone
    $assignee = $issue.assignee

    $cmd = "gh issue create --repo $repo --title `"$($issue.title)`" --body `"$body`" --label `"$labels`""
    if ($milestone) { $cmd += " --milestone `"$milestone`"" }
    if ($assignee) { $cmd += " --assignee `"$assignee`"" }

    Write-Host "[$i/$($issues.Count)] $($issue.title)" -ForegroundColor Gray
    Invoke-Expression $cmd 2>$null
}

Write-Host ""
Write-Host "=== Terminé ! $($issues.Count) issues créées ===" -ForegroundColor Green
Write-Host "Connectez-vous sur https://github.com/$repo/projects pour configurer le board Kanban."
