-- 00001_initial_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE fulfillment_type AS ENUM ('in_stock', 'preorder', 'custom');
CREATE TYPE batch_status AS ENUM ('open', 'closing', 'generated', 'approved', 'ordered', 'shipped', 'received', 'completed');
CREATE TYPE order_status AS ENUM (
  'PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'IN_WEEKLY_BATCH', 
  'SUPPLIER_ORDERED', 'SUPPLIER_PROCESSING', 'SHIPPED_FROM_CHINA', 
  'INTERNATIONAL_TRANSIT', 'ARRIVED_IN_NORWAY', 'RECEIVED_BY_3PL', 
  'FULFILLMENT_PROCESSING', 'PACKED', 'LOCAL_SHIPMENT', 
  'OUT_FOR_DELIVERY', 'DELIVERED', 
  'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'RETURN_REQUESTED', 'RETURNED'
);

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE, -- References Supabase Auth (auth.users)
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  role user_role DEFAULT 'customer',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADDRESSES
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUPPLIERS
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(100),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  supplier_url VARCHAR(255),
  warehouse_address TEXT,
  quality_score DECIMAL(3,2),
  processing_days INTEGER,
  minimum_order_quantity INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  supplier_cost DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'active',
  fulfillment_type fulfillment_type DEFAULT 'in_stock',
  is_preorder BOOLEAN DEFAULT FALSE,
  estimated_min_days INTEGER,
  estimated_max_days INTEGER,
  weight DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  hair_origin VARCHAR(255),
  details JSONB,
  care_instructions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255),
  sku VARCHAR(100) UNIQUE,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  attributes JSONB, -- e.g., {"length": "18 inch", "density": "150%", "lace": "HD", "color": "1B"}
  active BOOLEAN DEFAULT TRUE
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0
);

-- SUPPLIER PRODUCTS
CREATE TABLE supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  supplier_product_url VARCHAR(255),
  supplier_sku VARCHAR(100),
  supplier_cost DECIMAL(10,2),
  processing_days INTEGER,
  active BOOLEAN DEFAULT TRUE
);

-- INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CARTS
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CART ITEMS
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WEEKLY BATCHES
CREATE TABLE weekly_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number VARCHAR(100) UNIQUE NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE,
  cutoff_at TIMESTAMP WITH TIME ZONE,
  status batch_status DEFAULT 'open',
  total_orders INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  supplier_cost DECIMAL(10,2) DEFAULT 0,
  customer_revenue DECIMAL(10,2) DEFAULT 0,
  estimated_margin DECIMAL(10,2) DEFAULT 0,
  po_document_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES weekly_batches(id) ON DELETE SET NULL,
  status order_status DEFAULT 'PENDING_PAYMENT',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
  currency VARCHAR(3) DEFAULT 'EUR',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  estimated_min_days INTEGER,
  estimated_max_days INTEGER,
  shipping_address_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  variant_snapshot JSONB,
  sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  supplier_cost_snapshot DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  provider_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUPPLIER ORDERS
CREATE TABLE supplier_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES weekly_batches(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
  supplier_order_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  total_cost DECIMAL(10,2) DEFAULT 0,
  placed_at TIMESTAMP WITH TIME ZONE,
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUPPLIER ORDER ITEMS
CREATE TABLE supplier_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  supplier_cost DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- SHIPMENTS
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(255),
  shipping_status VARCHAR(50) DEFAULT 'pending',
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  provider_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FULFILLMENT ORDERS
CREATE TABLE fulfillment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(100),
  external_order_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  warehouse_received_at TIMESTAMP WITH TIME ZONE,
  packed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  provider_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRACKING EVENTS
CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50),
  location VARCHAR(255),
  message TEXT,
  event_time TIMESTAMP WITH TIME ZONE,
  provider_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WISHLISTS
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DEVICE TOKENS
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  platform VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COUPONS
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed'
  value DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  active BOOLEAN DEFAULT TRUE
);

-- RETURNS
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'requested',
  resolution VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HAIR SEARCH REQUESTS (Find This Hair)
CREATE TABLE hair_search_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, processing, matched, completed, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security) Configuration
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hair_search_requests ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth_user_id = auth.uid());
CREATE POLICY "Users can view their addresses" ON addresses FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their wishlists" ON wishlists FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their reviews" ON reviews FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their search requests" ON hair_search_requests FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
