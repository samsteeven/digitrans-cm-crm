<#
.SYNOPSIS
    Crée les 56 issues GitHub pour le projet DIGITRANS-CM CRM
.DESCRIPTION
    Utilise GitHub CLI (gh) pour créer les issues avec labels, milestones et assignations.
    Prérequis : gh auth login
#>

$repo = "samsteeven/digitrans-cm-crm"

# ── Labels ──
$labels = @(
    @{name="backend"; color="1d76db"; description="API Laravel / Backend"},
    @{name="frontend"; color="2dbe60"; description="React / Frontend"},
    @{name="infra"; color="000000"; description="CI/CD, Docker, AWS"},
    @{name="docs"; color="fef2c0"; description="Documentation"},
    @{name="bug"; color="d73a4a"; description="Correction"},
    @{name="enhancement"; color="a2eeef"; description="Amélioration"},
    @{name="high"; color="e99695"; description="Prioritaire"},
    @{name="good first issue"; color="7057ff"; description="Montée en compétence"}
)

Write-Host "=== Création des labels ===" -ForegroundColor Cyan
foreach ($l in $labels) {
    gh label create $l.name --color $l.color --description $l.description --repo $repo 2>$null
}

# ── Milestones ──
$milestones = @(
    @{title="J0 — Kickoff"; due="2026-01-05"; desc="Lancement"},
    @{title="J1 — Spécifications"; due="2026-02-15"; desc="Cahier des charges validé"},
    @{title="J2 — MVP"; due="2026-03-30"; desc="Version minimale"},
    @{title="J3 — Version complète"; due="2026-08-15"; desc="Tous les modules"},
    @{title="J4 — Recette UAT"; due="2026-10-15"; desc="Tests utilisateurs"},
    @{title="J5 — Mise en production"; due="2026-11-30"; desc="Déploiement"}
)

Write-Host "=== Création des milestones ===" -ForegroundColor Cyan
foreach ($m in $milestones) {
    gh api repos/$repo/milestones --field title=$($m.title) --field due_on="$($m.due)T23:59:59Z" --field description=$($m.desc) 2>$null
}

