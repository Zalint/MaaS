-- Migration: Ajouter les nouvelles colonnes pour la qualification des leads
-- Date: 02 janvier 2026

-- Ajouter la colonne WhatsApp (obligatoire)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);

-- Ajouter la colonne Profil (obligatoire)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS profil VARCHAR(50);

-- Ajouter la colonne Zone (obligatoire)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS zone VARCHAR(100);

-- Créer les index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_waitlist_profil ON waitlist(profil);
CREATE INDEX IF NOT EXISTS idx_waitlist_zone ON waitlist(zone);

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;

