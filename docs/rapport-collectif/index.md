# RAPPORT COLLECTIF — PROJET DIGITRANS-CM
## Module CRM SavoirManger

**Client :** AGROCAM S.A.
**Prestataire :** CAMTECH SOLUTIONS S.A.
**Période :** Janvier 2026 — Novembre 2026
**Budget module CRM :** 96 000 000 FCFA

---

## Équipe projet

| Rôle | Nom & Prénom(s) |
|------|-----------------|
| **Chef de projet / Développeur** | **Samen Djiaha Migouel Steeve** |
| Développeuse full-stack | Youessah Lele Audrey |
| Développeur full-stack | Kwitat Noutat Carmel |

---

## Table des matières

1. [Plan de Projet et Méthodologie (C10)](../plan-projet/01-plan-de-projet.md)
   - Choix méthodologique : Approche hybride Agile/Forfait
   - WBS détaillée (152 JH)
   - Diagramme de Gantt (12 sprints)
   - Analyse des risques (8 risques identifiés)
   - Plan de mitigation
   - Jalons contractuels (J0 à J5)

2. [Coordination d'Équipe et Outils Collaboratifs (C11)](sections/03-coordination-equipe.md)
   - Répartition des rôles et ajustements
   - Outils : Jira, Git, Slack, Notion
   - Sprint Log détaillé (Sprints 1 à 6)
   - Actions de montée en compétences (7 sessions)
   - Dynamique d'équipe et réflexivité

3. [Tableau de Bord de Pilotage (C12)](sections/04-tableau-de-bord-pilotage.md)
   - Contexte budgétaire global (+2M FCFA, +0,42%)
   - Suivi des charges JH (112 réalisés vs 120 prévus)
   - 5 KPI suivis : Tests (72%), Bugs (2/sprint), CI/CD (12min), Offline (65%), Vélocité (19,2 SP)
   - Analyse des écarts et actions correctives
   - Projection et recommandations

4. [Veille Technologique et Résolution de Problèmes (C13)](sections/05-veille-technologique.md)
   - Problème 1 : Architecture offline-first (Service Workers + IndexedDB + Sync API)
   - Problème 2 : Latence réseau Douala-Cloud (Cache Redis + Pagination curseur + Eager Loading + Compression)

5. [Revues d'Avancement et RETEX (C14, C15)](sections/06-revues-avancement-retex.md)
   - Revue d'avancement n°1 (15 Juillet 2026)
   - Revue d'avancement n°2 (15 Août 2026)
   - RETEX final (30 Novembre 2026)
   - Bonnes pratiques et axes d'amélioration

---

## Annexes

- [Sprint Logs complets (Sprints 1-10)](../sprint-logs/sprint-1-to-10.md)
- [Schéma de base de données](../../src/database/schema.sql)
- [Documentation technique API](../README.md)
- [Code source backend](../../src/backend)
- [Code source frontend](../../src/frontend)

---

*Rapport rédigé dans le cadre du bloc BC02 — Manager les Projets Numériques*
*Certification RNCP39765 — Expert en Architecture et Développement Web*
*Session 2026 — CAMTECH SOLUTIONS S.A./AGROCAM S.A.*