# ── Issues ──
$issues = @(
    @{title="Cadrage fonctionnel du module CRM"; labels="docs,high"; milestone="J0"}
    @{title="Planification des sprints et organisation"; labels="docs"; milestone="J0"}
    @{title="Définition et suivi des indicateurs KPI"; labels="docs"; milestone="J1"}
    @{title="Rédaction du plan de projet (WBS, Gantt, risques)"; labels="docs,high"; milestone="J0"}
    @{title="Préparation revue d'avancement n°1"; labels="docs"; milestone="J2"}
    @{title="Préparation revue d'avancement n°2"; labels="docs"; milestone="J3"}
    @{title="Rédaction du RETEX final"; labels="docs,high"; milestone="J5"}
    @{title="Mise à jour du tableau de bord pilotage"; labels="docs"; milestone="J2"}
    @{title="API Dashboard KPI (CA, évolution, top clients)"; labels="backend,high"; milestone="J2"}
    @{title="API Synchronisation offline-first (SyncController)"; labels="backend,high"; milestone="J3"}
    @{title="Pipeline CI/CD GitHub Actions (3 jobs)"; labels="infra,high"; milestone="J1"}
    @{title="Configuration monitoring Prometheus + Grafana"; labels="infra"; milestone="J3"}
    @{title="Composant DataTable (tableau générique)"; labels="frontend"; milestone="J2"}
    @{title="Page Dashboard KPI (graphiques Recharts)"; labels="frontend,high"; milestone="J2"}
    @{title="Guide utilisateur CRM (8 sections)"; labels="docs"; milestone="J4"}
    @{title="README.md technique du projet"; labels="docs"; milestone="J0"}
    @{title="Analyse des processus métier SavoirManger"; labels="docs"; milestone="J0"}
    @{title="Modélisation MCD/MLD de la base de données"; labels="docs"; milestone="J1"}
    @{title="API CRUD Clients (endpoints REST)"; labels="backend,high"; milestone="J2"}
    @{title="Migration base de données clients"; labels="backend"; milestone="J2"}
    @{title="API Fidélité : points, paliers, récompenses"; labels="backend,high"; milestone="J2"}
    @{title="Endpoint statistiques clients"; labels="backend"; milestone="J2"}
    @{title="Tests unitaires PHPUnit (8 tests API)"; labels="backend"; milestone="J2"}
    @{title="Correction DatabaseSeeder (dates échelonnées)"; labels="backend,bug"; milestone="J3"}
    @{title="Page Login (authentification)"; labels="frontend"; milestone="J2"}
    @{title="Page CommandesList (liste + statuts)"; labels="frontend"; milestone="J2"}
    @{title="Page AvisList (avis + analyse)"; labels="frontend"; milestone="J3"}
    @{title="Composant StatCard (indicateur réutilisable)"; labels="frontend"; milestone="J2"}
    @{title="Hooks React Query (useAvis, useCommandes)"; labels="frontend"; milestone="J2"}
    @{title="Spécification OpenAPI des endpoints"; labels="docs,high"; milestone="J1"}
    @{title="Documentation technique des APIs"; labels="docs"; milestone="J3"}
    @{title="Tests Vitest frontend (Stores + AuthContext)"; labels="frontend"; milestone="J3"}
    @{title="Conception architecture technique globale"; labels="docs,high"; milestone="J1"}
    @{title="Infrastructure Docker (5 services)"; labels="infra,high"; milestone="J0"}
    @{title="Configuration PostgreSQL + Redis"; labels="infra"; milestone="J1"}
    @{title="Déploiement staging AWS Afrique du Sud"; labels="infra,high"; milestone="J3"}
    @{title="Maquettes UI/UX (wireframes Figma)"; labels="docs"; milestone="J1"}
    @{title="API CRUD Commandes + gestion statuts"; labels="backend,high"; milestone="J2"}
    @{title="API CRUD Avis clients + analyse"; labels="backend"; milestone="J3"}
    @{title="API Plats et Catégories"; labels="backend"; milestone="J2"}
    @{title="Authentification Sanctum + middlewares"; labels="backend,high"; milestone="J2"}
    @{title="Endpoint Health check"; labels="backend"; milestone="J1"}
    @{title="Setup React + Vite + TailwindCSS + Router"; labels="frontend,high"; milestone="J2"}
    @{title="Interface ClientsList (tableau + filtres)"; labels="frontend,high"; milestone="J2"}
    @{title="Layout principal (sidebar + navigation)"; labels="frontend"; milestone="J2"}
    @{title="Page Fidélité (points + récompenses)"; labels="frontend"; milestone="J3"}
    @{title="Page PlatsList (catalogue + recherche)"; labels="frontend"; milestone="J2"}
    @{title="Store Zustand (auth, dashboard, UI)"; labels="frontend"; milestone="J2"}
    @{title="Tests Vitest DataTable + StatCard + API service"; labels="frontend"; milestone="J3"}
    @{title="Configuration ESLint + Prettier"; labels="infra"; milestone="J2"}
    @{title="Revue de code Sprint 1 — Config Docker"; labels="backend"; milestone="J0"}
    @{title="Revue de code Sprint 3 — API Clients"; labels="backend"; milestone="J2"}
    @{title="Revue de code Sprint 5 — API Fidélité"; labels="backend"; milestone="J2"}
    @{title="Revue de code Sprint 6 — Dashboard KPI"; labels="backend"; milestone="J2"}
    @{title="Revue de code Sprint 7 — UI Avis"; labels="frontend"; milestone="J3"}
    @{title="Revue de code Sprint 9 — Tests Vitest"; labels="frontend"; milestone="J3"}
    @{title="Session pair-programming cache Redis"; labels="enhancement"; milestone="J2"}
    @{title="Session formation TailwindCSS équipe"; labels="good first issue"; milestone="J1"}
)

Write-Host "=== Création des issues ===" -ForegroundColor Cyan
$i = 0
foreach ($issue in $issues) {
    $i++
    $body = "Issue créée automatiquement depuis le script de gestion de projet."
    Write-Host "[$i/$($issues.Count)] $($issue.title)" -ForegroundColor Gray
    gh issue create --repo $repo --title "$($issue.title)" --body "$body" --label "$($issue.labels)" --milestone "$($issue.milestone)" 2>$null
}

Write-Host ""
Write-Host "=== Terminé ! $($issues.Count) issues créées ===" -ForegroundColor Green