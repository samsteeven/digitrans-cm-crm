# Guide Utilisateur — CRM SavoirManger

**Version :** 1.0 — Juin 2026  
**Application :** Module CRM des restaurants SavoirManger  
**Projet :** DIGITRANS-CM (CAMTECH SOLUTIONS S.A. pour AGROCAM S.A.)

---

## 1. Introduction

### 1.1 Qu'est-ce que le CRM SavoirManger ?

Le CRM SavoirManger est une application qui vous aide à gérer la relation avec vos clients au quotidien. Elle remplace l'ancien système de 2009 et vous permet de :

-   Enregistrer et retrouver les informations de vos clients
-   Prendre des commandes et suivre leur statut
-   Gérer le programme de fidélité (points et récompenses)
-   Consulter les avis laissés par vos clients
-   Visualiser les indicateurs de performance de votre restaurant

### 1.2 Qui utilise l'application ?

| Rôle | Fonctionnalités principales |
|------|-----------------------------|
| **Caissier / Serveur** | Prise de commande, consultation client, encaissement |
| **Manager de restaurant** | Tableau de bord, suivi des commandes, avis clients |
| **Direction AGROCAM** | Indicateurs de performance sur l'ensemble des restaurants |

### 1.3 Connexion Internet

L'application fonctionne avec ou sans connexion Internet. En cas de coupure réseau, vous pouvez continuer à prendre des commandes — elles seront synchronisées automatiquement dès le retour de la connexion (voir section 7).

---

## 2. Connexion et déconnexion

### 2.1 Se connecter

1.  Ouvrez votre navigateur Web (Chrome, Firefox, Edge)
2.  Rendez-vous à l'adresse fournie par votre responsable (exemple : `https://crm.savoirmanager.cm`)
3.  L'écran d'accueil affiche un formulaire de connexion :

    ```
    ┌─────────────────────────────────┐
    │   SavoirManger CRM              │
    │   Connectez-vous à votre espace │
    │                                 │
    │   Email    [________________]   │
    │   Mot de passe [____________]   │
    │                                 │
    │   [  Se connecter  ]            │
    └─────────────────────────────────┘
    ```

4.  Saisissez votre **adresse email** (exemple : `manager.bonanjo@savoirmanager.cm`)
5.  Saisissez votre **mot de passe** (communiqué par votre responsable)
6.  Cliquez sur **« Se connecter »**
7.  Vous arrivez sur le **Tableau de bord** de votre restaurant

### 2.2 Se déconnecter

1.  Cliquez sur votre nom en bas à gauche de l'écran
2.  Cliquez sur **« Déconnexion »**
3.  Vous êtes redirigé vers l'écran de connexion

### 2.3 Mot de passe oublié

Contactez votre responsable CAMTECH SOLUTIONS au **+237 691 234 567** ou par email à **support@camtech.cm**.

---

## 3. Gestion des clients

### 3.1 Accéder à la liste des clients

1.  Cliquez sur **« Clients »** dans le menu de gauche
2.  La liste complète de vos clients s'affiche :

    ```
    ┌──────────────────────────────────────────────────────────────┐
    │ Gestion des clients                                         │
    │ ┌─────────────────────┐  Segment : [Tous ▼]                 │
    │ │ 🔍 Rechercher...   │                                      │
    │ └─────────────────────┘                                      │
    │ ┌──────────────────────────────────────────────────────────┐ │
    │ │ Nom complet     │ Email              │ Points │ Segment │ │
    │ │───────────── ───┼────────────────────┼────────┼─────────│ │
    │ │ Ebéné Daniel    │ d.ebene@email.cm   │ 1200   │ Premium │ │
    │ │ Moukam Henri    │ h.moukam@email.cm  │ 450    │ Standard│ │
    │ │ ...             │ ...                │ ...    │ ...     │ │
    │ └──────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────┘
    ```

### 3.2 Rechercher un client

1.  Dans la barre **« Rechercher… »**, tapez le nom, prénom ou email du client
2.  La liste se filtre automatiquement au fur et à mesure de votre saisie
3.  Pour voir tous les clients, effacez le texte saisi

### 3.3 Filtrer par segment

1.  Cliquez sur la liste déroulante **« Tous les segments »**
2.  Choisissez un segment :

| Segment | Description | Avantages |
|---------|-------------|-----------|
| **Standard** | Client occasionnel | — |
| **Premium** | Client régulier (500-1499 points) | 10 % de réduction |
| **VIP** | Client fidèle (1500+ points) | 15 % de réduction + plat offert anniversaire |

### 3.4 Créer un nouveau client

1.  Cliquez sur le bouton **« + Nouveau client »**
2.  Remplissez le formulaire :

    ```
    ┌─────────────────────────────────┐
    │ Nouveau client                  │
    │                                 │
    │ Nom        [________________]   │
    │ Prénom     [________________]   │
    │ Email      [________________]   │
    │ Téléphone  [________________]   │
    │ Date naiss.[________________]   │
    │                                 │
    │ [  Enregistrer  ] [ Annuler ]   │
    └─────────────────────────────────┘
    ```

