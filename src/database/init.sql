-- DIGITRANS-CM CRM - Initialisation base de donnees PostgreSQL
-- Execute automatiquement au demarrage du conteneur PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Script d'initialisation minimal.
-- Les migrations Laravel creent les tables au premier run.
-- Ce fichier garantit que l'extension UUID est disponible.
-- ============================================================
