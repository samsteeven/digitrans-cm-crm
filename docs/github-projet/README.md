# Projet GitHub — DIGITRANS-CM / CRM SavoirManger

## Configuration initiale

```bash
# 1. Créer le dépôt sur GitHub (interface web)
#    https://github.com/new
#    Nom : digitrans-cm-crm
#    Owner : camtech-solutions
#    Privé

# 2. Initialiser le dépôt en local
git init
git add .
git commit -m "[init] Structure initiale du projet DIGITRANS-CM CRM"
git branch -M main
git remote add origin https://github.com/camtech-solutions/digitrans-cm-crm.git
git push -u origin main
```

## 3. Créer les issues

```bash
# Installer GitHub CLI
# Windows : winget install GitHub.cli
# macOS : brew install gh
# Linux : sudo apt install gh

# S'authentifier
gh auth login

# Lancer le script
powershell -ExecutionPolicy Bypass -File docs/github-projet/creer-issues.ps1
```

## 4. Configurer le board Kanban (interface web GitHub)

1. Aller sur `https://github.com/camtech-solutions/digitrans-cm-crm/projects`
2. Cliquer **"Create project"** → **"Board"**
3. Nom : **"CRM SavoirManger — Sprint Board"**
4. Ajouter les colonnes : **Backlog → Sprint Backlog → In Progress → In Review → Testing → Done**
5. Ajouter les issues par colonne via l'interface glisser-déposer

## 5. Configurer les règles de protection de branche

1. Settings → Branches → Add rule
2. Branch name pattern : `main`
3. ✅ **Require a pull request before merging**
   - ✅ Require approvals (1)
4. ✅ **Require status checks** (sélectionner le pipeline CI)

---

## Résumé de la répartition du travail

| Personne | Rôle | Tâches | JH | Fichiers principaux |
|----------|------|--------|----|-------------------|
| **Samen** | Chef de projet / Dev | 22 | 53 | Plan projet, KPI, Dashboard API, CI/CD, README, Guide utilisateur |
| **Audrey** | Développeuse full-stack | 16 | 60 | API Clients, Fidélité, tests, OpenAPI, Commandes UI, Avis UI |
| **Carmel** | Développeur full-stack | 18 | 70 | Architecture, Docker, API Commandes/Avis, UI Clients/Fidélité, Stores |

**Total : 56 tâches, 183 JH**

---

## Sprint Log (résumé pour soutenance)

```
S1 ══ Cadrage (Samen, Audrey)
    → Plan projet, analyse métier, Docker

S2 ══ Conception (Carmel, Audrey)
    → Architecture, MCD, maquettes, spécifications API

S3 ══ Fondations (Équipe)
    → API Clients, Auth, Setup React, Layout, Stores

S4 ══ Backend opérationnel (Carmel, Audrey)
    → API Commandes, Plats, UI Clients

S5 ══ Fidélité + Dashboard (Samen, Audrey)
    → API Fidélité, Dashboard KPI, CI/CD, UI Commandes

S6 ══ Avis + Déploiement (Carmel, Samen)
    → API Avis, Dashboard UI, Tests, Déploiement AWS

S7 ══ Tests et finition (Audrey)
    → Tests backend, UI Avis

S8 ══ Offline-first (Samen, Carmel)
    → Sync API, UI Fidélité, documentation API

S9 ══ Documentation (Équipe)
    → Guide utilisateur, tests Vitest, monitoring

S10 ══ RETEX (Samen)
    → Bilan final, livraison
```
