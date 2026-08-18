-- Journal statistique des questions posées sur /question.
-- Volontairement sans adresse IP ni identifiant de visiteur.
CREATE TABLE IF NOT EXISTS questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          TEXT    NOT NULL,            -- ISO 8601 UTC
  mode        TEXT    NOT NULL,            -- debutant | classique | avance
  question    TEXT    NOT NULL,
  statut      TEXT    NOT NULL,            -- ok | erreur | refus
  cause       TEXT,                        -- credit_epuise, cle_refusee, saturation, rate_limit, api_5xx…
  duree_ms    INTEGER,
  nb_sources  INTEGER,
  tours       INTEGER,
  tokens_in   INTEGER,
  tokens_out  INTEGER,
  modele      TEXT,
  pays        TEXT,                        -- code pays Cloudflare (CF-IPCountry), agrégat seulement
  reponse_len INTEGER
);
CREATE INDEX IF NOT EXISTS idx_questions_ts ON questions (ts);
