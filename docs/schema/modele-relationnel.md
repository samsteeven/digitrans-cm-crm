# Modèle Relationnel — CRM SavoirManger

**Projet :** DIGITRANS-CM — Module CRM  
**Version :** 1.0  
**Base :** PostgreSQL 16  
**23 objets :** 22 tables + 1 vue matérialisée  

---

## Légende

| Notation | Signification |
|----------|---------------|
| `PK` | Primary Key |
| `FK` | Foreign Key |
| `NN` | Not Null |
| `UQ` | Unique |
| `CK` | Check constraint |
| `DEF` | Default value |
| `JSONB` | JSON binaire indexable |

---

## Schéma relationnel complet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  MODELE RELATIONNEL — CRM SAVOIRMANGER                      │
│                                                                             │
│  (1) categories_plats ────< (N) plats                                       │
│  (1) clients ────────────< (N) commandes ────< (N) ligne_commandes >── (1)  │
│  (1) restaurants ────────< (N) commandes          plats                     │
│  (1) clients ────────────< (N) transactions_fidelite                        │
│  (1) commandes ──────────< (N) transactions_fidelite                        │
│  (1) clients ────────────< (N) echanges_recompenses >── (1) recompenses     │
│  (1) clients ────────────< (N) avis_clients >── (1) restaurants             │
│  (1) commandes ────────── (1) avis_clients                                  │
│  (N) users >── (N) roles >── (N) permissions (via Spatie)                  │
│  sync_logs + audit_logs (tables système)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. UTILISATEURS & AUTH (tables Laravel)

### users
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `BIGSERIAL` | PK | Identifiant |
| name | `VARCHAR(255)` | NN | Nom complet |
| email | `VARCHAR(255)` | NN, UQ | Email de connexion |
| email_verified_at | `TIMESTAMPTZ` | nullable | Date vérification email |
| password | `VARCHAR(255)` | NN | Hash bcrypt |
| remember_token | `VARCHAR(100)` | nullable | Token session longue |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

### password_reset_tokens
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| email | `VARCHAR(255)` | PK | Email |
| token | `VARCHAR(255)` | NN | Token reset |
| created_at | `TIMESTAMPTZ` | nullable | Date création |

### sessions
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `VARCHAR(255)` | PK | ID session |
| user_id | `BIGINT` | FK → users(id) ON DELETE SET NULL | Utilisateur |
| ip_address | `VARCHAR(45)` | nullable | Adresse IP (IPv4/IPv6) |
| user_agent | `TEXT` | nullable | User agent |
| payload | `TEXT` | NN | Données session |
| last_activity | `INTEGER` | NN | Timestamp Unix |
> Index : `idx_sessions_user_id`, `idx_sessions_last_activity`

### personal_access_tokens
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `BIGSERIAL` | PK | Identifiant |
| tokenable_type | `VARCHAR(255)` | NN | Type du modèle (User::class) |
| tokenable_id | `BIGINT` | NN | ID du modèle |
| name | `VARCHAR(255)` | NN | Nom du token |
| token | `VARCHAR(64)` | NN, UQ | Hash SHA-256 |
| abilities | `TEXT` | nullable | Permissions JSON |
| last_used_at | `TIMESTAMPTZ` | nullable | Dernière utilisation |
| expires_at | `TIMESTAMPTZ` | nullable | Date d'expiration |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |
> Index : `idx_personal_access_tokens_tokenable`, `idx_personal_access_tokens_expires_at`

---

## 2. CACHE (tables Laravel)

### cache
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| key | `VARCHAR(255)` | PK | Clé de cache |
| value | `TEXT` | NN | Valeur sérialisée |
| expiration | `BIGINT` | NN | Timestamp expiration |
> Index : `idx_cache_expiration`

### cache_locks
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| key | `VARCHAR(255)` | PK | Clé du lock |
| owner | `VARCHAR(255)` | NN | Propriétaire |
| expiration | `BIGINT` | NN | Timestamp expiration |
> Index : `idx_cache_locks_expiration`

