-- Journal des tâches planifiées.
--
-- Le message de Chabbat n'a pas été régénéré pendant douze jours sans que
-- personne puisse le voir : le déclencheur hebdomadaire échouait en silence,
-- et l'unique trace était un console.log perdu. Une tâche qui tourne seule
-- doit laisser une trace de ses échecs, sinon elle s'arrête sans bruit.
CREATE TABLE IF NOT EXISTS taches (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      TEXT    NOT NULL,   -- ISO 8601 UTC
  tache   TEXT    NOT NULL,   -- chabbat | chiourim
  origine TEXT    NOT NULL,   -- cron | page | manuel
  ok      INTEGER NOT NULL,   -- 0 | 1
  detail  TEXT                -- le message d'erreur, ou ce qui a été fait
);
CREATE INDEX IF NOT EXISTS idx_taches_ts ON taches (ts);
