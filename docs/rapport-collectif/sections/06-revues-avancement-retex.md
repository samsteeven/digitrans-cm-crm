# 6. Revues d'Avancement et Retour d'Expérience

- **Responsable :** Samen Djiaha Migouel Steeve
- **Période couverte :** Janvier 2026 — Novembre 2026
- **Livrables :** 2 Comptes rendus de revue + RETEX final

---

## 6.1 Revue d'Avancement n°1 — 15 Juillet 2026

### Participants

| Rôle | Nom |
|------|-----|
| Chef de projet | Samen Djiaha Migouel Steeve |
| Développeuse | Youessah Lele Audrey |
| Développeur | Kwitat Noutat Carmel |
| Client (AGROCAM) | Représentant DG (invité) |

### Période couverte

Sprints 1 à 5 (05 Janvier → 15 Mars 2026) — **Jalons J0, J1 atteints, J2 en cours**

### Bilan des livrables

| Lot | Livrable | Statut | Commentaire |
|-----|----------|--------|-------------|
| A Gestion de projet | Plan de projet, WBS, Gantt, risques | ✅ Livré | Validé par AGROCAM |
| B Analyse & Conception | Spécifications fonctionnelles | ✅ Livré | Document signé J1 |
| B Analyse & Conception | Architecture technique | ✅ Livré | Offline-first validé |
| B Analyse & Conception | Modélisation BDD (MCD/MLD) | ✅ Livré | PostgreSQL retenu |
| B Analyse & Conception | Maquettes UI (Figma) | ✅ Livré | 3 maquettes clients |
| B Analyse & Conception | Spécification OpenAPI | ✅ Livré | 12 endpoints |
| C Développement Backend | Setup Laravel + BDD | ✅ Livré | Docker + CI |
| C Développement Backend | API CRUD Clients | ✅ Livré | Tests OK |
| C Développement Backend | API CRUD Commandes | ✅ Livré | Pagination curseur |
| C Développement Backend | API Fidélité | ✅ Livré | Points + récompenses |
| D Développement Frontend | Setup React + Vite + Tailwind | ✅ Livré | Routing, Axios |
| D Développement Frontend | UI Liste clients | ✅ Livré | Tableau responsive |
| F Documentation | Sprint logs S1-S5 | ✅ Livré | 5 sprints tracés |

### Indicateurs clés

| Indicateur | Valeur | Commentaire |
|------------|--------|-------------|
| SP engagés | 102 SP | Sprints 1-5 cumulés |
| SP livrés | 96 SP | 94% de taux de livraison |
| Vélocité moyenne | 19,2 SP/sprint | Stable, prévisible |
| Tests backend | 8 tests PHPUnit | Couverture baseline |
| Tests frontend | 0 test | À démarrer |
| Budget consommé | 38% | Dans les clous |

### Incidents majeurs

| ID | Incident | Impact | Résolution |
|----|----------|--------|-----------|
| INC-01 | Coupure électrique 8h le 08/02 | Sprint 3 livré à 82% | Télétravail, réallocation S4 |
| INC-02 | Latence réseau 320ms Douala→AWS | Délai de réponse API | Cache Redis planifié S5 |
| INC-03 | Authentification Sanctum incomplète | US-012 partiel | Finalisé en S4 |
| INC-04 | Tests de charge K6 non faits | US-024 reporté | Repris en S8 |

### Actions décidées

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Démarrer les tests Vitest frontend | Carmel | Sprint 6 |
| Finaliser toutes les US backend | Audrey | Sprint 7 (J2) |
| Préparer la démo client J2 (MVP) | Toute l'équipe | Sprint 7 |
| Planifier les tests de charge K6 | Samen | Sprint 8 |

---

## 6.2 Revue d'Avancement n°2 — 15 Août 2026

### Participants

| Rôle | Nom |
|------|-----|
| Chef de projet | Samen Djiaha Migouel Steeve |
| Développeuse | Youessah Lele Audrey |
| Développeur | Kwitat Noutat Carmel |

### Période couverte

Sprints 6 à 9 (16 Mars → 10 Mai 2026) — **Jalon J2 atteint, J3 en cours**

### Bilan des livrables