---

## 3. QUEUE / JOBS (tables Laravel)

### jobs
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `BIGSERIAL` | PK | Identifiant |
| queue | `VARCHAR(255)` | NN | Nom de la queue |
| payload | `TEXT` | NN | Données du job |
| attempts | `SMALLINT` | NN | Tentatives |
| reserved_at | `INTEGER` | nullable | Réservé depuis |
| available_at | `INTEGER` | NN | Disponible depuis |
| created_at | `INTEGER` | NN | Date création Unix |
> Index : `idx_jobs_queue`

### job_batches
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `VARCHAR(255)` | PK | ID batch |
| name | `VARCHAR(255)` | NN | Nom |
| total_jobs | `INTEGER` | NN | Total jobs |
| pending_jobs | `INTEGER` | NN | Jobs en attente |
| failed_jobs | `INTEGER` | NN | Jobs échoués |
| failed_job_ids | `TEXT` | NN | IDs des jobs échoués |
| options | `TEXT` | nullable | Options |
| cancelled_at | `INTEGER` | nullable | Annulé le |
| created_at | `INTEGER` | NN | Créé le |
| finished_at | `INTEGER` | nullable | Terminé le |

### failed_jobs
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `BIGSERIAL` | PK | Identifiant |
| uuid | `VARCHAR(255)` | NN, UQ | UUID du job |
| connection | `TEXT` | NN | Connexion |
| queue | `TEXT` | NN | Queue |
| payload | `TEXT` | NN | Données |
| exception | `TEXT` | NN | Exception |
| failed_at | `TIMESTAMPTZ` | NN, DEF `NOW()` | Date échec |

---

## 4. CATEGORIES DE PLATS

### categories_plats
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| nom | `VARCHAR(50)` | NN | Nom (ex: "Entrées", "Pains", "Boissons") |
| description | `TEXT` | nullable | Description |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `1:N` avec `plats` (une catégorie contient plusieurs plats)
- FK dans `plats.categorie_id`

---

## 5. CLIENTS

### clients
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| nom | `VARCHAR(50)` | NN | Nom de famille |
| prenom | `VARCHAR(50)` | NN | Prénom |
| email | `VARCHAR(100)` | NN, UQ | Email unique |
| telephone | `VARCHAR(20)` | nullable | Téléphone |
| date_naissance | `DATE` | nullable | Date naissance |
| est_fidelite | `BOOLEAN` | NN, DEF `false` | Membre fidélité |
| points_fidelite | `INTEGER` | NN, DEF `0` | Points cumulés |
| segment | `segment_client` | NN, DEF `standard` | Segment : `standard`, `premium`, `vip` |
| preferences | `JSONB` | DEF `'{}'` | Préférences (allergies, plats favoris) |
| notes | `TEXT` | nullable | Notes internes |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `1:N` avec `commandes` (un client passe plusieurs commandes)
- `1:N` avec `transactions_fidelite` (un client a plusieurs transactions)
- `1:N` avec `echanges_recompenses` (un client échange plusieurs récompenses)
- `1:N` avec `avis_clients` (un client laisse plusieurs avis)

---

## 6. RESTAURANTS

### restaurants
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| nom | `VARCHAR(100)` | NN | Nom du restaurant (ex: "SavoirManger Douala") |
| ville | `VARCHAR(50)` | NN | Ville (Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré) |
| quartier | `VARCHAR(100)` | nullable | Quartier |
| adresse | `TEXT` | nullable | Adresse complète |
| telephone | `VARCHAR(20)` | nullable | Téléphone |
| email | `VARCHAR(100)` | nullable | Email |
| est_actif | `BOOLEAN` | NN, DEF `true` | Restaurant actif |
| capacite | `INTEGER` | nullable | Capacité max (couverts) |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `1:N` avec `commandes` (un restaurant reçoit plusieurs commandes)
- `1:N` avec `avis_clients` (un restaurant reçoit plusieurs avis)

