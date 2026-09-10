-- Les retours des visiteurs : un bug rencontré, une amélioration souhaitée.
-- Aucune donnée personnelle n'est exigée. Le champ contact est facultatif et
-- n'est là que si la personne veut une réponse ; l'IP n'est jamais conservée.
CREATE TABLE IF NOT EXISTS retours (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  ts       TEXT NOT NULL,           -- ISO 8601 UTC
  genre    TEXT NOT NULL,           -- 'bug' | 'idee'
  message  TEXT NOT NULL,
  page     TEXT,                    -- la page d'où part le retour
  contact  TEXT,                    -- facultatif
  langue   TEXT,                    -- fr | en | he
  pays     TEXT,                    -- code Cloudflare, granularité pays
  lu       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS retours_ts ON retours (ts);
CREATE INDEX IF NOT EXISTS retours_lu ON retours (lu);