| Lot | Livrable | Statut | Commentaire |
|-----|----------|--------|-------------|
| C Développement Backend | API Avis satisfaction | ✅ Livré | CRUD + notation |
| C Développement Backend | Dashboard KPI | ✅ Livré | 4 endpoints |
| C Développement Backend | Sync offline-first | ✅ Livré | Synchronisation |
| D Développement Frontend | Dashboard KPI UI | ✅ Livré | 3 graphiques Recharts |
| D Développement Frontend | UI Commandes | ✅ Livré | Filtres, statuts |
| D Développement Frontend | UI Fidélité | ✅ Livré | Points + rewards |
| D Développement Frontend | UI Avis | ✅ Livré | Notation étoiles |
| E Intégration & Tests | Pipeline CI/CD | ✅ Livré | GitHub Actions |
| E Intégration & Tests | Cache Redis | ✅ Livré | TTL 1h/15min/30min |
| F Documentation | Swagger/OpenAPI | ✅ Livré | 15 endpoints |
| F Documentation | Guide utilisateur | ⚠️ Partiel | Finalisation S10 |
| **J2** | **MVP CRM livré** | ✅ **Atteint** | **Démo AGROCAM positive** |

### Indicateurs clés

| Indicateur | Revue n°1 (S5) | Revue n°2 (S9) | Évolution |
|------------|---------------|---------------|-----------|
| SP livrés cumulés | 96 SP | 176 SP | +80 SP |
| Vélocité moyenne | 19,2 SP/sprint | 19,6 SP/sprint | ↗️ +2% |
| Taux de livraison global | 94% | 96% | ↗️ |
| Tests backend | 8 tests | 8 tests | ⚠️ Stagnant |
| Tests frontend | 0 test | 12 tests | ↗️ Démarré |
| Couverture offline-first | 0% | 65% | ↗️ En cours |
| Performance API | 320ms | 145ms | ↗️ -55% |
| Bugs ouverts | 0 | 2 | ⚠️ À traiter |

### Incidents majeurs

| ID | Incident | Impact | Résolution |
|----|----------|--------|-----------|
| INC-05 | Service Worker complexe (+3j) | Sprint 9 tendu | Absorbé par l'équipe |
| INC-06 | Tests de charge K6 non faits S6 | Pas de métriques perf | Fait en S8 (1000 req/s OK) |
| INC-07 | Guide utilisateur non finalisé | US-040 partiel | Reporté S10 |
| INC-08 | Cache invalidation non implémentée | Données périmées | Event-driven livré S8 |

### Actions décidées

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Finaliser le guide utilisateur | Audrey | Sprint 10 |
| Dashboard KPI avancé (charts) | Samen | Sprint 10 |
| Monitoring Prometheus/Grafana | Samen | Sprint 10 |
| Tests UAT phase 2 | Toute l'équipe | Sprint 10 |
| Préparer la recette J3 | Samen | 15 Août |
| Corriger les 2 bugs ouverts | Carmel | Sprint 10 |

---

## 6.3 RETEX Final — 30 Novembre 2026

### 6.3.1 Faits marquants

#### Ce qui a bien fonctionné

| Point | Pourquoi |
|-------|----------|
| **Choix technique Laravel 13 + React 18** | Stack maîtrisée par l'équipe, productivité immédiate |
| **Architecture offline-first** | Validée par les tests terrain : 65% de couverture offline, objectif 70% pas encore atteint mais direction bonne |
| **Approche hybride Agile/Forfait** | Les sprints ont permis d'absorber les aléas (coupures, latence) sans déraper sur les jalons |
| **Docker + CI/CD dès le départ** | Déploiements reproductibles, pas de surprise "ça marche en dev mais pas en prod" |
| **Communication asynchrone (WhatsApp)** | A bien fonctionné malgré les coupures réseau et les emplois du temps décalés |
| **Utilisation de GitHub Projects** | La traçabilité des tâches et la visibilité pour le client ont été appréciées |
| **Cache Redis à 3 niveaux** | Dashboard 1h, listes 15min, plats 30min — bon équilibre fraîcheur/performance |

#### Ce qui a moins bien fonctionné

| Point | Cause | Leçon apprise |
|-------|-------|---------------|
| **Tests backend insuffisants** (8 tests seulement) | Focus sur la fonctionnalité au détriment de la qualité | Écrire les tests en même temps que le code, pas après |
| **Tests de charge non faits en S6** | Sous-estimation de la complexité | Prioriser le non-fonctionnel dès le début |
| **Guide utilisateur non finalisé au J2** | Estimé trop optimiste (3 SP) | Prévoir une marge sur les livrables documentation |
| **Authentification Sanctum livrée partiellement en S3** | Manque de familiarité avec Sanctum | Formation ciblée avant le sprint |
| **Pas de revue de code systématique** | Détection tardive de certains bugs | Instaurer les PR obligatoires dès le S1 |
| **Workbox + IndexedDB sous-exploités** (offline à 65%) | Complexité technique sous-estimée | Allouer un sprint dédié à l'offline |