---

## 7. PLATS

### plats
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| categorie_id | `UUID` | FK, NN → `categories_plats(id) ON DELETE CASCADE` | Catégorie |
| nom | `VARCHAR(100)` | NN | Nom du plat |
| description | `TEXT` | nullable | Description / ingrédients |
| prix_unitaire | `DECIMAL(10,2)` | NN | Prix unitaire |
| devise | `VARCHAR(5)` | NN, DEF `FCFA` | Devise |
| disponible | `BOOLEAN` | NN, DEF `true` | Disponible à la vente |
| image_url | `TEXT` | nullable | URL image |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `categories_plats` (un plat appartient à une catégorie)
- `1:N` avec `ligne_commandes` (un plat est dans plusieurs lignes de commande)

---

## 8. COMMANDES

### commandes
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| client_id | `UUID` | FK, NN → `clients(id) ON DELETE CASCADE` | Client |
| restaurant_id | `UUID` | FK, NN → `restaurants(id) ON DELETE CASCADE` | Restaurant |
| statut | `statut_commande` | NN, DEF `en_attente` | Statut : `en_attente`, `confirmee`, `en_preparation`, `prete`, `livree`, `annulee` |
| montant_total | `DECIMAL(12,2)` | NN | Montant total |
| devise | `VARCHAR(5)` | NN, DEF `FCFA` | Devise |
| type_commande | `type_commande` | NN, DEF `sur_place` | Type : `sur_place`, `a_emporter`, `livraison` |
| notes | `TEXT` | nullable | Notes |
| est_synchronise | `BOOLEAN` | NN, DEF `true` | Sync offline |
| synced_at | `TIMESTAMPTZ` | nullable | Date dernière sync |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `clients` (une commande appartient à un client)
- `N:1` avec `restaurants` (une commande appartient à un restaurant)
- `1:N` avec `ligne_commandes` (une commande contient plusieurs lignes)
- `1:1` avec `avis_clients` (une commande peut avoir un avis — relation 1:1 logique)
- `1:N` avec `transactions_fidelite` (une commande peut générer des points)

---

## 9. LIGNES DE COMMANDE

### ligne_commandes
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| commande_id | `UUID` | FK, NN → `commandes(id) ON DELETE CASCADE` | Commande |
| plat_id | `UUID` | FK, NN → `plats(id) ON DELETE CASCADE` | Plat |
| quantite | `INTEGER` | NN, CK `quantite > 0` | Quantité |
| prix_unitaire | `DECIMAL(10,2)` | NN | Prix unitaire (figé à la commande) |
| sous_total | `DECIMAL(12,2)` | NN | Sous-total (quantité × prix_unitaire) |
| notes | `TEXT` | nullable | Notes ligne |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `commandes` (une ligne appartient à une commande)
- `N:1` avec `plats` (une ligne correspond à un plat)

---

## 10. PROGRAMME FIDÉLITÉ

### palier_fidelites
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| nom | `VARCHAR(50)` | NN | Nom du palier (ex: "Bronze", "Argent", "Or") |
| points_minimum | `INTEGER` | NN, CK `points_minimum >= 0` | Seuil minimum |
| points_maximum | `INTEGER` | nullable | Seuil maximum (NULL = illimité) |
| description | `TEXT` | nullable | Description |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

### transactions_fidelite
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| client_id | `UUID` | FK, NN → `clients(id) ON DELETE CASCADE` | Client |
| commande_id | `UUID` | FK → `commandes(id) ON DELETE SET NULL` | Commande source |
| type | `type_transaction_fidelite` | NN | Type : `gain`, `echange`, `expiration` |
| points | `INTEGER` | NN | Points de la transaction |
| solde_avant | `INTEGER` | NN | Solde avant transaction |
| solde_apres | `INTEGER` | NN | Solde après transaction |
| description | `TEXT` | nullable | Description |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `clients` (une transaction appartient à un client)
- `N:1` avec `commandes` (une transaction peut être liée à une commande)

