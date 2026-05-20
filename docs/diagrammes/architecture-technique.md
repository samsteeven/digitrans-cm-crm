# Architecture Technique — CRM SavoirManger

**Fichier diagramme PlantUML :** `docs/diagrammes/architecture-technique.puml`  
**Outil :** tsaUML / PlantUML (extension VS Code ou https://www.plantuml.com)

---

## Vue d'ensemble

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ Frontend │────▶│ Backend  │────▶│    DB    │
│  PWA     │     │ React 18 │     │ Laravel  │     │ Postgres │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                     │                 │
                     ▼                 ▼
              ┌──────────┐     ┌──────────┐
              │ Service  │     │  Redis   │
              │  Worker  │     │  Cache   │
              │ Workbox  │     │ + Queue  │
              └──────────┘     └──────────┘
```

---

## 1. Couche Frontend (React 18 + Vite)

### Composants

| Bloc | Technologie | Rôle |
|------|------------|------|
| Pages | React 18 | 7 pages : Login, Dashboard, Clients, Commandes, Plats, Avis, Fidélité |
| Composants partagés | React | DataTable, StatCard, Layout (sidebar + navbar) |
| État global | Zustand | 3 stores : authStore (token), uiStore (sidebar, thème), dashboardStore (filtres) |
| Requêtes API | React Query + Axios | 10 hooks : useApi.js, baseURL `/api/v1` |
| Routage | React Router v6 | Pages protégées par AuthContext |
| PWA / Offline | Workbox + IndexedDB | Service Worker avec stratégies NetworkFirst / CacheFirst, sync offline |

### Flux de données frontend

```
Page → Hook (React Query) → Axios → Vite proxy → Backend API
                                              ↕
                                    Service Worker (cache)
                                              ↕
                                    IndexedDB (offline)
```

---

## 2. Couche Backend (Laravel 13 API)

### Contrôleurs API (V1)

| Contrôleur | Routes | Préfixe |
|-----------|--------|---------|
| AuthController | `POST /auth/login`, `POST /auth/logout` | `/api/v1` |
| ClientController | CRUD + `GET /statistiques` | `/api/v1/clients` |
| CommandeController | CRUD + `PATCH /{id}/statut` | `/api/v1/commandes` |
| PlatController | CRUD | `/api/v1/plats` |
| CategorieController | CRUD | `/api/v1/categories` |
| FideliteController | points, ajouter, récompenses, échanger | `/api/v1/fidelite` |
| AvisController | CRUD + `GET /analyse` | `/api/v1/avis` |
| DashboardController | KPI, évolution, restaurants, top-clients | `/api/v1/dashboard` |
| SyncController | synchronisation offline | `/api/v1/sync` |
| Health | santé | `/api/health` |

### Middlewares

| Middleware | Routes | Rôle |
|-----------|--------|------|
| `auth:sanctum` | Routes `/api/v1/*` (sauf login) | Authentification par token bearer |
| `throttle:api` | Routes `/api/v1/*` | Rate limiting : 60 requêtes/min |
| `throttle:login` | `POST /auth/login` | Rate limiting : 5 tentatives/min |
| `HandleCors` | Toutes les routes | CORS : origines autorisées |

### Cache (Redis)

| Cache | TTL | Stratégie |
|-------|-----|-----------|
| Dashboard KPI | 1h | Cache-first, invalidation manuelle |
| Dashboard évolution | 1h | Cache-first |
| Liste clients | 15min | Cache-first |
| Liste commandes | 15min | Cache-first |
| Carte des plats | 30min | Cache-first |

### Queue (Redis + Horizon)

- Supervisor configuré : `php artisan queue:work`
- Files d'attente : `default`, `sync`, `fidelite`

---

## 3. Base de données (PostgreSQL 16)

### Objets

| Type | Nombre |
|------|--------|
| Tables métier | 12 (clients, commandes, plats, catégories, restaurants, ligne_commandes, avis_clients, transactions_fidelite, recompenses, echanges_recompenses, palier_fidelites, sync_logs) |
| Tables système | 10 (users, sessions, cache, cache_locks, jobs, job_batches, failed_jobs, personal_access_tokens, permissions, audit_logs) |
| Vue matérialisée | 1 (mv_kpi_quotidiens) |
| Types ENUM | 7 (statut_commande, segment_client, type_commande, type_recompense, statut_echange, type_transaction_fidelite, action_sync) |

### Indexation

- Index sur toutes les clés étrangères
- Index sur `statut`, `note`, `created_at`, `est_synchronise`
- Index composé : `tokenable_type + tokenable_id`, `entite_type + entite_id`
- Index fonctionnel : `expiration` (cache), `last_activity` (sessions)

---

## 4. Infrastructure (Docker)

### Services

| Service | Image | Port |
|---------|-------|------|
| `backend` | Laravel 13 (PHP 8.2 FPM + Nginx) | 8000 → 80 |
| `frontend` | React 18 (Nginx static) | 3000 → 80 |
| `db` | PostgreSQL 16 Alpine | 5432 |
| `cache` | Redis 7 Alpine | 6379 |
| `prometheus` | Prometheus 2.53 | 9090 |
| `grafana` | Grafana 11.1 | 3001 |

### Réseau Docker

- Bridge `digitrans-crm-net`
- Volumes persistants : `pgdata` (PostgreSQL), `redis-data` (Redis), `grafana-storage` (Grafana)

---

## 5. CI/CD (GitHub Actions)

### Pipeline

```
Push/PR → Security Scan (Trivy)
              │
       ┌──────┴──────┐
       ▼              ▼
  Backend Tests   Frontend Build
  (PHPUnit)       (npm build + lint)
       │              │
       └──────┬──────┘
              ▼
         Code Quality
         (PHPStan + Pint)
              │
              ▼
         Docker Build & Push
         (ghcr.io)
              │
              ▼
         Deploy Staging
         (AWS EC2 af-south-1)
              │
              ▼
         Deploy Production
         (environnement manuel)
              │
              ▼
         Notify (Slack)
```

---

## 6. Monitoring (Prometheus + Grafana)

### Métriques exposées

| Métrique | Type | Description |
|----------|------|-------------|
| `crm_clients_total` | Gauge | Nombre total de clients |
| `crm_commandes_total` | Gauge | Nombre total de commandes |
| `crm_ca_total` | Gauge | Chiffre d'affaires total (FCFA) |
| `crm_avis_total` | Gauge | Nombre total d'avis |

### Endpoint

```
GET /api/metrics → Prometheus scrape (toutes les 15s)
```

---

## 7. Sécurité

| Mesure | Implémentation |
|--------|---------------|
| Authentification | Sanctum (token bearer) |
| CORS | `config/cors.php` : origines frontend uniquement |
| Rate limiting | 60 req/min API, 5 req/min login |
| Headers sécurité | SecurityHeaders middleware (CSP, HSTS, X-Frame-Options) |
| Session | Encrypted cookie, Redis store |
| Permissions | Spatie Laravel-permission (RBAC) |
| Audit trail | Table `audit_logs` |

---

> Fichier : `docs/diagrammes/architecture-technique.puml`  
> Généré avec PlantUML — Ouvrir dans VS Code (extension PlantUML) ou sur https://www.plantuml.com
