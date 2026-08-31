-- Editable site-wide copy: announcement bar, batch labels, thresholds.
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(80) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('announcement_primary', 'The Current Atelier Collection'),
  ('announcement_secondary', 'Complimentary insured delivery over €250 · Europe & Norway'),
  ('preorder_batch_label', 'Made to Order'),
  ('newsletter_batch_label', 'the next collection')
ON CONFLICT (key) DO NOTHING;
