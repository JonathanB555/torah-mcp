-- Le message WhatsApp de Chabbat, une ligne par vendredi, en trois langues.
CREATE TABLE IF NOT EXISTS chabbat (
  vendredi TEXT PRIMARY KEY,  -- YYYY-MM-DD (le vendredi de la semaine)
  fr TEXT NOT NULL,
  en TEXT NOT NULL,
  he TEXT NOT NULL,
  ts TEXT NOT NULL            -- date de génération, ISO 8601
);
