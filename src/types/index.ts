export type CategoryType = 
  | 'all' 
  | 'wigs' 
  | 'bundles' 
  | 'closures' 
  | 'frontals' 
  | 'extensions' 
  | 'accessories' 
  | 'new-arrivals' 
  | 'best-sellers';

export type HairTexture = 'Straight' | 'Body Wave' | 'Deep Wave' | 'Water Wave' | 'Kinky Curly' | 'Loose Wave' | 'Silky Blunt Cut';
export type LaceType = '13x4 HD Swiss Lace' | '13x6 HD Lace' | '5x5 HD Closure' | 'Transparent Lace' | 'Full Lace Invisible';
export type HairDensity = '150%' | '180%' | '200%' | '250%';
export type HairColor = 'Natural Black (#1B)' | 'Jet Black (#1)' | 'Honey Blonde Mix (#P4/27)' | 'Burgundy (#99J)' | 'Rich Chestnut Brown' | 'Platinum Ash 613';

export interface ProductVariant {
  length: string; // e.g. "18 inch", "24 inch"
  density: HairDensity;
  lace: LaceType;
  color: HairColor;
  priceOffset: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: 'wigs' | 'bundles' | 'closures' | 'frontals' | 'extensions' | 'accessories';
  price: number;
  originalPrice?: number;
  supplierCost: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isPreOrder: boolean;
  estimatedDelivery: string; // e.g. "10–18 business days (Batch Delivery to Norway)" or "2–4 business days (In Stock)"
  stockCount: number;
  textures: HairTexture[];
  lengths: string[];
  densities: HairDensity[];
  laceTypes: LaceType[];
  colors: HairColor[];
  description: string;
  hairOrigin: string; // e.g. "100% Raw Virgin Cambodian Hair" or "100% Cuticle-Aligned Brazilian Hair"
  details: string[];
  careInstructions: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  supplierId: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedLength: string;
  selectedDensity: HairDensity;
  selectedLace: LaceType;
  selectedColor: HairColor;
  unitPrice: number;
  quantity: number;
  isPreOrder: boolean;
  customNotes?: string;
}

export type OrderStatusStep = 
  | 'payment_confirmed'
  | 'order_received'
  | 'weekly_batch_created'
  | 'supplier_processing'
  | 'shipped_china'
  | 'international_transit'
  | 'arrived_norway'
  | 'fulfillment_center'
  | 'preparing_shipment'
  | 'shipped_customer'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingEvent {
  step: OrderStatusStep;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: 'card' | 'apple_pay' | 'klarna' | 'test_mode';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderStatus: OrderStatusStep;
  batchId: string;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
  estimatedDeliveryRange: string;
}

export interface WeeklyBatch {
  id: string;
  batchNumber: string;
  title: string;
  status: 'collecting' | 'po_generated' | 'supplier_processing' | 'shipped_china' | 'arrived_norway' | 'fulfilled';
  cutOffDate: string;
  totalUnits: number;
  totalSupplierCost: number;
  totalCustomerRevenue: number;
  expectedMargin: number;
  productsSummary: {
    category: string;
    units: number;
    supplierCost: number;
    revenue: number;
  }[];
  poDocumentNumber: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  platform: string;
  contact: string;
  specialty: string;
  moq: number;
  leadTimeDays: number;
  qualityRating: number;
  status: 'approved' | 'in_review' | 'preferred';
  notes: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verifiedPurchase: boolean;
  hairLength: string;
  hairTexture: string;
  helpfulCount: number;
}

export interface DiscoverArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Editorial' | 'Styling Masterclass' | 'Trend Report' | 'Care Guide' | 'Lookbook';
  readTime: string;
  image: string;
  author: string;
  date: string;
  featuredProductIds: string[];
  content: string[];
  quote?: string;
  tags: string[];
}

export interface VisualMatchResult {
  product: Product;
  similarityScore: number;
  matchReasons: string[];
  detectedTexture: string;
  detectedLength: string;
  detectedColor: string;
}

export interface UserAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'batch' | 'drop' | 'exclusive';
  read: boolean;
  orderId?: string;
}
