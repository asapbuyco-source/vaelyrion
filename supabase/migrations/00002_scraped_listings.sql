-- 00002_scraped_listings.sql
-- Staging table for catalog scraper results (server/scrape/). Raw scraped listings land here;
-- `npm run promote` moves them into products / product_variants / product_images with markup.

CREATE TABLE IF NOT EXISTS scraped_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  price_eur DECIMAL(10,2) NOT NULL,
  compare_at_eur DECIMAL(10,2),
  original_currency VARCHAR(3),
  category VARCHAR(50),
  is_preorder BOOLEAN DEFAULT TRUE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_scraped_listings_unpromoted
  ON scraped_listings(supplier_id) WHERE product_id IS NULL;
