-- Langue de la page depuis laquelle la question a été posée (fr | en | he).
ALTER TABLE questions ADD COLUMN lang TEXT NOT NULL DEFAULT 'fr';
