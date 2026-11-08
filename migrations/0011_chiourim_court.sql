-- Short ou vrai cours, tel que YouTube le déclare lui-même dans le flux RSS :
-- le lien canonique d'un short est /shorts/<id>, celui d'une vidéo /watch?v=.
-- Lire la durée sur la page de visionnage ne marche pas depuis le Worker,
-- YouTube y répond 429 et redirige vers une page de consentement.
ALTER TABLE chiourim ADD COLUMN court INTEGER;
