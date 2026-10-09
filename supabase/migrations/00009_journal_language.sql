-- 00009: Journal language column for correct <html lang>, hreflang and og:locale.
-- Locale was only encoded in the slug suffix by the editorial generator.
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en';

UPDATE journal_articles SET language = 'no' WHERE slug LIKE '%-norwegian' AND language <> 'no';
UPDATE journal_articles SET language = 'it' WHERE slug LIKE '%-italian'   AND language <> 'it';
UPDATE journal_articles SET language = 'es' WHERE slug LIKE '%-spanish'   AND language <> 'es';
UPDATE journal_articles SET language = 'de' WHERE slug LIKE '%-german'    AND language <> 'de';
UPDATE journal_articles SET language = 'fr' WHERE slug LIKE '%-french'    AND language <> 'fr';

CREATE INDEX IF NOT EXISTS idx_journal_articles_language ON journal_articles(language);
