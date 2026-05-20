# Spécification des Cas d'Utilisation — CRM SavoirManger

**Projet :** DIGITRANS-CM — Module CRM  
**Version :** 1.0  
**Outil diagramme :** tsaUML / PlantUML  
**Fichier source :** `docs/diagrammes/cas-utilisation-crm.puml`  

---

## 1. Acteurs

| Acteur | Symbole | Description |
|--------|---------|-------------|
| **Gestionnaire (Admin CRM)** | 👤 | Employé SavoirManger connecté au dashboard. Gère clients, commandes, plats, avis, fidélité, et consulte les KPI. |
| **Client (Restaurant)** | 👥 | Client final du restaurant. Utilise l'app mobile/PWA pour consulter son historique, ses points, et synchroniser ses données offline. |
| **Système (Synchronisation)** | ⚙️ | Processus automatique de synchronisation offline-first entre le PWA et l'API backend. |

---

## 2. Cas d'Utilisation par Domaine

### 2.1 Authentification

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC01 | S'authentifier | Admin | Connexion via email/mot de passe. Retourne un token Sanctum. Protégé par rate limiting (5 tentatives/min). |
| UC02 | Gérer son profil | Admin | Modifier son nom, email, mot de passe. |

### 2.2 Gestion des Clients

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC03 | Consulter la liste des clients | Admin | Liste paginée (15/page) avec segments, recherche. |
| UC04 | Rechercher un client | Admin | Filtrer par nom, email, téléphone, segment. |
| UC05 | Ajouter un nouveau client | Admin | Créer un client avec nom, prénom, email, téléphone. Email unique. |
| UC06 | Voir la fiche détaillée d'un client | Admin | Historique commandes, avis, points fidélité, segment. |
| UC07 | Modifier les infos d'un client | Admin | Mettre à jour les données client. |
| UC08 | Supprimer un client | Admin | Suppression cascade (commandes, avis, transactions). |
| UC09 | Voir les statistiques par segment | Admin | Répartition standard/premium/vip, panier moyen par segment. |

**Relations :**
- UC06 <<include>> UC03 (voir détail inclut la consultation de la liste)
- UC09 <<include>> UC03 (statistiques incluent la consultation)
- UC05 <<extend>> par UC12 (la création de commande peut étendre la création client)

### 2.3 Gestion des Commandes

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC10 | Consulter la liste des commandes | Admin | Liste paginée avec statut, restaurant, montant. |
| UC11 | Filtrer les commandes | Admin | Filtres : statut, restaurant_id, date_debut, date_fin. |
| UC12 | Créer une nouvelle commande | Admin | Avec lignes de commande (plats + quantités). Calcul auto du montant. |
| UC13 | Changer le statut d'une commande | Admin | Workflow : en_attente → confirmee → en_preparation → prete → livree (ou annulee). |
| UC14 | Voir le détail d'une commande | Admin | Lignes de commande, client, restaurant, avis associé. |

**Relations :**
- UC14 <<include>> UC10 (détail inclut consultation de la liste)
- UC13 <<extend>> UC20 (changement de statut → gain de points fidélité)

### 2.4 Gestion des Plats et Catégories

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC15 | Consulter la carte des plats | Admin | Liste paginée avec catégorie, prix, disponibilité. |
| UC16 | Ajouter/Modifier/Supprimer un plat | Admin | CRUD complet. |
| UC17 | Gérer les catégories de plats | Admin | CRUD : entrées, plats principaux, pains, boissons, desserts. |
| UC18 | Activer/Désactiver un plat | Admin | Champ `disponible` boolean. |

### 2.5 Programme Fidélité

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC19 | Consulter les points d'un client | Admin | Solde + historique des transactions (gains, échanges, expirations). |
| UC20 | Ajouter des points après commande | Admin | Automatique : 1 FCFA = 1 point. Déclenché par UC13. |
| UC21 | Consulter les récompenses | Admin | Liste des récompenses disponibles (stock, points requis). |
| UC22 | Échanger des points contre récompense | Admin | Génère un code d'utilisation unique. Vérifie solde suffisant. |

