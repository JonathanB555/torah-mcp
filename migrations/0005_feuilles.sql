-- Compteur des feuilles de miel éditées (côté serveur, insensible aux
-- bloqueurs de pistage). Aucune donnée personnelle : jamais le prénom,
-- jamais l'IP — seulement le geste, la ville choisie et la langue.
CREATE TABLE IF NOT EXISTS feuilles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  mode TEXT NOT NULL,      -- impression | image | whatsapp
  ville TEXT,
  langue TEXT,
  pays TEXT
);
CREATE INDEX IF NOT EXISTS idx_feuilles_ts ON feuilles(ts);