### recompenses
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| nom | `VARCHAR(100)` | NN | Nom (ex: "Menu poulet gratis") |
| description | `TEXT` | nullable | Description |
| points_requis | `INTEGER` | NN, CK `points_requis > 0` | Points nécessaires |
| type | `type_recompense` | NN, DEF `produit_offert` | Type : `produit_offert`, `reduction`, `menu_gratuit` |
| valeur | `DECIMAL(10,2)` | nullable | Valeur monétaire |
| stock | `INTEGER` | NN, DEF `999` | Stock disponible |
| est_active | `BOOLEAN` | NN, DEF `true` | Récompense active |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

### echanges_recompenses
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| client_id | `UUID` | FK, NN → `clients(id) ON DELETE CASCADE` | Client |
| recompense_id | `UUID` | FK, NN → `recompenses(id) ON DELETE CASCADE` | Récompense |
| points_utilises | `INTEGER` | NN | Points dépensés |
| statut | `statut_echange` | NN, DEF `valide` | Statut : `valide`, `utilise`, `expire` |
| code_utilisation | `VARCHAR(20)` | NN, UQ | Code unique d'utilisation |
| expire_le | `DATE` | nullable | Date d'expiration |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `clients` (un échange appartient à un client)
- `N:1` avec `recompenses` (un échange correspond à une récompense)

---

## 11. AVIS CLIENTS

### avis_clients
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| client_id | `UUID` | FK, NN → `clients(id) ON DELETE CASCADE` | Client |
| commande_id | `UUID` | FK, NN → `commandes(id) ON DELETE CASCADE` | Commande associée |
| restaurant_id | `UUID` | FK, NN → `restaurants(id) ON DELETE CASCADE` | Restaurant |
| note | `INTEGER` | NN, CK `note >= 1 AND note <= 5` | Note (1-5) |
| commentaire | `TEXT` | nullable | Commentaire |
| est_modere | `BOOLEAN` | NN, DEF `false` | Modéré par admin |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |

**Relations :**
- `N:1` avec `clients` (un avis appartient à un client)
- `N:1` avec `commandes` (un avis est lié à une commande)
- `N:1` avec `restaurants` (un avis vise un restaurant)

---

## 12. SYNCHRONISATION OFFLINE-FIRST

### sync_logs
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| entite_type | `VARCHAR(50)` | NN | Type d'entité (ex: `commande`, `avis`) |
| entite_id | `UUID` | NN | ID de l'entité |
| action | `action_sync` | NN | Action : `create`, `update`, `delete` |
| payload | `JSONB` | NN, DEF `'{}'` | Données complètes |
| est_synchronise | `BOOLEAN` | NN, DEF `false` | Sync status |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |
| synced_at | `TIMESTAMPTZ` | nullable | Date sync |
> Index : `idx_sync_logs_est_synchronise`

---

## 13. AUDIT

### audit_logs
| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | `UUID` | PK, DEF `uuid_generate_v4()` | Identifiant |
| utilisateur_id | `UUID` | nullable | Utilisateur responsable |
| action | `VARCHAR(50)` | NN | Action (ex: `created`, `updated`, `deleted`) |
| entite_type | `VARCHAR(50)` | NN | Type d'entité |
| entite_id | `UUID` | nullable | ID entité |
| anciennes_valeurs | `JSONB` | nullable | Valeurs avant |
| nouvelles_valeurs | `JSONB` | nullable | Valeurs après |
| adresse_ip | `VARCHAR(45)` | nullable | Adresse IP |
| user_agent | `TEXT` | nullable | User agent |
| created_at | `TIMESTAMPTZ` | nullable | Date création |
| updated_at | `TIMESTAMPTZ` | nullable | Date màj |
> Index : `idx_audit_logs_entite`, `idx_audit_logs_created_at`

