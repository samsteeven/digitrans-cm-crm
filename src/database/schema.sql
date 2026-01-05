-- ============================================================
-- Schéma de Base de Données — Module CRM SavoirManger
-- Projet DIGITRANS-CM / CAMTECH SOLUTIONS
-- SGBD : PostgreSQL 16
-- ============================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. GESTION DES RESTAURANTS
-- ============================================================

CREATE TABLE restaurants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(100) NOT NULL,
    ville           VARCHAR(50) NOT NULL, -- Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré
    quartier        VARCHAR(100),
    adresse         TEXT,
    telephone       VARCHAR(20),
    email           VARCHAR(100),
    est_actif       BOOLEAN DEFAULT true,
    capacite        INTEGER, -- nombre de couverts
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. GESTION DES CLIENTS
-- ============================================================

CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(50) NOT NULL,
    prenom          VARCHAR(50) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    telephone       VARCHAR(20),
    date_naissance  DATE,
    est_fidelite    BOOLEAN DEFAULT false, -- membre du programme fidélité
    points_fidelite INTEGER DEFAULT 0,
    segment         VARCHAR(20) DEFAULT 'standard', -- standard, premium, vip
    preferences     JSONB DEFAULT '{}', -- allergies, plats préférés
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_segment ON clients(segment);
CREATE INDEX idx_clients_points ON clients(points_fidelite);

-- ============================================================
-- 3. GESTION DES COMMANDES
-- ============================================================

