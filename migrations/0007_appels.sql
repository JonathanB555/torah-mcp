-- Les appels du connecteur MCP. On journalise ce qui a été fait, jamais ce qui
-- a été demandé : le nom de l'outil, l'horodatage, le pays Cloudflare, la
-- durée et le succès. Jamais les arguments, jamais une adresse IP, jamais un
-- identifiant de session : on veut savoir quels outils servent, rien de plus.
CREATE TABLE IF NOT EXISTS appels (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  ts     TEXT NOT NULL,            -- ISO 8601 UTC
  outil  TEXT NOT NULL,            -- nom du tool, ou 'initialize' / 'tools_list'
  pays   TEXT,                     -- code Cloudflare, granularité pays
  ms     INTEGER,                  -- durée d'exécution
  ok     INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS appels_ts ON appels (ts);
CREATE INDEX IF NOT EXISTS appels_outil ON appels (outil);
