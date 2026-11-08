-- La durée d'une vidéo, que le flux RSS ne donne pas, et sans laquelle on ne
-- peut pas distinguer un clip de deux minutes d'un cours d'une demi-heure.
-- Le rav Attal l'a demandé le 4 novembre 2026 : « il y a les shorts d'un côté,
-- il y a les cours, les vrais cours, d'un autre côté ».
ALTER TABLE chiourim ADD COLUMN duree INTEGER;