CREATE TABLE categories_plats (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(50) NOT NULL, -- Entrées, Plats, Desserts, Boissons
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plats (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categorie_id    UUID REFERENCES categories_plats(id),
    nom             VARCHAR(100) NOT NULL,
    description     TEXT,
    prix_unitaire   DECIMAL(10,2) NOT NULL,
    devise          VARCHAR(5) DEFAULT 'FCFA',
    disponible      BOOLEAN DEFAULT true,
    image_url       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plats_categorie ON plats(categorie_id);
CREATE INDEX idx_plats_disponible ON plats(disponible);

CREATE TABLE commandes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID REFERENCES clients(id),
    restaurant_id   UUID REFERENCES restaurants(id),
    statut          VARCHAR(20) DEFAULT 'en_attente', -- en_attente, confirmee, en_preparation, prete, livree, annulee
    montant_total   DECIMAL(12,2) NOT NULL,
    devise          VARCHAR(5) DEFAULT 'FCFA',
    type_commande   VARCHAR(20) DEFAULT 'sur_place', -- sur_place, a_emporter, livraison
    notes           TEXT,
    est_synchronise BOOLEAN DEFAULT true, -- offline-first : false si créé hors-ligne
    synced_at       TIMESTAMPTZ, -- dernière synchronisation
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_commandes_restaurant ON commandes(restaurant_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_commandes_date ON commandes(created_at);
CREATE INDEX idx_commandes_sync ON commandes(est_synchronise);

CREATE TABLE ligne_commandes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commande_id     UUID REFERENCES commandes(id) ON DELETE CASCADE,
    plat_id         UUID REFERENCES plats(id),
    quantite        INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire   DECIMAL(10,2) NOT NULL,
    sous_total      DECIMAL(12,2) NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ligne_commande ON ligne_commandes(commande_id);

-- ============================================================
-- 4. PROGRAMME DE FIDÉLITÉ
-- ============================================================

CREATE TABLE paliers_fidelite (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(50) NOT NULL, -- Bronze, Argent, Or, Platine
    points_minimum  INTEGER NOT NULL,
    points_maximum  INTEGER,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions_fidelite (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID REFERENCES clients(id),
    commande_id     UUID REFERENCES commandes(id),
    type            VARCHAR(10) NOT NULL, -- gain, echange, expiration
    points          INTEGER NOT NULL,
    solde_avant     INTEGER NOT NULL,
    solde_apres     INTEGER NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_client ON transactions_fidelite(client_id);
CREATE INDEX idx_transactions_date ON transactions_fidelite(created_at);

CREATE TABLE recompenses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(100) NOT NULL,
    description     TEXT,
    points_requis   INTEGER NOT NULL,
    type            VARCHAR(20) DEFAULT 'produit_offert', -- produit_offert, reduction, menu_gratuit
    valeur          DECIMAL(10,2),
    stock           INTEGER DEFAULT 999,
    est_active      BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE echanges_recompenses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID REFERENCES clients(id),
    recompense_id   UUID REFERENCES recompenses(id),
    points_utilises INTEGER NOT NULL,
    statut          VARCHAR(20) DEFAULT 'valide', -- valide, utilise, expire
    code_utilisation VARCHAR(20) UNIQUE,
    expire_le       DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. AVIS ET SATISFACTION
-- ============================================================

CREATE TABLE avis_clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID REFERENCES clients(id),
    commande_id     UUID REFERENCES commandes(id),
    restaurant_id   UUID REFERENCES restaurants(id),
    note            INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire     TEXT,
    est_modere      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_avis_client ON avis_clients(client_id);
CREATE INDEX idx_avis_restaurant ON avis_clients(restaurant_id);
CREATE INDEX idx_avis_note ON avis_clients(note);

-- ============================================================
-- 6. TABLEAU DE BORD ET STATISTIQUES (VUES MATÉRIALISÉES)
-- ============================================================

CREATE MATERIALIZED VIEW mv_kpi_quotidiens AS
SELECT
    r.id AS restaurant_id,
    r.nom AS restaurant_nom,
    DATE(c.created_at) AS jour,
    COUNT(DISTINCT c.id) AS total_commandes,
    COUNT(DISTINCT c.client_id) AS clients_servis,
    COALESCE(SUM(c.montant_total), 0) AS chiffre_affaires,
    COALESCE(AVG(a.note), 0) AS note_moyenne,
    COUNT(DISTINCT CASE WHEN c.type_commande = 'livraison' THEN c.id END) AS commandes_livraison
FROM commandes c
JOIN restaurants r ON r.id = c.restaurant_id
LEFT JOIN avis_clients a ON a.commande_id = c.id
GROUP BY r.id, r.nom, DATE(c.created_at)
WITH DATA;

CREATE UNIQUE INDEX idx_mv_kpi ON mv_kpi_quotidiens(restaurant_id, jour);

-- ============================================================
-- 7. SYNCHRONISATION (OFFLINE-FIRST)
-- ============================================================

CREATE TABLE sync_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entite_type     VARCHAR(50) NOT NULL, -- commande, avis, client
    entite_id       UUID NOT NULL,
    action          VARCHAR(10) NOT NULL, -- create, update, delete
    payload         JSONB NOT NULL,
    est_synchronise BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    synced_at       TIMESTAMPTZ
);

CREATE INDEX idx_sync_pending ON sync_log(est_synchronise) WHERE est_synchronise = false;

-- ============================================================
-- 8. AUDIT ET TRACABILITÉ (Conformité Loi n°2010/012)
-- ============================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id  UUID,
    action          VARCHAR(50) NOT NULL,
    entite_type     VARCHAR(50) NOT NULL,
    entite_id       UUID,
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entite ON audit_logs(entite_type, entite_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- ============================================================
-- DONNÉES INITIALES (Seed)
-- ============================================================

-- Restaurants SavoirManger
INSERT INTO restaurants (nom, ville, quartier, telephone) VALUES
('SavoirManger Bonanjo', 'Douala', 'Bonanjo', '+237 691 234 567'),
('SavoirManger Bastos', 'Yaoundé', 'Bastos', '+237 691 234 568'),
('SavoirManger Bafoussam Centre', 'Bafoussam', 'Centre Ville', '+237 691 234 569'),
('SavoirManger Garoua', 'Garoua', 'Quartier Commercial', '+237 691 234 570'),
('SavoirManger Ngaoundéré', 'Ngaoundéré', 'Marché Central', '+237 691 234 571');

-- Paliers de fidélité
INSERT INTO paliers_fidelite (nom, points_minimum, points_maximum, description) VALUES
('Bronze', 0, 499, 'Client régulier — 5% de réduction'),
('Argent', 500, 1499, 'Client privilégié — 10% de réduction'),
('Or', 1500, 4999, 'Client Premium — 15% de réduction + plat offert anniversaire'),
('Platine', 5000, NULL, 'Client VIP — 20% de réduction + accès menus exclusifs');

-- Catégories de plats
INSERT INTO categories_plats (nom, description) VALUES
('Entrées', 'Entrées et hors-d\'œuvre'),
('Plats Principaux', 'Plats traditionnels africains et internationaux'),
('Desserts', 'Pâtisseries et desserts'),
('Boissons', 'Boissons chaudes, froides et jus naturels');

-- Récompenses
INSERT INTO recompenses (nom, description, points_requis, type, valeur) VALUES
('Café offert', 'Un café ou thé au choix', 100, 'produit_offert', 1500),
('Dessert offert', 'Un dessert de la carte', 300, 'produit_offert', 3500),
('Menu duo -50%', 'Réduction de 50% sur un menu duo', 500, 'reduction', 5000),
('Plat principal offert', 'Un plat principal au choix', 800, 'menu_gratuit', 8500),
('Menu famille gratuit', 'Menu famille complet (4 pers.)', 1500, 'menu_gratuit', 25000);

-- Plats (exemples)
INSERT INTO plats (categorie_id, nom, prix_unitaire) VALUES
((SELECT id FROM categories_plats WHERE nom = 'Entrées'), 'Samoussas (6 pièces)', 2500),
((SELECT id FROM categories_plats WHERE nom = 'Entrées'), 'Salade César', 3500),
((SELECT id FROM categories_plats WHERE nom = 'Plats Principaux'), 'Poulet DG', 6500),
((SELECT id FROM categories_plats WHERE nom = 'Plats Principaux'), 'Poisson braisé + plantains', 7000),
((SELECT id FROM categories_plats WHERE nom = 'Plats Principaux'), 'Ndolé + riz', 5500),
((SELECT id FROM categories_plats WHERE nom = 'Plats Principaux'), 'Bœuf sauce arachide + foutou', 6000),
((SELECT id FROM categories_plats WHERE nom = 'Desserts'), 'Mousse au chocolat', 2500),
((SELECT id FROM categories_plats WHERE nom = 'Desserts'), 'Salade de fruits', 2000),
((SELECT id FROM categories_plats WHERE nom = 'Boissons'), 'Jus de bissap', 1500),
((SELECT id FROM categories_plats WHERE nom = 'Boissons'), 'Café local', 1000),
((SELECT id FROM categories_plats WHERE nom = 'Boissons'), 'Eau minérale 50cl', 800);