### 6.3.2 Chiffres clés du projet

| Indicateur | Valeur |
|------------|--------|
| Budget total | 96 000 000 FCFA |
| Budget consommé | 91 200 000 FCFA (-4,8M, 5% d'économies) |
| JH prévus | 152 JH (WBS initiale) |
| JH réalisés | 120 JH (79% de la prévision) |
| Sprints réalisés | 10 sprints sur 12 prévus |
| SP engagés totaux | 203 SP |
| SP livrés totaux | 194 SP (95,6% de taux de livraison) |
| Commits | 33 commits |
| Auteurs | 3 (Samen 23, Audrey 11, Carmel 10) |
| Tests backend | 8 tests PHPUnit |
| Tests frontend | 37 tests Vitest (6 suites) |
| Endpoints API | 38 endpoints REST |
| Pages frontend | 7 pages React |
| Composants | 3 composants réutilisables |
| Performance API | 145ms (vs 320ms avant optimisation) |
| Couverture offline-first | 65% (objectif 70%) |
| Bugs critiques en production | 0 |

### 6.3.3 Satisfaction client (AGROCAM S.A.)

| Critère | Note (/5) | Commentaire |
|---------|-----------|-------------|
| Qualité du livrable | 4/5 | "Le CRM répond à nos besoins opérationnels" |
| Respect des délais | 5/5 | "Tous les jalons ont été tenus" |
| Respect du budget | 5/5 | "En dessous du budget prévu" |
| Communication équipe | 4/5 | "Reporting clair et régulier" |
| Prise en main (UX) | 3/5 | "Quelques améliorations UI demandées" |
| **Moyenne générale** | **4,2/5** | |

### 6.3.4 Axes d'amélioration

| Priorité | Action | Justification |
|----------|--------|---------------|
| **🔴 P1** | Atteindre 70% de couverture offline | Objectif contractuel pas encore atteint |
| **🔴 P1** | Écrire les tests avant/pendant le code | Réduire les bugs, faciliter le refactoring |
| **🟡 P2** | Automatiser les tests de charge (K6) | Détecter les régressions de performance |
| **🟡 P2** | Mettre en place les review de code obligatoires | Détecter les problèmes plus tôt |
| **🟡 P2** | Améliorer l'UI/UX mobile | Note client à 3/5 sur l'expérience utilisateur |
| **🟢 P3** | Ajouter un tableau de bord monitoring proactif | Prometheus + alerting configuré mais pas encore utilisé |
| **🟢 P3** | Documenter les procédures de déploiement | Éviter les dépendances humaines |

### 6.3.5 Recommandations pour le passage en production

1. **Renforcer l'équipe support** pendant le premier mois de production (hotline dédiée)
2. **Planifier une formation utilisateur** d'au moins 2 jours dans les 3 restaurants pilotes
3. **Mettre en place des alertes automatisées** (Prometheus) pour détecter les anomalies avant les utilisateurs
4. **Réaliser un audit de sécurité** avant la généralisation aux 12 restaurants
5. **Prévoir un sprint de stabilisation** (S11) après la mise en production pour corriger les remontées terrain

---

## 6.4 Synthèse des enseignements

```
                    FORCES                              FAIBLESSES
    ┌─────────────────────────────┐    ┌─────────────────────────────┐
    │ ✓ Jalons J0-J5 tous tenus   │    │ ✗ Tests backend insuffisants│
    │ ✓ Budget sous-consommé      │    │ ✗ Offline-first à 65%      │
    │ ✓ Stack technique moderne   │    │ ✗ Guide utilisateur tardif  │
    │ ✓ CI/CD automatisé          │    │ ✗ Revue de code absente    │
    │ ✓ Communication asynchrone  │    │ ✗ Tests de charge reportés │
    └─────────────────────────────┘    └─────────────────────────────┘

                    OPPORTUNITÉS                        MENACES
    ┌─────────────────────────────┐    ┌─────────────────────────────┐
    │ ✓ Adoption par AGROCAM     │    │ ✗ Résistance au changement  │
    │ ✓ Mutualisation avec BI    │    │ ✗ Turnover équipe technique │
    │ ✓ 5% budget non consommé   │    │ ✗ Coupures électriques      │
    │ ✓ Extension 12 restaurants │    │ ✗ Concurrence solutions ERP │
    └─────────────────────────────┘    └─────────────────────────────┘
```

---

*Document rédigé par Samen Djiaha Migouel Steeve, Chef de Projet DIGITRANS-CM*
*Certification RNCP39765 — BC02 Manager les Projets Numériques*
*Session 2026 — CAMTECH SOLUTIONS S.A.*
