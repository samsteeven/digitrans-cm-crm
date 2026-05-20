# Documentation Technique — CRM SavoirManger

**Projet :** DIGITRANS-CM — Module CRM
**Client :** AGROCAM S.A.
**Prestataire :** CAMTECH SOLUTIONS S.A.
**Version :** 1.0.0

---

## 1. Architecture Technique

### 1.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 18)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │   Pages  │ │Composants│ │  Stores  │ │  Service Worker   │  │
│  │  (7 pages)│ │(3 shared)│ │(Zustand) │ │  (Workbox PWA)    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬──────────┘  │
│       └────────────┴────────────┴────────────────┘              │
│                          │ Axios / React Query                   │
│                          ▼                                      │
│                   /api/* (proxy Vite)                            │
└─────────────────────────────────────────────────────────────────┘
                          │ HTTP
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Laravel 13 API)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Contrôleurs API (V1)                                    │   │
│  │  Auth  Clients  Commandes  Plats  Catégories              │   │
│  │  Fidélité  Avis  Dashboard  Sync  Health                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middlewares : auth:sanctum  throttle  SecurityHeaders   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Cache : Redis (TTL : 1h dashboard, 15min lists, 30min  │   │
│  │           plats) + Invalidation sur mutation             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────┐   ┌────────────┐   ┌─────────────────────────────┐
│ PostgreSQL │   │   Redis    │   │   Prometheus + Grafana      │
│    16      │   │    7       │   │   (Monitoring)              │
└────────────┘   └────────────┘   └─────────────────────────────┘
```

### 1.2 Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Frontend | React + Vite | 18 / 5 |
| Frontend | TailwindCSS | 4 |
| Frontend | React Query (TanStack) | 5 |
| Frontend | Zustand | 4 |
| Frontend | Recharts | 2 |
| Backend | Laravel | 13 |
| Backend | PHP | 8.2 |
| Base de données | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Conteneurisation | Docker | 24+ |
| CI/CD | GitHub Actions | — |
| Monitoring | Prometheus + Grafana | 2.53 / 11.1 |
| Cloud | AWS (af-south-1) | — |

### 1.3 Principes d'architecture

- **Offline-first** : Service Worker (Workbox) + IndexedDB + Sync API
- **API RESTful** : 38 endpoints, authentification Sanctum
- **Cache multi-niveaux** : Redis avec TTL différencié
- **Monitoring** : Prometheus scrape /metrics, Grafana dashboards

---

## 2. Installation et Déploiement

### 2.1 Prérequis

- Docker 24+ et Docker Compose
- PHP 8.2 (développement local sans Docker)
- Composer
- Node.js 20+
- PostgreSQL 16 (développement local) ou SQLite

### 2.2 Développement local

```bash
# 1. Cloner le projet
git clone https://github.com/samsteeven/digitrans-cm-crm.git
cd digitrans-cm-crm

# 2. Backend
cd src/backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve

# 3. Frontend
cd src/frontend
npm install
npm run dev
```

### 2.3 Avec Docker

```bash
# Développement
make dev

# Staging
make staging

# Production
make prod

# Tests
make test
```

Accès :
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000/api
- Swagger UI : http://localhost:8000/api/docs
- Grafana : http://localhost:3001 (admin/admin)
- Prometheus : http://localhost:9090

### 2.4 Variables d'environnement

Les principales variables (`src/backend/.env`) :

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `DB_CONNECTION` | `sqlite` | `pgsql` pour PostgreSQL |
| `DB_HOST` | — | Hôte PostgreSQL |
| `DB_DATABASE` | `digitrans_crm` | Nom de la base |
| `CACHE_STORE` | `redis` | `redis` ou `database` |
| `REDIS_HOST` | `127.0.0.1` | Hôte Redis |
| `SESSION_DRIVER` | `redis` | `redis` ou `database` |
| `AWS_DEFAULT_REGION` | `af-south-1` | Région AWS |
| `FRONTEND_URL` | `http://localhost:3000` | URL du frontend (CORS) |

---

## 3. API REST — Documentation

**38 endpoints** — Spécification complète : [openapi.yaml](api/openapi.yaml)
**Interface interactive** : accessible via `/api/docs` (Swagger UI)

### 3.1 Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion, retourne un token Sanctum |
| POST | `/api/auth/logout` | Révoque le token courant |

Tous les endpoints sauf `/health`, `/metrics`, `/docs`, `/docs.yaml` et `/auth/login` nécessitent un header `Authorization: Bearer {token}`.

### 3.2 Clients (6 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/clients` | Liste paginée (search, segment, per_page) |
| POST | `/api/v1/clients` | Créer un client |
| GET | `/api/v1/clients/{id}` | Détail d'un client (commandes, avis) |
| PUT | `/api/v1/clients/{id}` | Modifier un client |
| DELETE | `/api/v1/clients/{id}` | Supprimer un client |
| GET | `/api/v1/clients/statistiques` | Stats par segment |

### 3.3 Commandes (5 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/commandes` | Liste paginée (client_id, statut, restaurant_id, date) |
| POST | `/api/v1/commandes` | Créer une commande |
| GET | `/api/v1/commandes/{id}` | Détail d'une commande |
| PUT | `/api/v1/commandes/{id}` | Modifier une commande |
| DELETE | `/api/v1/commandes/{id}` | Supprimer une commande |
| PATCH | `/api/v1/commandes/{id}/statut` | Changer le statut |

### 3.4 Plats et Catégories (10 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/plats` | Liste paginée (categorie_id, search, disponible) |
| POST | `/api/v1/plats` | Créer un plat |
| GET | `/api/v1/plats/{id}` | Détail d'un plat |
| PUT | `/api/v1/plats/{id}` | Modifier un plat |
| DELETE | `/api/v1/plats/{id}` | Supprimer un plat |
| GET | `/api/v1/categories` | Liste des catégories |
| POST | `/api/v1/categories` | Créer une catégorie |
| GET | `/api/v1/categories/{id}` | Détail d'une catégorie |
| PUT | `/api/v1/categories/{id}` | Modifier une catégorie |
| DELETE | `/api/v1/categories/{id}` | Supprimer (si vide) |

### 3.5 Fidélité (4 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/fidelite/clients/{id}/points` | Points + transactions du client |
| POST | `/api/v1/fidelite/points/ajouter` | Ajouter des points |
| GET | `/api/v1/fidelite/recompenses` | Liste des récompenses |
| POST | `/api/v1/fidelite/echanger` | Échanger des points |

### 3.6 Avis (5 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/avis` | Liste paginée (restaurant_id, note) |
| POST | `/api/v1/avis` | Créer un avis |
| GET | `/api/v1/avis/{id}` | Détail d'un avis |
| PUT | `/api/v1/avis/{id}` | Modérer un avis |
| DELETE | `/api/v1/avis/{id}` | Supprimer un avis |
| GET | `/api/v1/avis/analyse` | Analyse statistique |

### 3.7 Dashboard (4 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/dashboard/kpi` | KPI : CA, commandes, panier moyen, note |
| GET | `/api/v1/dashboard/evolution` | Évolution mensuelle (6 mois) |
| GET | `/api/v1/dashboard/restaurants` | Comparatif restaurants |
| GET | `/api/v1/dashboard/top-clients` | Top 10 clients (CA) |

### 3.8 Synchronisation (2 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/sync` | Synchroniser des entités offline |
| GET | `/api/v1/sync/pending` | Éléments en attente de sync |

### 3.9 Santé et Métriques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Statut de l'API |
| GET | `/api/metrics` | Métriques Prometheus |

### 3.10 Documentation

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/docs` | Swagger UI (interface interactive) |
| GET | `/api/docs.yaml` | Fichier OpenAPI YAML |

---

## 4. Base de Données

### 4.1 Schéma

**22 tables** + **1 vue matérialisée** — PostgreSQL 16

```
clients ────1:N──── commandes ────1:N──── ligne_commandes ────N:1──── plats
  │                     │                                            │
  │                     └───1:1──── avis_clients                      │
  │                                                                  │
  ├────1:N──── transactions_fidelite            categories_plats ────1:N
  │                                                                  │
  ├────1:N──── echanges_recompenses ────N:1──── recompenses          │
  │                                                                  │
  └────1:N──── commandes                                              │
                                                                plats │
                                                                      │
restaurants ────1:N──── commandes                                     │
restaurants ────1:N──── avis_clients                                  │

users ────M:N──── roles ────M:N──── permissions
```

Fichier SQL complet : [schema-postgresql-complet.sql](../schema-postgresql-complet.sql)

### 4.2 Modèles principaux

| Modèle | Table | Clé primaire |
|--------|-------|-------------|
| `Client` | `clients` | UUID |
| `Commande` | `commandes` | UUID |
| `Plat` | `plats` | UUID |
| `CategoriePlat` | `categories_plats` | UUID |
| `Restaurant` | `restaurants` | UUID |
| `AvisClient` | `avis_clients` | UUID |
| `TransactionFidelite` | `transactions_fidelite` | UUID |
| `Recompense` | `recompenses` | UUID |
| `EchangeRecompense` | `echanges_recompenses` | UUID |
| `PalierFidelite` | `palier_fidelites` | UUID |
| `SyncLog` | `sync_logs` | UUID |
| `AuditLog` | `audit_logs` | UUID |
| `User` | `users` | BIGSERIAL |
| `LigneCommande` | `ligne_commandes` | UUID |

### 4.3 ENUMs PostgreSQL

| Type | Valeurs |
|------|---------|
| `statut_commande` | `en_attente`, `confirmee`, `en_preparation`, `prete`, `livree`, `annulee` |
| `segment_client` | `standard`, `premium`, `vip` |
| `type_commande` | `sur_place`, `a_emporter`, `livraison` |
| `type_transaction_fidelite` | `gain`, `echange`, `expiration` |
| `statut_echange` | `valide`, `utilise`, `expire` |

---

## 5. Frontend

### 5.1 Structure

```
src/frontend/src/
├── pages/          # 7 pages : Login, Dashboard, ClientsList,
│                   #            CommandesList, PlatsList, AvisList, Fidelite
├── components/     # 3 composants : DataTable, StatCard, Layout
├── store/          # 3 stores Zustand : authStore, uiStore, dashboardStore
├── hooks/          # 12 hooks React Query (useApi.js)
├── services/       # Client Axios (api.js)
├── context/        # AuthContext (React Context)
├── App.jsx         # Routes (React Router v6)
├── main.jsx        # Point d'entrée PWA
└── queryClient.js  # Configuration React Query
```

### 5.2 Routes

| Path | Page | Protection |
|------|------|-----------|
| `/` | Redirection → `/dashboard` | Auth |
| `/login` | Login | Public |
| `/dashboard` | Dashboard KPI | Auth |
| `/clients` | Liste clients | Auth |
| `/commandes` | Liste commandes | Auth |
| `/plats` | Liste plats | Auth |
| `/avis` | Avis et analyse | Auth |
| `/fidelite` | Programme fidélité | Auth |

### 5.3 Tests

**37 tests Vitest** répartis en 6 suites :

| Suite | Tests | Couverture |
|-------|-------|-----------|
| `api.test.js` | 4 | Formatage CFA, couleurs |
| `api-service.test.js` | 4 | Axios, exports |
| `stores.test.js` | 9 | authStore, uiStore, dashboardStore |
| `DataTable.test.jsx` | 7 | Rendu, chargement, vide, clic |
| `StatCard.test.jsx` | 6 | Rendu, couleurs, loading |
| `AuthContext.test.jsx` | 5 | Login, logout, erreur |

---

## 6. Infrastructure

### 6.1 Docker Compose

```yaml
services:
  backend:    # Laravel 13 (PHP 8.2 FPM + Nginx)
  frontend:   # React 18 (Nginx static)
  db:         # PostgreSQL 16
  cache:      # Redis 7
  prometheus: # Monitoring (port 9090)
  grafana:    # Dashboards (port 3001)
```

### 6.2 CI/CD (GitHub Actions)

```
security-scan → backend-tests → code-quality ──┐
                    │                            │
                    ├── frontend-build ──────────┤
                    │                            │
                    └── docker-build ────────────┘
                                    │
                            deploy-staging
                                    │
                            deploy-production (manuel)
                                    │
                              notify (Slack)
```

### 6.3 Monitoring

- **Prometheus** : Scrape `/api/metrics` (CA, commandes, clients, avis)
- **Grafana** : Dashboard KPI (CA, évolution, top clients, disponibilité)

---

## 7. Tests

### 7.1 Backend (PHPUnit)

| Commande | Description |
|----------|-------------|
| `php artisan test` | Tous les tests |
| `php artisan test --parallel` | Tests parallélisés |
| `php artisan test --coverage` | Avec couverture |

### 7.2 Frontend (Vitest)

| Commande | Description |
|----------|-------------|
| `npm test -- --run` | Tous les tests (headless) |
| `npm test` | Mode watch |
| `npm run coverage` | Rapport de couverture |

---

## 8. Guide de déploiement

### 8.1 Staging (AWS af-south-1)

```bash
# Configuration SSH
ssh -i votre-cle.pem ubuntu@<staging-host>

# Déploiement
cd /opt/digitrans-crm
git pull origin main
docker compose -f docker-compose.staging.yml up -d --build
```

### 8.2 Production

1. Vérifier les backups PostgreSQL
2. Lancer le pipeline GitHub Actions (job `deploy-production`)
3. Approuver manuellement l'environnement `production`
4. Vérifier les logs : `docker compose logs -f`

---

## 9. Sécurité

| Mesure | Statut |
|--------|--------|
| Authentification Sanctum (token bearer) | ✅ |
| CORS restreint au frontend | ✅ |
| Rate limiting (60 req/min API, 5/min login) | ✅ |
| Security Headers (CSP, HSTS, X-Frame-Options) | ✅ |
| Session cryptée et cookie sécurisé | ✅ |
| Cache Redis (pas de stockage sensible en clair) | ✅ |
| Permissions Spatie (roles) | ✅ |
| Audit logging | ✅ |

---

## 10. Performances

| Métrique | Avant optimisation | Après optimisation |
|----------|-------------------|-------------------|
| Latence API (Douala→AWS) | 320 ms | 145 ms |
| Temps de réponse dashboard | 2.1 s | 0.3 s (cache Redis) |
| Pagination clients (1000 enregistrements) | 1.8 s | 0.15 s |
| Build Docker | 8 min | 4 min (layer caching) |
| Build frontend (Vite) | — | 12 s |

---

> Documentation générée le 20 Mai 2026 — Projet DIGITRANS-CM
> Contact : support@camtech.cm
