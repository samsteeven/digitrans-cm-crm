# Équipe DIGITRANS-CM — Module CRM SavoirManger

## Composition

| Rôle | Membre | GitHub | Email |
|------|--------|--------|-------|
| **Chef de projet / Lead Dev Backend** | Samen Djiaha Migouel Steeve | @samsteeven | samsteeven@gmail.com |
| **Développeuse Frontend** | Youessah Lele Audrey | @youessah | audrey.youessah@email.com |
| **Développeuse Backend / QA** | Kwitat Noutat Carmel | @carmelle2 | carmel.kwitat@email.com |

## Répartition des responsabilités

### Samen — Chef de projet & Lead Dev Backend
- Planification, coordination, jalons J0-J5
- Architecture technique globale (API, base de données, Docker, CI/CD, AWS)
- Backend : AuthController, DashboardController, SyncController
- Infrastructure : docker-compose, nginx, Prometheus/Grafana, Redis
- Sécurité : CORS, rate limiting, middleware, sessions
- Documentation technique : OpenAPI, Swagger UI, PHPDoc
- Supervision des PRs et merges

### Audrey — Développeuse Frontend React
- Architecture frontend (routes, stores Zustand, hooks React Query)
- Pages : Dashboard, Login, ClientsList, CommandesList, PlatsList
- Composants : DataTable, StatCard, Layout (sidebar)
- États : chargement, erreur, vide, pagination, recherche
- Programmes fidélité (page Fidelite avec échange de points)
- Avis clients (page AvisList avec analyse)
- Tests Vitest des composants et pages

### Carmel — Développeuse Backend & Tests
- Backend : ClientController, CommandeController, PlatController
- Backend : CategorieController, FideliteController, AvisController
- Corrections bugs : update/destroy manquants, compatibilité SQLite
- Modèles Eloquent, migrations, factories, seeders
- Tests PHPUnit (couverture endpoints)
- Qualité du code et refactoring

## Répartition GitHub

| Membre | Issues assignées | Branches | PRs |
|--------|-----------------|----------|-----|
| @samsteeven | #82 → #87, #94, #101 | infra/*, feat/* | 8 PRs merged |
| @youessah | #73 → #81 | feat/frontend-* | 9 PRs à créer |
| @carmelle2 | #67 → #72 | fix/backend-* | 6 PRs à créer |

## Historique des commits

```
samsteeven  23 commits  (Chef de projet + infra)
youessah    11 commits  (Frontend)
carmelle2   10 commits  (Backend)
```
