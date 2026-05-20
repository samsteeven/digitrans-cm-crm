$repo = "samsteeven/digitrans-cm-crm"

Write-Host "=== Assignation des issues ===" -ForegroundColor Cyan

$issues = gh issue list --repo $repo --state open --limit 100 --json number,title

# Convertir en tableau pour assigner par mot-cle dans le titre
$assignMap = @{
    "samsteeven" = @(
        "Cadrage fonctionnel", "Planification des sprints", "Definition et suivi",
        "Redaction du plan de projet", "Preparation revue", "Redaction du RETEX",
        "Mise a jour du tableau", "API Dashboard KPI", "API Synchronisation",
        "Pipeline CI/CD", "Configuration monitoring", "Composant DataTable",
        "Page Dashboard KPI", "Guide utilisateur", "README.md",
        "Conception architecture", "Infrastructure Docker", "Configuration PostgreSQL",
        "Deploiement staging", "Maquettes UI",
        "Review de code Sprint"
    )
    "youessah" = @(
        "Analyse des processus", "Modelisation MCD", "API CRUD Clients",
        "Migration base", "API Fidelite", "Endpoint statistiques",
        "Tests unitaires PHPUnit", "Correction DatabaseSeeder",
        "Page Login", "Page CommandesList", "Page AvisList",
        "Composant StatCard", "Hooks React Query",
        "Specification OpenAPI", "Documentation technique",
        "Tests Vitest frontend"
    )
    "carmelle2" = @(
        "API CRUD Commandes", "API CRUD Avis", "API Plats",
        "Authentification Sanctum", "Endpoint Health",
        "Setup React + Vite", "Interface ClientsList",
        "Layout principal", "Page Fidelite", "Page PlatsList",
        "Store Zustand", "Tests Vitest DataTable",
        "Configuration ESLint",
        "Session pair-programming", "Session formation"
    )
}

# Assigner chaque issue
foreach ($issue in $issues) {
    $data = $issue | ConvertFrom-Json
    $num = $data.number
    $title = $data.title
    $assignee = $null

    foreach ($person in $assignMap.Keys) {
        foreach ($keyword in $assignMap[$person]) {
            if ($title -like "*$keyword*") {
                $assignee = $person
                break
            }
        }
        if ($assignee) { break }
    }

    if ($assignee) {
        gh issue edit $num --repo $repo --add-assignee $assignee
        Write-Host "[#$num] $title -> $assignee" -ForegroundColor Green
    } else {
        Write-Host "[#$num] $title -> NON ASSIGNE" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Assignations terminees ===" -ForegroundColor Green