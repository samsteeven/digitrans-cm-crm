# Section I.6 — Revues d'Avancement et RETEX

---

## Compte rendu — Revue d'Avancement n°1

**Date :** 15 Juillet 2026 (Sprint 4)
**Lieu :** Google Meet
**Durée :** 1h00
**Participants :** Samen (Chef de projet), Audrey (Développeuse), Carmel (Développeur)
**Objet :** Point d'étape à mi-parcours du développement backend

### Ordre du jour

1. Bilan des sprints 1 à 4 : réalisations vs objectifs
2. Statut des risques et incidents
3. Ajustement du planning pour les sprints 5-8
4. Préparation du Jalon J2 (MVP CRM — 15 Août)
5. Questions diverses

### Points abordés

**1. Bilan des sprints 1-4**

| Sprint | SP engagés | SP livrés | Vélocité | Commentaire |
|--------|-----------|-----------|----------|-------------|
| S1 | 18 | 16 | 16 SP | Retard léger (analyse métier legacy) |
| S2 | 20 | 20 | 20 SP | Objectif atteint |
| S3 | 22 | 18 | 18 SP | Coupure électrique + latence Docker |
| S4 | 20 | 20 | 20 SP | Rattrapage réussi |
| **Total** | **80** | **74** | **18,5 SP/sprint** | **92,5% de livraison** |

**2. Risques identifiés**

| Risque | Statut | Action |
|--------|--------|--------|
| R01 — Coupures électriques | ⚠️ Actif (3 incidents) | UPS installé, télétravail systématique |
| R02 — Connectivité | ✅ Mitigé | Registry Docker local opérationnel |
| R05 — Latence cloud | ⚠️ Latence constatée (320ms) | Optimisation à planifier en S5-S6 |
| R07 — Dérive budgétaire | ✅ Sous contrôle | CRM à -4,8M FCFA |

**3. Ajustements décidés**

- Réaffectation de Carmel sur les optimisations de performance (latence) pour 3 jours
- Ajout d'une tâche de cache Redis dans le sprint 5
- Mise en place de tests de charge (K6) en sprint 6

### Décisions prises

| Décision | Justification | Responsable |
|----------|--------------|-------------|
| Prioriser le cache Redis avant le déploiement staging | La latence 320ms est inacceptable pour le dashboard | Carmel |
| Décaler l'UI Avis (D.5) en sprint 7 | Les APIs Avis sont moins critiques que les KPI | Samen |
| Ajouter des tests de charge K6 | Nécessaire pour valider les perf AWS Afrique du Sud | Samen |

### Actions à mener

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Mettre en place Redis ElastiCache | Carmel | 22/07 (S5) |
| Optimiser les requêtes N+1 de l'API Clients | Audrey | 22/07 (S5) |
| Configurer CloudFront pour les assets statiques | Samen | 29/07 (S6) |
| Préparer la démo J2 (MVP) | Toute l'équipe | 12/08 (S7) |

### Prochaine revue

**Date :** 15 Août 2026 (Sprint 7) — Revue pré-Jalon J2

---

## Compte rendu — Revue d'Avancement n°2

**Date :** 15 Août 2026 (Sprint 7)
**Lieu :** Google Meet
**Durée :** 1h30
**Participants :** Samen, Audrey, Carmel
**Objet :** Revue de préparation au Jalon J2 (MVP CRM)

### Ordre du jour

1. Vérification des livrables pour le Jalon J2
2. Bilan des sprints 5-6-7
3. Statut des actions correctives décidées en revue n°1
4. Points bloquants pour la version complète (Jalon J3)
5. Organisation des tests UAT

### Points abordés

**1. Livrables Jalon J2 (MVP CRM)**

| Livrable | Statut | Commentaire |
|----------|--------|-------------|
| API Gestion des clients (CRUD) | ✅ Livré | Tests unitaires OK (85% coverage) |
| API Gestion des commandes | ✅ Livré | 100% endpoints documentés Swagger |
| UI Gestion des clients | ✅ Livré | Responsive, validé par le designer |
| UI Commandes (basique) | ✅ Livré | Mode offline en cours de finalisation |
| Déploiement staging AWS | ✅ Livré | URL de démo transmise à AGROCAM |

**2. Bilan des actions de la revue n°1**

| Action | Statut | Résultat |
|--------|--------|----------|
| Redis ElastiCache | ✅ Fait | Latence réduite de 320ms à 145ms |
| Optimisation N+1 | ✅ Fait | Requêtes BDD réduites de 83% |
| CloudFront assets | ✅ Fait | TTL 7 jours, load time 1,1s |
| Tests de charge K6 | 🔴 Pas commencé | Reporté en sprint 8 (manque de temps) |

**3. Risques pour le Jalon J3 (15 Octobre)**

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Tests de charge non réalisés | ⚠️ Modéré | Planifiés en sprint 8 (priorité haute) |
| Offline-first en retard | 🔴 Élevé | Carmel + Samen dédiés à la synchronisation en sprint 8 |
| Vélocité insuffisante (19,2 SP/sprint) | ⚠️ Modéré | Ré-estimation des US + réduction WIP |
| Formation utilisateurs non préparée | ✅ Faible | Support utilisateur planifié en sprint 10 |

### Décisions prises

| Décision | Justification | Responsable |
|----------|--------------|-------------|
| Ajouter 1 sprint buffer (S9 bis) pour l'offline-first | Le mode hors-ligne est une exigence forte d'AGROCAM | Samen |
| Ré-estimer toutes les US restantes en points plus fins | La sous-estimation initiale fausse la vélocité | Toute l'équipe |
| Démarrer la documentation utilisateur en parallèle | Ne pas attendre la fin du développement | Audrey |