3.  Les champs avec une astérisque (*) sont obligatoires
4.  Cliquez sur **« Enregistrer »**
5.  Le client apparaît dans la liste

### 3.5 Consulter la fiche client

1.  Cliquez sur un client dans la liste
2.  Sa fiche détaillée s'affiche avec :
    - Informations personnelles
    - Historique des commandes
    - Points de fidélité et segment
    - Avis laissés

---

## 4. Gestion des commandes

### 4.1 Lister les commandes

1.  Cliquez sur **« Commandes »** dans le menu de gauche
2.  La liste des commandes apparaît, triée de la plus récente à la plus ancienne :

    ```
    ┌──────────────────────────────────────────────────────────────┐
    │ Gestion des commandes                                       │
    │ Statut : [Tous ▼]                                           │
    │ ┌──────────────────────────────────────────────────────────┐ │
    │ │ Client        │ Montant  │ Type        │ Statut  │ Date │ │
    │ │──────────────────────────────────────────────────────────│ │
    │ │ Daniel Ebéné │ 6 500    │ Sur place   │ ✅ Prête│ 15/05 │ │
    │ │ Henri Moukam │ 12 000   │ Livraison   │ 🔄 Prép.│ 15/05 │ │
    │ │ ...          │ ...      │ ...         │ ...     │ ...   │ │
    │ └──────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────┘
    ```

### 4.2 Filtrer par statut

Utilisez la liste déroulante **« Tous les statuts »** pour filtrer :

| Statut | Signification | Action attendue |
|--------|---------------|-----------------|
| **En attente** | Commande reçue, non confirmée | Confirmer la disponibilité |
| **Confirmée** | Validée par le restaurant | Transmettre en cuisine |
| **En préparation** | En cours de cuisson | — |
| **Prête** | Prête à servir | Appeler le client / livrer |
| **Livrée** | Servie ou livrée | Terminé |
| **Annulée** | Commande annulée | — |

### 4.3 Modifier le statut d'une commande

1.  Dans la colonne **« Statut »**, cliquez sur le statut actuel
2.  Une liste déroulante apparaît
3.  Sélectionnez le nouveau statut (exemple : passer de « En attente » à « Confirmée »)
4.  La modification est prise en compte immédiatement

### 4.4 Créer une nouvelle commande

1.  Cliquez sur **« + Nouvelle commande »**
2.  Sélectionnez le client (commencez à taper son nom pour le rechercher)
3.  Sélectionnez le type :
    - **Sur place** : le client mange au restaurant
    - **À emporter** : le client récupère sa commande
    - **Livraison** : la commande est livrée
4.  Ajoutez les plats commandés :

    ```
    Plat                       Quantité  Prix
    ──────────────────────────────────────────
    Poulet DG                    2      13 000
    Jus de bissap                1       1 500
    ──────────────────────────────────────────
    Total                       15 500 FCFA
    ```

5.  Cliquez sur **« Enregistrer la commande »**
6.  La commande apparaît dans la liste avec le statut « En attente »

---

## 5. Programme de fidélité

### 5.1 Consulter les points d'un client

1.  Allez dans **« Clients »**
2.  Recherchez le client
3.  Ses points de fidélité s'affichent dans la colonne « Points » et sur sa fiche détaillée
4.  Le segment (Standard, Premium ou VIP) est mis à jour automatiquement selon le nombre de points

**Règle de calcul :** 1 point = 1 000 FCFA dépensés.

### 5.2 Paliers de fidélité

| Palier | Points | Avantages |
|--------|--------|-----------|
| 🟤 **Bronze** | 0 – 499 points | — |
| ⚪ **Argent** | 500 – 1 499 points | 10 % de réduction |
| 🟡 **Or** | 1 500 – 4 999 points | 15 % de réduction + plat offert anniversaire |
| ⚫ **Platine** | 5 000+ points | 20 % de réduction + menus exclusifs |

### 5.3 Échanger des points contre une récompense

1.  Allez dans **« Fidélité »** dans le menu
2.  La liste des récompenses disponibles s'affiche :

    ```
    ┌──────────────────────────────────────────────────────────────┐
    │ Programme de fidélité | SavoirManger Rewards                │
    │                                                             │
    │ 🎁 Café offert             100 points                      │
    │ 🎁 Dessert offert          300 points                      │
    │ 🎁 Menu duo -50%           500 points                      │
    │ 🎁 Plat principal offert   800 points                      │
    │ 🎁 Menu famille gratuit    1 500 points                    │
    └──────────────────────────────────────────────────────────────┘
    ```

3.  Cliquez sur la récompense souhaitée
4.  Confirmez l'échange
5.  Un **code unique** est généré (exemple : `CRM-A3F8B2`)
6.  Notez ce code ou imprimez-le pour le client
7.  Le client peut utiliser ce code lors de sa prochaine visite

