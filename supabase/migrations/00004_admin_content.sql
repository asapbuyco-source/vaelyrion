-- Admin-managed editorial content and SEO fields.
CREATE TABLE IF NOT EXISTS journal_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url VARCHAR(500),
  category VARCHAR(100) DEFAULT 'Journal',
  author VARCHAR(160) DEFAULT 'Tanelia Editorial',
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  seo_title VARCHAR(255),
  seo_description VARCHAR(320),
  focus_keyword VARCHAR(160),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_articles_status_date
  ON journal_articles(status, published_at DESC);

ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description VARCHAR(320);

CREATE TABLE IF NOT EXISTS content_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic VARCHAR(255) NOT NULL UNIQUE,
  focus_keyword VARCHAR(160),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO content_topics (topic, focus_keyword) VALUES
  ('How to care for raw hair bundles between appointments', 'raw hair bundle care'),
  ('What makes fine Swiss lace look natural in daylight', 'fine Swiss lace'),
  ('How to choose a hair length for an understated everyday finish', 'how to choose hair length'),
  ('The considered way to store a premium wig between wears', 'how to store a premium wig'),
  ('Single-donor hair explained: what to look for before you buy', 'single-donor hair')
ON CONFLICT (topic) DO NOTHING;