---

## 14. SPATIE PERMISSIONS (RBAC)

Tables du package Spatie Laravel-permission pour la gestion des rôles :
- **permissions** : Liste des permissions (ex: `create-commandes`, `manage-avis`)
- **roles** : Rôles (ex: `admin`, `manager`, `caissier`)
- **model_has_permissions** : Permissions attachées directement à un utilisateur
- **model_has_roles** : Rôles attachés à un utilisateur
- **role_has_permissions** : Permissions attachées à un rôle

---

## 15. VUE MATERIALISÉE KPI

### mv_kpi_quotidiens
| Colonne | Type | Description |
|---------|------|-------------|
| restaurant_id | `UUID` | FK → restaurants(id) |
| restaurant_nom | `VARCHAR(100)` | Nom du restaurant |
| jour | `DATE` | Date |
| total_commandes | `BIGINT` | Nombre de commandes |
| clients_servis | `BIGINT` | Clients distincts |
| chiffre_affaires | `NUMERIC` | CA total |
| note_moyenne | `NUMERIC` | Note moyenne des avis |
| commandes_livraison | `BIGINT` | Commandes livraison |

**Clé unique :** `(restaurant_id, jour)`  
**Refresh :** `REFRESH MATERIALIZED VIEW mv_kpi_quotidiens` (cron horaire)

---

## Récapitulatif des cardinalités

| # | Table A | Cardinalité | Table B | FK |
|---|---------|-----------|---------|-----|
| 1 | `categories_plats` | 1,N | `plats` | `plats.categorie_id` |
| 2 | `clients` | 1,N | `commandes` | `commandes.client_id` |
| 3 | `restaurants` | 1,N | `commandes` | `commandes.restaurant_id` |
| 4 | `commandes` | 1,N | `ligne_commandes` | `ligne_commandes.commande_id` |
| 5 | `plats` | 1,N | `ligne_commandes` | `ligne_commandes.plat_id` |
| 6 | `clients` | 1,N | `transactions_fidelite` | `transactions_fidelite.client_id` |
| 7 | `commandes` | 1,N | `transactions_fidelite` | `transactions_fidelite.commande_id` |
| 8 | `clients` | 1,N | `echanges_recompenses` | `echanges_recompenses.client_id` |
| 9 | `recompenses` | 1,N | `echanges_recompenses` | `echanges_recompenses.recompense_id` |
| 10 | `clients` | 1,N | `avis_clients` | `avis_clients.client_id` |
| 11 | `commandes` | 1,1 | `avis_clients` | `avis_clients.commande_id` |
| 12 | `restaurants` | 1,N | `avis_clients` | `avis_clients.restaurant_id` |

---

## Tâche à réaliser

À partir de ce document et du fichier SQL (`docs/schema-postgresql-complet.sql`) :

1. **Créer le diagramme MCD (Modèle Conceptuel de Données)** avec DrawSQL, Lucidchart ou MySQL Workbench
   - Entités avec leurs attributs
   - Relations avec cardinalités (1,1 / 1,N / N,N)
   - Types PostgreSQL pour chaque attribut

2. **Créer le diagramme MLD (Modèle Logique de Données)** :
   - Tables avec clés primaires et étrangères
   - Types de données exacts
   - Contraintes (CHECK, UNIQUE, NOT NULL, DEFAULT)

3. **Exporter le tout** dans `docs/diagrammes/modele-relationnel.png`

Fichiers source disponibles :
- `docs/schema-postgresql-complet.sql` — DDL complet 22 tables + vue matérialisée
- `docs/schema-postgresql-metier.sql` — Tables métier uniquement
- `docs/schema/modele-relationnel.md` (ce fichier) — Documentation complète
- Modèles Laravel dans `src/backend/app/Models/`

---

> Document préparé pour l'équipe CAMTECH SOLUTIONS  
> Contact : samsteeven@camtech.cm
