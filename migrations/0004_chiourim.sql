-- Archive des chiourim vus passer dans le flux RSS de la chaîne :
-- le RSS ne garde que ~15 vidéos, cette table n'oublie rien.
CREATE TABLE IF NOT EXISTS chiourim (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  publie TEXT NOT NULL
);
