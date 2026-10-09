-- 00008: RLS hardening + missing foreign-key indexes.
--
-- The original schema enabled RLS on only a subset of tables. Anonymous table
-- grants still exist in the database, so any table without RLS enabled is
-- readable/writable by anyone holding the anon key. The backend talks to
-- Postgres exclusively through the service role (which bypasses RLS), so
-- enabling RLS deny-by-default here does not affect application behaviour.
--
-- This migration is idempotent and safe to re-run.

-- 1. Enable RLS on every public table.
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory          ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_batches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens      ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns            ENABLE ROW LEVEL SECURITY;
ALTER TABLE hair_search_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_articles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_topics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events   ENABLE ROW LEVEL SECURITY;

-- 2. Revoke write access from the anonymous role. The storefront has no
--    Supabase client — all writes go through the service-role backend.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon;

-- 3. Prevent role escalation through the `users` self-update policy.
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
REVOKE UPDATE ON users FROM anon, authenticated;

-- 4. Users can read their own tracking events (RLS was enabled but had no policy).
DROP POLICY IF EXISTS "Users can view own tracking events" ON tracking_events;
CREATE POLICY "Users can view own tracking events" ON tracking_events
  FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE u.auth_user_id = auth.uid()
    )
  );

-- 5. Missing foreign-key / lookup indexes.
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_order_id ON tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_journal_articles_slug ON journal_articles(slug);
CREATE INDEX IF NOT EXISTS idx_carts_user_status ON carts(user_id, status);
