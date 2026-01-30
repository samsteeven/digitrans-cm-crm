# Section I.4 — Tableau de Bord de Pilotage DIGITRANS-CM

## A. Budget du module CRM

### Budget général du projet DIGITRANS-CM

| Module | Budget (FCFA) | Dépensé | Écart | Pourquoi ? |
|--------|--------------|---------|-------|------------|
| ERP | 132 000 000 | 138 500 000 | + 6 500 000 | Intégration douane Port Douala plus complexe |
| **CRM** | **96 000 000** | **91 200 000** | **- 4 800 000** | **Optimisé (outils gratuits, cloud mutualisé)** |
| Supply Chain | 120 000 000 | 127 800 000 | + 7 800 000 | Legacy 2009 difficile à adapter |
| BI (décisionnel) | 132 000 000 | 124 500 000 | - 7 500 000 | Mutualisation cloud avec CRM |
| **TOTAL** | **480 000 000** | **482 000 000** | **+ 2 000 000** | **Dépassement 0,42% → acceptable** |

### Détail du budget CRM — D'où vient l'argent et où va-t-il ?

#### Ce qu'on avait prévu (96 000 000 FCFA)

| Poste | Montant | Ça sert à quoi ? |
|-------|---------|-----------------|
| **Salaires** (152 jours × 3 personnes) | 38 000 000 | Payer Samen, Audrey et Carmel pendant 6 mois |
| **Hébergement cloud** (AWS Afrique du Sud) | 18 000 000 | Serveurs pour faire tourner l'appli |
| **Licences logicielles** | 8 000 000 | Jira, GitHub, Figma, etc. |
| **Formation des équipes AGROCAM** | 12 000 000 | Apprendre au personnel à utiliser le CRM |
| **Frais CAMTECH** | 10 400 000 | Électricité, internet, local, comptabilité |
| **Réserve pour imprévus (10%)** | 9 600 000 | "Matelas" si quelque chose coûte plus cher |
| **TOTAL** | **96 000 000** | |

#### Ce qu'on a réellement dépensé (91 200 000 FCFA)

| Poste | Prévu | Dépensé | Économie | Explication simple |
|-------|-------|---------|----------|-------------------|
| Salaires | 38 000 000 | 36 000 000 | **-2 000 000** | Back-end livré plus vite que prévu (moins de JH) |
| Hébergement cloud | 18 000 000 | 15 000 000 | **-3 000 000** | Mutualisé avec le module BI → facture divisée |
| Licences | 8 000 000 | 0 | **-8 000 000** | GitHub, Jira, Figma, Slack = **gratuits** pour petite équipe |
| Formation | 12 000 000 | 10 000 000 | **-2 000 000** | 2 formations en visio au lieu de déplacement |
| Frais CAMTECH | 10 400 000 | 10 000 000 | **-400 000** | Télétravail → économie d'électricité/location |
| Réserve imprévus | 9 600 000 | 0 | **-9 600 000** | **Pas touchée** → disponible si besoin |
| **Opérationnel** | **86 400 000** | **71 000 000** | **-15 400 000** | |
| **TOTAL BUDGET** | **96 000 000** | **91 200 000** | **-4 800 000** | **5% d'économies** |

> **Note :** Le total "dépensé" (91,2M) = dépenses opérationnelles (71M) + réserve non consommée (9,6M) retirée + 10,6M réaffectés. En réalité, les 9,6M de réserve n'ont pas été utilisés et les 10,6M d'économies supplémentaires ont été réalloués au projet global pour couvrir les dépassements ERP et Supply Chain.

### En résumé (à retenir pour la soutenance)

On nous a confié **96 000 000 FCFA**. On a dépensé **91 200 000 FCFA**. Il reste **4 800 000 FCFA** d'économies.

**Pourquoi on a économisé ?**
1. **Licences gratuites** (GitHub, Jira, Figma) → -8M
2. **Cloud mutualisé** avec l'équipe BI → -3M
3. **Formations en visio** plutôt que déplacement → -2M
4. **Back-end efficace** (moins de JH que prévu) → -2M

**Où va l'économie ?** On la garde comme réserve pour la suite du projet (sprints 8-10) et pour couvrir les dépassements des autres modules.

---

## B. Suivi des charges en jours-homme — Module CRM

---

## C. Indicateurs Clés de Performance (KPI)

### Sélection des 5 KPI du module CRM

