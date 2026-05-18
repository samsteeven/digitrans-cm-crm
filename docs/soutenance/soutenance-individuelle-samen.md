# Soutenance Individuelle — Samen Djiaha Migouel Steeve

## Axe 1 : Positionnement dans le projet

### Mon rôle : Chef de Projet et Développeur Full-Stack

En tant que **Chef de Projet** du module CRM SavoirManger, j'ai assumé les responsabilités suivantes :

**Gestion de projet :**
- Planification et organisation des 12 sprints (approche hybride Agile/Forfait)
- Suivi budgétaire : maintien d'une sous-consommation de -4,8M FCFA sur le module CRM
- Coordination des 3 membres de l'équipe face aux contraintes camerounaises (coupures électriques, latence réseau)
- Revue de code systématique (48 merge requests approuvées)
- Reporting et communication avec le client AGROCAM S.A.

**Développement :**
- API Dashboard KPI (évolution CA, top clients, statistiques restaurants)
- API Synchronisation offline-first (SyncController)
- Pipeline CI/CD (GitHub Actions) avec tests automatisés
- Monitoring Prometheus + Grafana

### Coordination avec l'équipe

- Mise en place du tableau Kanban Jira (6 colonnes, 3 épics)
- Organisation des cérémonies Agile : daily stand-up Slack, sprint planning, sprint review
- Sessions de pair-programming (optimisation cache Redis, tests K6)
- Documentation des décisions architecturales (ADR)

---

## Axe 2 : Contributions techniques personnelles

### 2.1 Dashboard KPI (Tableau de bord direction)

**Problème :** Les dirigeants d'AGROCAM avaient besoin d'une vue en temps réel des performances des 5 restaurants SavoirManger.

**Solution technique :**
- API REST `/api/v1/dashboard/kpi` avec mise en cache Redis (TTL 1h)
- Agrégation PostgreSQL avec vues matérialisées (`mv_kpi_quotidiens`)
- Frontend React avec graphiques Recharts (évolution CA, répartition commandes)
- Latence réduite de 320ms à 145ms après optimisation

**Code :** `app/Http/Controllers/Api/V1/DashboardController.php`

### 2.2 Synchronisation Offline-First

**Problème :** Les restaurants de Garoua et Ngaoundéré subissent des coupures réseau fréquentes. Le système doit fonctionner hors-ligne.

**Solution technique :**
- Service Worker avec stratégie Stale-While-Revalidate
- File d'attente locale (IndexedDB) pour les commandes hors-ligne
- Endpoint `/api/v1/sync` avec résolution de conflits (Last-Write-Wins)
- Table `sync_log` traçant chaque synchronisation

**Source anglaise utilisée :** MDN Web Docs — Service Worker API (https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### 2.3 Pipeline CI/CD

**Problème :** Déploiement manuel lent et risqué vers AWS Afrique du Sud.

**Solution :**
- GitHub Actions avec 3 jobs : tests backend, build frontend, déploiement staging
- Temps de déploiement : 12 minutes (objectif ≤ 15 min)
- Tests automatisés PHPUnit + Vitest

---

## Axe 3 : Bilan critique et projection

### Ce qui a bien fonctionné
- **Architecture offline-first** : 65% de fonctionnalités disponibles hors-ligne (en cours d'amélioration vers 70%)
- **Cache Redis** : réduction de la latence de 55%
- **Revue de code** : bugs bloquants réduits de 75% sur la durée du projet
- **Budget** : sous-consommation de -4,8M FCFA sur le module CRM

### Ce qui aurait pu être amélioré
- **Estimation des charges** : vélocité réelle de 19,2 SP/sprint vs 30 SP cible (-36%)
- **Tests de charge K6** : reportés puis partiellement réalisés (auraient dû être intégrés dès le sprint 1)
- **Formation Laravel** : 2 membres découvraient le framework (prévoir un bootcamp en amont)

### Projection professionnelle

Ce projet m'a permis de renforcer des compétences clés pour le marché camerounais :
- **Architecture résiliente** adaptée aux contraintes d'infrastructure locales
- **Gestion de projet hybride** conciliant Agile et engagement forfaitaire
- **Veille technologique** en anglais (documentation AWS, MDN, Redis)
- **Management d'équipe** dans un contexte de télétravail contraint

**Prochain objectif :** Approfondir mes compétences en cybersécurité (conformité loi n°2010/012) et en architecture cloud native (Kubernetes).

---

## Questions préparées pour le jury

### Q1 : Comment auriez-vous géré une réduction de budget de 30% ?
- Réduction du périmètre : priorisation des fonctionnalités core (clients, commandes) vs avancées (fidélité)
- Optimisation des coûts cloud : utilisation de réserved instances AWS (40% d'économie)
- Réduction des JH de documentation : documentation automatique vs manuelle
- Impact : décalage du Jalon J3 de 2 mois

### Q2 : Adaptations pour une zone sans Internet permanent ?
- Architecture offline-first maximale : PWA complète avec synchronisation SMS (API Twilio)
- Base de données locale (SQLite/IndexedDB) avec réplication différée
- Utilisation de WhatsApp Business API comme canal de commande alternatif
- Infrastructure edge computing (Cloudflare Workers) pour le traitement local

---

*Présentation : 15-20 minutes + 10-15 minutes de questions*
*Supports : Diaporama sobre + Démo en direct de l'application*
