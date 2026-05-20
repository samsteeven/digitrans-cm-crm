$repo = "samsteeven/digitrans-cm-crm"

Write-Host "=== Creation des labels ===" -ForegroundColor Cyan

gh label create "backend" --color "1d76db" --description "API Laravel / Backend" --repo $repo 2>$null
gh label create "frontend" --color "2dbe60" --description "React / Frontend" --repo $repo 2>$null
gh label create "infra" --color "000000" --description "CI/CD, Docker, AWS" --repo $repo 2>$null
gh label create "docs" --color "fef2c0" --description "Documentation" --repo $repo 2>$null
gh label create "bug" --color "d73a4a" --description "Correction" --repo $repo 2>$null
gh label create "enhancement" --color "a2eeef" --description "Amelioration" --repo $repo 2>$null
gh label create "high" --color "e99695" --description "Prioritaire" --repo $repo 2>$null
gh label create "good first issue" --color "7057ff" --description "Montee en competence" --repo $repo 2>$null

Write-Host "=== Creation des milestones ===" -ForegroundColor Cyan

gh api repos/$repo/milestones --field title="J0 - Kickoff" --field due_on="2026-01-05T23:59:59Z" --field description="Lancement" 2>$null
gh api repos/$repo/milestones --field title="J1 - Specifications" --field due_on="2026-02-15T23:59:59Z" --field description="Cahier des charges valide" 2>$null
gh api repos/$repo/milestones --field title="J2 - MVP" --field due_on="2026-03-30T23:59:59Z" --field description="Version minimale" 2>$null
gh api repos/$repo/milestones --field title="J3 - Version complete" --field due_on="2026-08-15T23:59:59Z" --field description="Tous les modules" 2>$null
gh api repos/$repo/milestones --field title="J4 - Recette UAT" --field due_on="2026-10-15T23:59:59Z" --field description="Tests utilisateurs" 2>$null
gh api repos/$repo/milestones --field title="J5 - Mise en production" --field due_on="2026-11-30T23:59:59Z" --field description="Deploiement" 2>$null

Write-Host "=== Creation des issues ===" -ForegroundColor Cyan

$issues = @(
    "Cadrage fonctionnel du module CRM|docs,high|J0 - Kickoff",
    "Planification des sprints et organisation|docs|J0 - Kickoff",
    "Definition et suivi des indicateurs KPI|docs|J1 - Specifications",
    "Redaction du plan de projet (WBS, Gantt, risques)|docs,high|J0 - Kickoff",
    "Preparation revue d'avancement n°1|docs|J2 - MVP",
    "Preparation revue d'avancement n°2|docs|J3 - Version complete",
    "Redaction du RETEX final|docs,high|J5 - Mise en production",
    "Mise a jour du tableau de bord pilotage|docs|J2 - MVP",
    "API Dashboard KPI (CA, evolution, top clients)|backend,high|J2 - MVP",
    "API Synchronisation offline-first (SyncController)|backend,high|J3 - Version complete",
    "Pipeline CI/CD GitHub Actions (3 jobs)|infra,high|J1 - Specifications",
    "Configuration monitoring Prometheus + Grafana|infra|J3 - Version complete",
    "Composant DataTable (tableau generique)|frontend|J2 - MVP",
    "Page Dashboard KPI (graphiques Recharts)|frontend,high|J2 - MVP",
    "Guide utilisateur CRM (8 sections)|docs|J4 - Recette UAT",
    "README.md technique du projet|docs|J0 - Kickoff",
    "Analyse des processus metier SavoirManger|docs|J0 - Kickoff",
    "Modelisation MCD/MLD de la base de donnees|docs|J1 - Specifications",
    "API CRUD Clients (endpoints REST)|backend,high|J2 - MVP",
    "Migration base de donnees clients|backend|J2 - MVP",
    "API Fidelite : points, paliers, recompenses|backend,high|J2 - MVP",
    "Endpoint statistiques clients|backend|J2 - MVP",
    "Tests unitaires PHPUnit (8 tests API)|backend|J2 - MVP",
    "Correction DatabaseSeeder (dates echelonnees)|backend,bug|J3 - Version complete",
    "Page Login (authentification)|frontend|J2 - MVP",
    "Page CommandesList (liste + statuts)|frontend|J2 - MVP",
    "Page AvisList (avis + analyse)|frontend|J3 - Version complete",
    "Composant StatCard (indicateur reutilisable)|frontend|J2 - MVP",
    "Hooks React Query (useAvis, useCommandes)|frontend|J2 - MVP",
    "Specification OpenAPI des endpoints|docs,high|J1 - Specifications",
    "Documentation technique des APIs|docs|J3 - Version complete",
    "Tests Vitest frontend (Stores + AuthContext)|frontend|J3 - Version complete",
    "Conception architecture technique globale|docs,high|J1 - Specifications",
    "Infrastructure Docker (5 services)|infra,high|J0 - Kickoff",
    "Configuration PostgreSQL + Redis|infra|J1 - Specifications",
    "Deploiement staging AWS Afrique du Sud|infra,high|J3 - Version complete",
    "Maquettes UI/UX (wireframes Figma)|docs|J1 - Specifications",
    "API CRUD Commandes + gestion statuts|backend,high|J2 - MVP",
    "API CRUD Avis clients + analyse|backend|J3 - Version complete",
    "API Plats et Categories|backend|J2 - MVP",
    "Authentification Sanctum + middlewares|backend,high|J2 - MVP",
    "Endpoint Health check|backend|J1 - Specifications",
    "Setup React + Vite + TailwindCSS + Router|frontend,high|J2 - MVP",
    "Interface ClientsList (tableau + filtres)|frontend,high|J2 - MVP",
    "Layout principal (sidebar + navigation)|frontend|J2 - MVP",
    "Page Fidelite (points + recompenses)|frontend|J3 - Version complete",
    "Page PlatsList (catalogue + recherche)|frontend|J2 - MVP",
    "Store Zustand (auth, dashboard, UI)|frontend|J2 - MVP",
    "Tests Vitest DataTable + StatCard + API service|frontend|J3 - Version complete",
    "Configuration ESLint + Prettier|infra|J2 - MVP",
    "Revue de code Sprint 1 - Config Docker|backend|J0 - Kickoff",
    "Revue de code Sprint 3 - API Clients|backend|J2 - MVP",
    "Revue de code Sprint 5 - API Fidelite|backend|J2 - MVP",
    "Revue de code Sprint 6 - Dashboard KPI|backend|J2 - MVP",
    "Revue de code Sprint 7 - UI Avis|frontend|J3 - Version complete",
    "Revue de code Sprint 9 - Tests Vitest|frontend|J3 - Version complete",
    "Session pair-programming cache Redis|enhancement|J2 - MVP",
    "Session formation TailwindCSS equipe|good first issue|J1 - Specifications"
)

$i = 0
foreach ($issue in $issues) {
    $i++
    $parts = $issue.Split("|")
    $title = $parts[0]
    $labels = $parts[1]
    $milestone = $parts[2]
    $body = "Issue creee automatiquement."
    Write-Host "[$i/$($issues.Count)] $title" -ForegroundColor Gray
    gh issue create --repo $repo --title "$title" --body "$body" --label "$labels" --milestone "$milestone" 2>$null
}

Write-Host ""
Write-Host "=== Termine ! $($issues.Count) issues creees ===" -ForegroundColor Green