### Actions à mener

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Réaliser les tests de charge K6 | Samen | 22/08 (S8) |
| Finaliser la synchronisation offline (Service Workers) | Carmel | 05/09 (S9) |
| Ré-estimer le backlog restant | Toute l'équipe | 18/08 |
| Préparer le support de démo pour AGROCAM | Toute l'équipe | 12/08 |

### Prochaine revue

**Date :** 15 Septembre 2026 (Sprint 10) — Point d'étape pré-Jalon J3

---

## Session RETEX — Retour d'Expérience Final

**Date :** 30 Novembre 2026 (Post-Jalon J5)
**Lieu :** Google Meet
**Durée :** 2h00
**Participants :** Samen, Audrey, Carmel
**Objet :** Retour d'expérience sur l'ensemble du projet DIGITRANS-CM — Module CRM

### 1. Bonnes pratiques acquises

| Pratique | Description | Impact |
|----------|-------------|--------|
| **Revue de code systématique** | Chaque merge request nécessite 1 approbation | Bugs bloquants réduits à 2/sprint (cible : ≤ 3) |
| **Pair-programming** | Sessions de 2h sur les sujets complexes (offline-first, cache Redis) | Montée en compétence rapide des juniors |
| **Daily stand-up Slack** | Mise à jour quotidienne asynchrone (adapté aux contraintes de connexion) | Visibilité permanente sur l'avancement |
| **Documentation en continu** | Doc API générée automatiquement (Swagger/OpenAPI) + ADR | Facilité d'intégration pour les nouveaux membres |
| **Architecture modulaire** | Séparation stricte Backend/Frontend avec API contractuelle | Tests et déploiement indépendants |

### 2. Axes d'amélioration pour les prochains projets

| Axe | Problème constaté | Suggestion |
|-----|-------------------|------------|
| **Estimation des charges** | Sous-estimation de 36% sur la vélocité (19,2 SP vs 30 SP cible) | Utiliser la méthode Planning Poker avec référence historique ; pré-buffer de 20% |
| **Tests de charge** | Tests de charge K6 reportés puis abandonnés | Intégrer les tests de charge dans la Definition of Done (DoD) dès le sprint 1 |
| **Offline-first** | Complexité sous-estimée (65% vs 70% cible) | Dédier un sprint complet à l'offline-first en début de projet |
| **Formation en amont** | Courbe d'apprentissage Laravel a ralenti les sprints 1-3 | Organiser un bootcamp technique de 1 semaine avant le kickoff |
| **Gestion des dépendances cloud** | Dépendance à AWS Afrique du Sud pour des services simples | Dockeriser au maximum pour permettre le développement hors-ligne complet |

### 3. Enseignements en termes de qualité de code

#### Réduction des bugs

| Métrique | Sprints 1-4 | Sprints 5-8 | Sprints 9-12 | Évolution |
|----------|-------------|-------------|--------------|-----------|
| Bugs critiques par sprint | 4 | 2 | 1 | **-75%** |
| Bugs mineurs par sprint | 8 | 5 | 3 | **-62%** |
| Temps de résolution moyen | 2,5 jours | 1,2 jours | 0,8 jour | **-68%** |

#### Amélioration de la structure du code

- **Avant projet** : Code monolithique, pas de séparation des responsabilités
- **Après projet** : Architecture en couches (Repository Pattern, Service Layer, Form Requests)
- **Duplications** : 3 duplications majeures identifiées via PHPStan → refactorisées en traits réutilisables

#### Suppression des duplications

| Fichier / Classe | Duplication | Action | Résultat |
|------------------|-------------|--------|----------|
| `app/Http/Controllers/Api/*` | Validation identique dans 3 contrôleurs | Création de `FormRequest` dédiés | -40% de code |
| `app/Models/*` | Relation `customer()` dupliquée | Ajout d'un trait `HasCustomer` | -15% de code |
| `resources/js/components/*` | Composant `Tableau` dupliqué | Création d'un composant générique `<DataTable />` | -25% de code |

### 4. Chiffres clés du projet

| Métrique | Valeur |
|----------|--------|
| JH consommés totaux | 112 JH (vs 120 prévus) |
| Sprints exécutés | 12 sprints |
| Story points livrés | 142 SP (vs 150 planifiés, 94,7%) |
| Commits Git | 287 commits |
| Fichiers modifiés | 168 fichiers |
| Tests unitaires | 342 tests (72% coverage) |
| Revue de code | 48 merge requests approuvées |
| Bugs en production | 0 (zéro bug bloquant) |

### 5. Conclusion de l'équipe

Le projet DIGITRANS-CM — Module CRM a été une expérience formatrice complète pour l'équipe. Malgré les défis propres au contexte camerounais (coupures électriques, connectivité instable, latence réseau), l'équipe a livré un module CRM fonctionnel, résilient et adapté aux besoins des restaurants SavoirManger.

Les principaux enseignements sont :
- L'investissement dans la montée en compétence en début de projet (pair-programming, tutoriels) paie à long terme
- L'architecture offline-first est indispensable mais doit être planifiée dès le sprint 1
- La communication régulière (daily stand-up, Slack) est cruciale dans un contexte de télétravail contraint
- La documentation continue et les revues de code systématiques garantissent la qualité du livrable

**L'équipe se félicite d'avoir livré un produit de qualité, dans les contraintes budgétaires allouées, et prêt pour le passage à l'échelle sur les 12 restaurants SavoirManger.**
