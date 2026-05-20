# Projet DIGITRANS-CM — Module CRM SavoirManger

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)
![AWS](https://img.shields.io/badge/AWS-af--south--1-FF9900?logo=amazonaws)

**Client :** AGROCAM S.A. (Douala, Cameroun)  
**Prestataire :** CAMTECH SOLUTIONS S.A.  
**Période :** Janvier 2026 — Juin 2027 (18 mois)  
**Budget module CRM :** 96 000 000 FCFA  
**Statut :** 66 % d'avancement (Sprints 1-10)

---

## 1. Présentation du projet

DIGITRANS-CM est un projet de transformation numérique du système d'information d'**AGROCAM S.A.**, groupe agroalimentaire camerounais exploitant 12 restaurants sous l'enseigne **SavoirManger** (Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré).

Le **module CRM** (Customer Relationship Management) remplace le système legacy de 2009 par une application moderne permettant la gestion des clients, des commandes, du programme de fidélité, des avis et un tableau de bord décisionnel.

### 5 modules fonctionnels

| Module | Description |
|--------|-------------|
| Clients | Profil, historique, segmentation (standard / premium / VIP) |
| Commandes | Prise de commande, suivi des statuts, facturation |
| Fidélité | Points, paliers (Bronze à Platine), récompenses |
| Avis | Notation 1-5, commentaires, analyse de satisfaction |
| Dashboard | KPI en temps réel, évolution CA, top clients |

---

## 2. Architecture technique

```
┌─────────────────────────────────────────────────────────────┐
│                   NAVIGATEUR CLIENT (PWA)                    │
│  React 18 + Vite + TailwindCSS + React Query + Zustand      │
│  Service Worker (Workbox) → Offline-first                    │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP / HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              API LARAVEL 13 (REST)                           │
│  Sanctum Auth · Spatie Permissions · Fractal Transformers   │
│  38 endpoints · Validation · Audit Logs                     │
└───────┬──────────────────────────────────┬──────────────────┘
        │                                  │
        ▼                                  ▼
┌───────────────┐                ┌──────────────────┐
│  PostgreSQL   │                │  Redis (Cache)    │
│  16 (Données  │◄───────────────│  · Session        │
│  clients sous │                │  · Dashboard KPI  │
│  souveraineté │                │  · Files d'attente │
│  camerounaise)│                │  · Sync Queue      │
└───────────────┘                └──────────────────┘
```

**Infrastructure :** Docker Compose (5 services) · AWS af-south-1 (Cape Town) · CDN CloudFront  
**CI/CD :** GitHub Actions (tests → build → deploy staging)

---

## 3. Prérequis

| Technologie | Version minimale | Vérification |
|-------------|-----------------|--------------|
| Docker | 24+ | `docker --version` |
| Docker Compose | 2.20+ | `docker compose version` |
| PHP | 8.3+ | `php --version` |
| Composer | 2.7+ | `composer --version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |

---

## 4. Installation et lancement

### 4.1 Cloner et configurer

```bash
git clone <url-du-repo>
cd DIGITRANS-CM

# Variables d'environnement
cp src/backend/.env.example src/backend/.env
```

Configurez les variables dans `src/backend/.env` (voir section 5).

### 4.2 Lancement avec Docker Compose

```bash
# Construire et démarrer tous les services
docker compose up -d --build

# Appliquer les migrations et le seed
docker compose exec backend php artisan migrate --seed

# Vérifier
curl http://localhost:8000/api/health
# → {"status":"ok","module":"CRM SavoirManger","version":"1.0.0"}
```

### 4.3 Accès

| Service | URL | Identifiants par défaut |
|---------|-----|------------------------|
| **API** | `http://localhost:8000/api` | — |
| **Frontend** | `http://localhost:5173` | admin@savoirmanager.cm / password |
| **Base de données** | `localhost:5432` | digitrans / secret |
| **Redis** | `localhost:6379` | — |

### 4.4 Développement sans Docker

```bash
# Backend
cd src/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend (autre terminal)
cd src/frontend
npm install
npm run dev
```

---

## 5. Variables d'environnement

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `APP_ENV` | `local` | Environnement (local, staging, production) |
| `APP_URL` | `http://localhost:8000` | URL de base de l'API |
| `DB_CONNECTION` | `pgsql` | Type de BDD (pgsql, sqlite) |
| `DB_HOST` | `127.0.0.1` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_DATABASE` | `digitrans_crm` | Nom de la base |
| `DB_USERNAME` | `digitrans` | Utilisateur |
| `DB_PASSWORD` | `secret` | Mot de passe |
| `REDIS_HOST` | `127.0.0.1` | Hôte Redis |
| `CACHE_DRIVER` | `redis` | Driver de cache |
| `QUEUE_CONNECTION` | `redis` | Driver de file d'attente |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:5173` | Domaines de confiance pour l'auth |
| `SESSION_DRIVER` | `cookie` | Driver de session |
| `AWS_DEFAULT_REGION` | `af-south-1` | Région AWS |
| `MAIL_MAILER` | `log` | Driver mail (log en dev) |

---

## 6. Commandes utiles

### Backend

```bash
# Tests
php artisan test                             # Toute la suite
php artisan test --testsuite=Api             # Tests API uniquement
php artisan test --coverage                  # Avec couverture

# Base de données
php artisan migrate                          # Migrer
php artisan migrate:fresh --seed             # Reset + seed
php artisan db:seed                          # Re-seed

# Cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Outils
php artisan tinker                           # Console interactive
php artisan route:list --path=api            # Lister les routes API
php artisan make:controller ...              # Générer du code
```

### Frontend

```bash
npm run dev              # Serveur de développement (port 5173)
npm run build            # Build production
npm run preview          # Prévisualiser le build
npm run test             # Tests Vitest
npm run test:coverage    # Couverture des tests
npm run lint             # ESLint
```

---

## 7. Tests

```bash
# Tout lancer
cd src/backend && php artisan test
cd src/frontend && npm run test

# API uniquement (8 tests, couverture backend ~85 %)
cd src/backend && php artisan test --testsuite=Api

# Frontend uniquement
cd src/frontend && npm run test -- --coverage
```

**Couverture actuelle :** 72 % globale (backend 85 %, frontend 55 %) — objectif ≥ 80 %.

---

## 8. Pipeline CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci.yml`) exécute 3 jobs en parallèle :

```
┌─ backend-tests ─────────────────────────────────┐
│ PHP 8.2 · PostgreSQL · composer install         │
│ php artisan migrate · php artisan test --parallel│
└─────────────────────────────────────────────────┘
┌─ frontend-build ─────────────────────────────────┐
│ Node 20 · npm ci · npm run build · npm run lint  │
└─────────────────────────────────────────────────┘
┌─ deploy-staging ────────────────────────────────┐
│ AWS af-south-1 · Docker Compose · SSH deploy    │
│ (déclenché sur push branch develop)             │
└─────────────────────────────────────────────────┘
```

---

## 9. Structure du projet

```
DIGITRANS-CM/
├── docs/                                  # Documentation
│   ├── api/openapi.yaml                   # Spécification OpenAPI 3.0 (38 endpoints)
│   ├── guide-utilisateur/                 # Guide pour les équipes SavoirManger
│   ├── plan-projet/                       # WBS, Gantt, risques, jalons
│   ├── rapport-collectif/                 # Sections du rapport d'épreuve
│   ├── sprint-logs/                       # Journal des 10 sprints
│   └── soutenance/                        # Préparation orale individuelle
│
├── src/
│   ├── backend/                           # Laravel 13 API
│   │   ├── app/
│   │   │   ├── Http/Controllers/Api/V1/  # 8 contrôleurs REST
│   │   │   └── Models/                    # 14 modèles Eloquent (UUID)
│   │   ├── database/
│   │   │   ├── migrations/               # 18 migrations
│   │   │   ├── factories/                # 5 factories
│   │   │   └── seeders/                  # Seeder principal
│   │   ├── routes/api.php                # 38 routes API
│   │   ├── tests/Feature/Api/            # 8 tests PHPUnit
│   │   ├── Dockerfile                    # Image PHP-FPM + Nginx
│   │   └── docker/                       # Config Nginx + Supervisor
│   │
│   ├── frontend/                         # React 18 PWA
│   │   ├── src/
│   │   │   ├── pages/                    # 7 pages (Dashboard, Clients, etc.)
│   │   │   ├── components/               # Layout, DataTable, StatCard
│   │   │   ├── services/api.js           # Client Axios (12 groupes d'endpoints)
│   │   │   ├── store/                    # Zustand (auth, dashboard, UI)
│   │   │   ├── hooks/useApi.js           # 10 hooks React Query
│   │   │   └── context/AuthContext.jsx   # Contexte d'authentification
│   │   ├── tests/                        # Tests Vitest
│   │   ├── Dockerfile                    # Build multi-stage + Nginx
│   │   └── vite.config.js                # Vite + Tailwind + PWA Workbox
│   │
│   └── database/schema.sql               # Schéma SQL complet
│
├── docker-compose.yml                    # 5 services (backend, frontend, db, cache, ...)
└── .github/workflows/ci.yml              # Pipeline CI/CD 3 stages
```

---

## 10. API — Aperçu des endpoints

| Groupe | Routes | Auth |
|--------|--------|------|
| Auth | `POST /api/auth/login`, `POST /api/auth/logout` | Public / Sanctum |
| Clients | `GET/POST /api/v1/clients`, `GET/PUT/DELETE /api/v1/clients/{id}`, `GET /api/v1/clients/statistiques` | Sanctum |
| Commandes | `GET/POST /api/v1/commandes`, `PATCH /api/v1/commandes/{id}/statut` | Sanctum |
| Plats | `CRUD /api/v1/plats` | Sanctum |
| Catégories | `CRUD /api/v1/categories` | Sanctum |
| Fidélité | `GET /api/v1/fidelite/clients/{id}/points`, `POST /api/v1/fidelite/points/ajouter`, `GET /api/v1/fidelite/recompenses`, `POST /api/v1/fidelite/echanger` | Sanctum |
| Avis | `CRUD /api/v1/avis`, `GET /api/v1/avis/analyse` | Sanctum |
| Dashboard | `GET /api/v1/dashboard/kpi`, `GET /api/v1/dashboard/evolution`, `GET /api/v1/dashboard/restaurants`, `GET /api/v1/dashboard/top-clients` | Sanctum |
| Sync | `POST /api/v1/sync`, `GET /api/v1/sync/pending` | Sanctum |
| Health | `GET /api/health` | Public |

Documentation complète : `docs/api/openapi.yaml`

---

## 11. Équipe et contacts

| Rôle | Nom | Responsabilités |
|------|-----|-----------------|
| **Chef de projet / Développeur** | **Samen Djiaha Migouel Steeve** | Planification, suivi budgétaire, KPI, CI/CD, Dashboard API |
| Développeuse full-stack | Youessah Lele Audrey | API Clients, API Fidélité, tests backend, UI commandes |
| Développeur full-stack | Kwitat Noutat Carmel | Architecture, API Commandes, API Avis, déploiement AWS, UI clients |

**Support :** support@camtech.cm · +237 691 234 567

---

*Projet DIGITRANS-CM — Module CRM SavoirManger*  
*CAMTECH SOLUTIONS S.A. pour AGROCAM S.A.*  
*Certification RNCP39765 — Expert en Architecture et Développement Web*