### 5.4 Valider une récompense utilisée

Lorsque le client utilise son code de récompense :
1.  Depuis la fiche client, allez dans l'onglet « Récompenses »
2.  Trouvez le code correspondant
3.  Cliquez sur **« Marquer comme utilisé »**

---

## 6. Dashboard (Tableau de bord)

### 6.1 Accéder au tableau de bord

Cliquez sur **« Dashboard »** dans le menu de gauche.

### 6.2 Comprendre les indicateurs

Le tableau de bord affiche 4 indicateurs clés pour le mois en cours :

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Chiffre       │  │ Commandes    │  │ Clients      │  │ Note         │
│ d'affaires    │  │              │  │ servis       │  │ moyenne      │
│ 4 500 000     │  │ 320          │  │ 180          │  │ 4.2 / 5      │
│ FCFA          │  │ ce mois      │  │ ce mois      │  │ avis clients │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

-   **Chiffre d'affaires** : Total des ventes du mois en cours
-   **Commandes** : Nombre total de commandes passées
-   **Clients servis** : Nombre de clients distincts ayant commandé
-   **Note moyenne** : Note moyenne des avis clients (sur 5)

### 6.3 Graphiques

Deux graphiques vous aident à visualiser les tendances :

1.  **Évolution du chiffre d'affaires** (courbe sur 6 mois) — Permet de comparer l'activité mois par mois
2.  **Commandes par statut** (barres) — Montre la répartition des commandes entre les différents statuts

### 6.4 Exporter les données

Pour exporter les données du tableau de bord :
1.  Utilisez la fonction « Imprimer » de votre navigateur (Ctrl+P)
2.  Sélectionnez « Enregistrer au format PDF »

---

## 7. Mode hors-ligne

### 7.1 Fonctionnement en cas de coupure Internet

Le CRM SavoirManger continue de fonctionner même sans connexion Internet. Voici ce qui reste accessible :

| Fonctionnalité | Disponible hors-ligne |
|----------------|------------------------|
| Consulter la liste des clients | ✅ Oui |
| Créer une commande | ✅ Oui |
| Consulter le menu / les plats | ✅ Oui (données mises en cache) |
| Dashboard (derniers chiffres) | ✅ Oui (données en cache) |
| Créer un nouveau client | ✅ Oui |
| Modifier le statut d'une commande | ✅ Oui (synchronisé plus tard) |
| Échanger des points | ❌ Temporairement indisponible |

### 7.2 Que se passe-t-il au retour de la connexion ?

1.  Les commandes prises hors-ligne sont **automatiquement synchronisées**
2.  Les nouveaux clients enregistrés hors-ligne sont créés sur le serveur
3.  Un message vert apparaît : **« Synchronisation réussie (X éléments) »**
4.  Si un conflit est détecté (exemple : un plat n'est plus disponible), le système vous en informe

### 7.3 Bonnes pratiques

-   Si vous savez qu'une coupure est prévue (délestage Eneo), **rafraîchissez la page avant la coupure** pour mettre le cache à jour
-   En cas de doute sur la synchronisation, cliquez sur le bouton **« Rafraîchir »** (F5)

---

## 8. Problèmes courants et solutions (FAQ)

| Problème | Cause possible | Solution |
|----------|---------------|----------|
| **Impossible de se connecter** | Mot de passe erroné | Cliquez sur « Mot de passe oublié » ou contactez le support |
| **Écran blanc au chargement** | Cache navigateur obsolète | Appuyez sur Ctrl+F5 (ou Cmd+Shift+R sur Mac) pour vider le cache |
| **Message « Synchronisation échouée »** | Connexion instable | Vérifiez votre connexion, puis cliquez sur Rafraîchir |
| **Un client n'apparaît pas dans la liste** | Client créé hors-ligne non encore synchronisé | Attendez la synchronisation automatique ou rafraîchissez la page |
| **Points de fidélité non mis à jour** | Synchronisation en attente | Les points sont recalculés après synchronisation de la commande |
| **Graphiques vides sur le dashboard** | Absence de données sur la période | Vérifiez la période sélectionnée ; si vide, des commandes doivent exister sur la période |
| **Lenteur de l'application** | Connexion Internet lente | Les fonctions de base restent accessibles en mode hors-ligne |

---

## Support technique

**CAMTECH SOLUTIONS S.A.**  
Siège : Bonanjo, Douala — Cameroun  
Email : **support@camtech.cm**  
Téléphone : **+237 691 234 567**  
Horaires : 8h00 – 18h00 (lundi – vendredi)

En cas d'urgence (application bloquante), contactez le **support WhatsApp** : **+237 691 234 567**

---

*Document rédigé par CAMTECH SOLUTIONS S.A. dans le cadre du projet DIGITRANS-CM pour AGROCAM S.A.*  
*Module CRM SavoirManger — Juin 2026*
