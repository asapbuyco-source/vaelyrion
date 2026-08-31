-- 00006: cart item options (variant selections) + analytics events.
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS options JSONB;
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event VARCHAR(60) NOT NULL,
  path VARCHAR(300),
  product_id UUID,
  order_id UUID,
  value DECIMAL(10,2),
  currency VARCHAR(3),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_time ON analytics_events(event, created_at DESC);
