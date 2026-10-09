-- 00007: Repair analytics_events.
-- Migration 00006 introduced this table, but it is missing from some deployed
-- environments, which silently dropped every analytics event.
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
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Written by the backend (service role) only.
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