| # | KPI | Cible | Réalisé (S1-10) | Statut | Analyse |
|---|-----|-------|-----------------|--------|---------|
| K1 | Taux de couverture des tests | ≥ 80% | **72%** | ⚠️ Sous-cible | 72% actuellement. Inférieur à la cible de 80% car les tests frontend sont en retard (complexité des composants offline-first). |
| K2 | Bugs critiques en revue de code | ≤ 3/sprint | **2/sprint** | ✅ Conforme | Bonne qualité du code. Les revues systématiques et le pair-programming portent leurs fruits. |
| K3 | Temps de déploiement pipeline CI/CD | ≤ 15 min | **12 min** | ✅ Conforme | Pipeline optimisé : build Laravel (4 min) + tests (5 min) + deploy staging (3 min) = 12 min. |
| K4 | Disponibilité en mode dégradé (offline-first) | ≥ 70% | **65%** | ⚠️ Sous-cible | 65% des fonctionnalités disponibles hors-ligne. Objectif 70% non atteint : les commandes en temps réel nécessitent encore une connexion. |
| K5 | Vélocité de l'équipe (story points/sprint) | ≥ 30 SP | **19,2 SP** | 🔴 Sous-cible | Moyenne de 19,2 SP/sprint sur les 5 premiers sprints (vs 30 SP cible). Sous-estimation initiale de la complexité. |

### Analyse détaillée des écarts KPI

#### K1 — Taux de couverture des tests
- **Écart :** 72% réalisé vs 80% cible (-8 points)
- **Cause racine :** Tests frontend incomplets (complexité des composants offline-first avec Service Workers)
- **Action corrective :** Sprint dédié aux tests frontend en S11 ; adoption de Vitest + React Testing Library
- **Impact sur le jalon J3 (15 Août) :** Risque modéré — la recette UAT est décalée d'une semaine

#### K4 — Disponibilité en mode dégradé
- **Écart :** 65% réalisé vs 70% cible (-5 points)
- **Cause racine :** Les commandes temps réel (statut cuisson, disponibilité des plats) dépendent d'une API en ligne
- **Action corrective :** Implémentation de cache local avec synchronisation différée (Queue Laravel + Redis), optimisation des stratégies de cache
- **Impact sur le jalon J4 (15 Octobre) :** Nécessite une validation terrain supplémentaire dans les zones rurales

#### K5 — Vélocité de l'équipe
- **Écart :** 19,2 SP/sprint vs 30 SP cible (-36%)
- **Cause racine :** Sous-estimation de la complexité des user stories (notamment offline-first et intégration cloud) + courbe d'apprentissage Laravel
- **Action corrective :** Ré-estimation des user stories restantes (replanification) ; focus sur la réduction du WIP (Work In Progress) à 2 tâches par personne
- **Impact sur le jalon J3 (15 Août) :** Risque élevé — nécessite une accélération sur les sprints 7-8

---

## D. Actions correctives — Synthèse

| KPI concerné | Action corrective | Responsable | Échéance | Impact attendu |
|-------------|-------------------|-------------|----------|----------------|
| K1 (Tests) | Sprint tests dédié + adoption Vitest | Audrey | S11 | 80% couverture |
| K4 (Offline) | Cache local + synchronisation différée | Carmel | S11-S12 | ≥ 70% disponibilité |
| K5 (Vélocité) | Ré-estimation des US + réduction WIP | Samen | S8 | ≥ 25 SP/sprint |
| Budget CRM | Maintien de la sous-consommation actuelle | Samen | Continu | -4,8M FCFA maintenu |

---

## E. Projection et recommandations

### Scénario tendanciel (si aucune action corrective)

```
Vélocité actuelle : 19,2 SP/sprint
Story points restants : 54 SP (150 totaux - 96 réalisés)
Sprints nécessaires au rythme actuel : 54 / 19,2 ≈ 3 sprints (6 semaines)
Fin prévue du développement : Mi-Septembre 2026
Date jalon J3 (version complète) : 15 Août 2026
Risque de non-respect du jalon : ÉLEVÉ
```

### Scénario avec actions correctives

```
Vélocité cible après correction : 25 SP/sprint
Story points restants : 54 SP
Sprints nécessaires : 54 / 25 ≈ 2,2 sprints (5 semaines)
Fin prévue du développement : Fin Août 2026
Date jalon J3 : 15 Août 2026 → Négociation d'un report de 2 semaines avec AGROCAM
Risque de non-respect du jalon : MODÉRÉ (sous réserve d'acceptation du client)
```

### Recommandation à la direction

En tant que Chef de Projet, je recommande :

1. **Négocier un ajustement du jalon J3** avec AGROCAM S.A. (report de 2 semaines, passage au 31 Août), en contrepartie d'une démonstration anticipée du module fidélité
2. **Réaffecter temporairement** un développeur du module BI (en sous-consommation) pour renforcer l'équipe CRM sur les sprints 8-9
3. **Investir dans un serveur local** CAMTECH à Douala pour réduire la dépendance au cloud (latence, coûts) pour les données non critiques
4. **Maintenir la sous-consommation budgétaire** du CRM (-4,8M FCFA) comme réserve de sécurité pour le projet global
