-- Jetons de cache, pour mesurer l'effet de la mise en cache des consignes.
-- Avant elle : 75 535 jetons d'entrée par question, 78 % de la facture.
ALTER TABLE questions ADD COLUMN cache_ecrit INTEGER;
ALTER TABLE questions ADD COLUMN cache_lu INTEGER;