**Relations :**
- UC19 <<include>> UC03 (points client inclut consultation du client)

### 2.6 Avis Clients

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC23 | Consulter les avis et notations | Admin | Liste paginée avec note, commentaire, restaurant. |
| UC24 | Analyser les avis (statistiques) | Admin | Note moyenne, répartition par note, % positif (note ≥ 4). |
| UC25 | Modérer un avis | Admin | Marquer `est_modere = true`. Filtrer les avis inappropriés. |

**Relations :**
- UC24 <<include>> UC23 (analyse inclut consultation des avis)

### 2.7 Tableau de Bord

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC26 | Consulter les indicateurs KPI | Admin | CA total, nb commandes, panier moyen, note moyenne (avec cache Redis 1h). |
| UC27 | Voir l'évolution des ventes | Admin | Courbe mensuelle sur 6 mois. |
| UC28 | Comparer les restaurants | Admin | Comparatif des performances par restaurant. |
| UC29 | Voir le top des clients | Admin | Top 10 clients par CA total. |

### 2.8 Synchronisation Offline-First

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC30 | Synchroniser les données offline | Client, Système | Envoi des entités créées/modifiées en mode offline vers l'API. |
| UC31 | Voir l'état de synchronisation | Client, Système | Statut des éléments en attente, dernière sync. |

**Relations :**
- UC30 <<include>> UC12 (sync inclut création de commande offline)
- UC30 <<include>> UC05 (sync inclut création de client offline)

### 2.9 Administration

| Code | UC | Acteur | Description |
|------|----|--------|-------------|
| UC32 | Gérer les utilisateurs et permissions | Admin | RBAC via Spatie : rôles (admin, manager, caissier), permissions. |
| UC33 | Consulter les logs d'audit | Admin | Historique des actions (création, modification, suppression). |

---

## 3. Diagramme de Cas d'Utilisation (PlantUML)

**Fichier source existant :** `docs/diagrammes/cas-utilisation-crm.puml`  
**Génération :** via tsaUML ou `https://www.plantuml.com/plantuml/uml/`

### Instructions pour le diagramme

1. **Ouvrir `docs/diagrammes/cas-utilisation-crm.puml`** dans VS Code avec l'extension PlantUML (ou tsaUML)
2. **Vérifier le rendu** avec Alt+D (VS Code) ou via le renderer en ligne
3. **Exporter** le PNG dans `docs/diagrammes/cas-utilisation-crm.png`

### Structure du fichier PlantUML

```
@startuml
left to right direction

' Acteurs
actor "Gestionnaire\n(Admin CRM)" as admin
actor "Client\n(Restaurant)" as client
actor "Systeme\n(Synchronisation)" as system

' Cas d'utilisation par rectangle de domaine
rectangle "Gestion Clients" {
  usecase "UC03\nConsulter la liste\ndes clients" as uc03
  ...
}

' Relations acteurs
admin --> uc01
admin --> uc03
...

' Inclusions
uc06 .> uc03 : <<include>>
...

' Extensions
uc13 ..> uc20 : <<extend>>
...

@enduml
```

--- 

## 4. Checklist de validation

Avant de finaliser le diagramme, vérifier :

- [ ] 3 acteurs présents : Admin, Client, Système
- [ ] 33 cas d'utilisation numérotés UC01 à UC33
- [ ] Toutes les relations acteur → use case tracées
- [ ] Inclusions (flèches pointillées `<<include>>`) correctes
- [ ] Extensions (flèches pointillées `<<extend>>`) correctes
- [ ] Aucune flèche croisée (diagramme lisible)
- [ ] Export PNG dans `docs/diagrammes/`

---

> Fichier préparé pour l'équipe CAMTECH SOLUTIONS  
> Source : `docs/diagrammes/cas-utilisation-crm.puml`  
> Contact : samsteeven@camtech.cm
