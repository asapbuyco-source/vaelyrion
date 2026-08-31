import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatusStep,
  TrackingEvent,
  DiscoverArticle, 
  CategoryType,
  HairTexture,
  LaceType,
  HairDensity,
  HairColor,
  AppNotification,
  UserAddress
} from '../types';
import { 
  MOCK_ARTICLES
} from '../data/mockData';
import { api } from '../lib/api';
import { lengthSurchargeEuros } from '../lib/pricing';
import { track } from '../lib/analytics';

export type Currency = 'EUR' | 'USD' | 'NOK' | 'GBP';

interface CurrencyRate {
  symbol: string;
  rate: number;
  label: string;
}

export interface SiteSettings {
  announcementPrimary: string;
  announcementSecondary: string;
  preorderBatch: string;
  newsletterBatch: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementPrimary: 'The Current Atelier Collection',
  announcementSecondary: 'Complimentary insured delivery over €250 · Europe & Norway',
  preorderBatch: 'Made to Order',
  newsletterBatch: 'the next collection',
};

const TRACKING_STEPS: OrderStatusStep[] = [
  'payment_confirmed',
  'order_received',
  'weekly_batch_created',
  'supplier_processing',
  'shipped_china',
  'international_transit',
  'arrived_norway',
  'fulfillment_center',
  'preparing_shipment',
  'shipped_customer',
  'out_for_delivery',
  'delivered'
];

const TRACKING_TEMPLATE: Array<{ step: OrderStatusStep; title: string; description: string; location: string }> = [
  { step: 'payment_confirmed', title: 'Payment Confirmed', description: 'Secure transaction processed.', location: 'Tanelia' },
  { step: 'order_received', title: 'Order Received', description: 'Your order has been reserved for you.', location: 'Tanelia Client Services' },
  { step: 'weekly_batch_created', title: 'Allocated to the Atelier', description: 'Your piece is now in preparation.', location: 'Tanelia Atelier' },
  { step: 'supplier_processing', title: 'Handcrafting in Progress', description: 'Single-knot ventilation and quality inspection in progress.', location: 'Tanelia Atelier' },
  { step: 'shipped_china', title: 'Atelier Work Complete', description: 'Your piece has left the atelier.', location: 'Tanelia Atelier' },
  { step: 'international_transit', title: 'In Transit', description: 'Your piece is travelling to Oslo.', location: 'International Transit' },
  { step: 'arrived_norway', title: 'Arrived in Oslo', description: 'Your piece has reached the Tanelia house.', location: 'Oslo, Norway' },
  { step: 'fulfillment_center', title: 'Final Inspection', description: 'Quality check, conditioning, and preparation of your box.', location: 'Tanelia, Oslo' },
  { step: 'preparing_shipment', title: 'Luxury Packaging Sealed', description: 'Silk bonnet, brass comb, authenticity card, and ribbon secured.', location: 'Tanelia, Oslo' },
  { step: 'shipped_customer', title: 'Dispatched', description: 'Tracking number assigned.', location: 'Oslo, Norway' },
  { step: 'out_for_delivery', title: 'Out for Delivery', description: 'Courier on route to your specified address.', location: 'Destination Route' },
  { step: 'delivered', title: 'Delivered', description: 'Package handed to recipient.', location: 'Recipient Address' }
];

const buildTrackingEvents = (customer: { city: string; address: string }, paymentPaid: boolean, status: string): TrackingEvent[] => {
  // status can be an uppercase server status; map to a step index
  const statusToIdx: Record<string, number> = {
    PENDING_PAYMENT: 0,
    PAID: 0,
    PROCESSING: 1,
    SHIPPED: 9,
    DELIVERED: 11
  };
  const currentIdx = paymentPaid ? Math.min(statusToIdx[status] ?? 0, 11) : 0;

  return TRACKING_TEMPLATE.map((tpl, idx) => ({
    ...tpl,
    timestamp: idx <= currentIdx ? 'Confirmed' : 'Pending',
    completed: idx <= currentIdx,
    current: idx === currentIdx,
    location: idx >= 10 && idx <= 11 ? (idx === 11 ? `${customer.address}, ${customer.city}` : customer.city) : tpl.location
  }));
};

export const buildOrderFromServer = (serverOrder: any): Order => {
  const snapshot = serverOrder.shipping_address_snapshot || {};
  const items: CartItem[] = (serverOrder.order_items || []).map((item: any) => {
    const variant = item.variant_snapshot || item.product_variants || {};
    const images: string[] = item.products?.product_images
      ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img: any) => img.image_url) || [];
    return {
      id: item.id,
      product: {
        id: item.product_id,
        title: item.product_name_snapshot || item.products?.name || 'Tanelia Creation',
        slug: item.products?.slug || '',
        subtitle: '',
        category: 'wigs',
        price: item.unit_price,
        originalPrice: item.unit_price,
        supplierCost: 0,
        rating: 5,
        reviewCount: 0,
        images,
        isPreOrder: false,
        estimatedDelivery: '10–18 business days',
        stockCount: 0,
        textures: [],
        lengths: [],
        densities: [],
        laceTypes: [],
        colors: [],
        description: '',
        hairOrigin: '',
        details: [],
        careInstructions: [],
        supplierId: ''
      },
      selectedLength: variant?.lengths?.[0] || variant?.length || 'Standard',
      selectedDensity: variant?.densities?.[0] || variant?.density || '180%',
      selectedLace: variant?.laceTypes?.[0] || variant?.lace || '13x4 HD Swiss Lace',
      selectedColor: variant?.colors?.[0] || variant?.color || 'Natural Black (#1B)',
      unitPrice: item.unit_price,
      quantity: item.quantity,
      isPreOrder: false
    };
  });

  const serverEvents = (serverOrder.tracking_events || []).map((evt: any, idx: number, arr: any[]) => {
    const step = TRACKING_STEPS.includes(evt.step) ? evt.step : (idx < TRACKING_STEPS.length ? TRACKING_STEPS[idx] : 'payment_confirmed');
    return {
      step,
      title: evt.title || step.replace(/_/g, ' '),
      description: evt.description || '',
      location: evt.location || '',
      timestamp: evt.event_time ? new Date(evt.event_time).toLocaleDateString() : 'Pending',
      completed: !!evt.completed,
      current: idx === arr.length - 1 && !!evt.completed
    } as TrackingEvent;
  });

  const trackingEvents: TrackingEvent[] = serverEvents.length > 0
    ? serverEvents
    : buildTrackingEvents(
        { city: snapshot.city || '', address: snapshot.address || '' },
        serverOrder.payment_status === 'paid',
        serverOrder.status || 'PENDING_PAYMENT'
      );

  return {
    id: serverOrder.id,
    orderNumber: serverOrder.order_number,
    date: serverOrder.created_at ? serverOrder.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    customer: {
      name: snapshot.name || '',
      email: snapshot.email || '',
      phone: snapshot.phone || '',
      address: snapshot.address || '',
      city: snapshot.city || '',
      country: snapshot.country || '',
      postalCode: snapshot.postalCode || ''
    },
    items,
    subtotal: serverOrder.subtotal || 0,
    shippingFee: serverOrder.shipping_cost || 0,
    discount: serverOrder.discount || 0,
    total: serverOrder.total || 0,
    currency: serverOrder.currency || 'EUR',
    paymentMethod: 'card',
    paymentStatus: serverOrder.payment_status === 'paid' ? 'paid' : serverOrder.payment_status === 'refunded' ? 'refunded' : 'pending',
    orderStatus: ({
      PENDING_PAYMENT: 'payment_confirmed',
      PAID: 'payment_confirmed',
      PROCESSING: 'order_received',
      SHIPPED: 'shipped_customer',
      DELIVERED: 'delivered',
      CANCELLED: 'payment_confirmed',
      REFUNDED: 'payment_confirmed'
    } as Record<string, OrderStatusStep>)[serverOrder.status || 'PENDING_PAYMENT'] || 'payment_confirmed',
    batchId: serverOrder.batch_id || '',
    trackingNumber: serverOrder.tracking_number || '',
    trackingEvents,
    estimatedDeliveryRange: '10–18 business days'
  };
};

const CURRENCY_MAP: Record<Currency, CurrencyRate> = {
  EUR: { symbol: '€', rate: 1.0, label: 'EUR (€)' },
  USD: { symbol: '$', rate: 1.08, label: 'USD ($)' },
  NOK: { symbol: 'kr ', rate: 11.6, label: 'NOK (kr)' },
  GBP: { symbol: '£', rate: 0.86, label: 'GBP (£)' },
};

export type ViewType = 
  | 'home'
  | 'shop'
  | 'product'
  | 'discover'
  | 'discover-article'
  | 'wishlist'
  | 'checkout'
  | 'order-confirmation'
  | 'tracking'
  | 'account'
  | 'about'
  | 'faq'
  | 'shipping-policy'
  | 'returns-policy'
  | 'contact'
  | 'admin';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'gold';
}

interface FilterState {
  category: CategoryType;
  texture: HairTexture | 'all';
  length: string | 'all';
  density: HairDensity | 'all';
  lace: LaceType | 'all';
  availability: 'all' | 'in-stock' | 'pre-order';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}

interface StoreContextType {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  articles: DiscoverArticle[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInEur: number) => string;

  // Catalog
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedProduct: Product | undefined;
  
  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, options: {
    length: string;
    density: HairDensity;
    lace: LaceType;
    color: HairColor;
    quantity?: number;
  }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Tracking
  orders: Order[];

  // Coupon (single source of truth is the server; code + validated discount kept here for display)
  couponCode: string;
  couponDiscount: number | null;
  applyCoupon: (code: string, subtotal: number) => Promise<{ valid: boolean; discount: number; message?: string }>;
  clearCoupon: () => void;

  // User Addresses
  savedAddresses: UserAddress[];
  addSavedAddress: (address: Omit<UserAddress, 'id'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  sendMockPushNotification: (title: string, message: string) => void;

  // Toast
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;

  // Quick Action
  openProductQuickView: (productId: string) => void;

  // Site Settings (announcement bar, batch labels)
  siteSettings: SiteSettings;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PRODUCT_CATEGORIES = ['wigs', 'bundles', 'closures', 'frontals', 'extensions', 'accessories'] as const;

const normalizeServerProduct = (raw: any): Product => {
  const category = PRODUCT_CATEGORIES.includes(raw?.category) ? raw.category : 'wigs';
  const safeArray = (value: unknown): string[] => Array.isArray(value) ? value.filter(Boolean).map(String) : [];
  const title = raw?.title || raw?.name || 'Tanelia Creation';
  const description = raw?.description || raw?.subtitle || 'A considered Tanelia creation.';

  return {
    ...raw,
    id: String(raw?.id || raw?.slug || crypto.randomUUID()),
    title,
    slug: raw?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    subtitle: raw?.subtitle || description.slice(0, 80),
    category,
    price: Number(raw?.price ?? raw?.selling_price ?? 0),
    originalPrice: raw?.originalPrice == null ? undefined : Number(raw.originalPrice),
    supplierCost: Number(raw?.supplierCost ?? 0),
    rating: Number(raw?.rating ?? 5),
    reviewCount: Number(raw?.reviewCount ?? 0),
    images: safeArray(raw?.images),
    isPreOrder: Boolean(raw?.isPreOrder ?? raw?.is_preorder),
    estimatedDelivery: raw?.estimatedDelivery || '10–18 business days',
    stockCount: Number(raw?.stockCount ?? 0),
    textures: safeArray(raw?.textures) as Product['textures'],
    lengths: safeArray(raw?.lengths),
    densities: safeArray(raw?.densities) as Product['densities'],
    laceTypes: safeArray(raw?.laceTypes) as Product['laceTypes'],
    colors: safeArray(raw?.colors) as Product['colors'],
description,
    hairOrigin: raw?.hairOrigin || '',
    seoTitle: raw?.seoTitle || undefined,
    seoDescription: raw?.seoDescription || undefined,
    details: safeArray(raw?.details),
    careInstructions: safeArray(raw?.careInstructions),
    supplierId: raw?.supplierId || ''
  };
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const productIdRef = useRef<string | null>(null);
  const articleIdRef = useRef<string | null>(null);
  const pendingProductSlugRef = useRef<string | null>(null);
  const pendingArticleSlugRef = useRef<string | null>(null);

  const [currentView, setCurrentViewState] = useState<ViewType>(() => {
    const [root, slug] = window.location.pathname.split('/').filter(Boolean);
    if (root === 'products') {
      if (slug) { pendingProductSlugRef.current = decodeURIComponent(slug); return 'product'; }
      return 'shop';
    }
    if (root === 'journal') {
      if (slug) { pendingArticleSlugRef.current = decodeURIComponent(slug); return 'discover-article'; }
      return 'discover';
    }
    const staticViews: Record<string, ViewType> = {
      'shop': 'shop', 'wishlist': 'wishlist',
      'checkout': 'checkout', 'order-confirmation': 'order-confirmation',
      'tracking': 'tracking', 'account': 'account', 'about': 'about',
      'faq': 'faq', 'contact': 'contact', 'shipping-policy': 'shipping-policy',
      'returns-policy': 'returns-policy', 'admin': 'admin'
    };
    return staticViews[root] || 'home';
  });
  const [articles, setArticles] = useState<DiscoverArticle[]>(MOCK_ARTICLES);

  useEffect(() => {
    api.content.articles()
      .then((data: any[]) => { if (data.length > 0) setArticles(data as DiscoverArticle[]); })
      .catch(() => { /* Editorial fallback remains available if the content table is not deployed yet. */ });
  }, []);
  const [selectedProductId, setSelectedProductIdState] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleIdState] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Currency
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('tanelia_currency');
      return saved === 'EUR' || saved === 'USD' || saved === 'NOK' || saved === 'GBP' ? saved : 'EUR';
    } catch {
      return 'EUR';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tanelia_currency', currency);
    } catch { /* storage unavailable */ }
  }, [currency]);

  // Site settings (announcement bar, batch labels) — editable in DB, graceful defaults
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    api.settings.get()
      .then((data: any) => {
        if (data && typeof data === 'object') {
          setSiteSettings({
            announcementPrimary: data.announcement_primary || DEFAULT_SITE_SETTINGS.announcementPrimary,
            announcementSecondary: data.announcement_secondary || DEFAULT_SITE_SETTINGS.announcementSecondary,
            preorderBatch: data.preorder_batch_label || DEFAULT_SITE_SETTINGS.preorderBatch,
            newsletterBatch: data.newsletter_batch_label || DEFAULT_SITE_SETTINGS.newsletterBatch,
          });
        }
      })
      .catch(() => { /* fall back to defaults */ });
  }, []);

  // Products - start empty, load from API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

// Fetch products from backend on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response: any = await api.products.list();
        if (cancelled) return;
        const data = Array.isArray(response) ? response : response?.products || response?.data || [];
        if (data.length > 0) {
          setProducts(data.map(normalizeServerProduct));
          return;
        }
        throw new Error('The catalog API returned no active products.');
      } catch (err: any) {
        if (cancelled) return;
        console.warn('Failed to load products from API, falling back to mock data:', err.message);
        // Fallback to mock data if API is unavailable
        import('../data/mockData').then(m => {
          if (!cancelled) setProducts(m.MOCK_PRODUCTS);
        });
      } finally {
        if (!cancelled) setIsLoadingProducts(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ---- URL routing (every view gets a real path for SEO) ----
  const setSelectedProductId = useCallback((id: string | null) => {
    productIdRef.current = id;
    setSelectedProductIdState(id);
  }, []);

  const setSelectedArticleId = useCallback((id: string | null) => {
    articleIdRef.current = id;
    setSelectedArticleIdState(id);
  }, []);

  const pathForView = (view: ViewType, productSlug?: string, articleSlug?: string): string => {
    switch (view) {
      case 'home': return '/';
      case 'shop': return '/shop';
      case 'product': return productSlug ? `/products/${productSlug}` : '/shop';
      case 'discover': return '/journal';
      case 'discover-article': return articleSlug ? `/journal/${articleSlug}` : '/journal';
      case 'wishlist': return '/wishlist';
      case 'checkout': return '/checkout';
      case 'order-confirmation': return '/order-confirmation';
      case 'tracking': return '/tracking';
      case 'account': return '/account';
      case 'about': return '/about';
      case 'faq': return '/faq';
      case 'contact': return '/contact';
      case 'shipping-policy': return '/shipping-policy';
      case 'returns-policy': return '/returns-policy';
      case 'admin': return '/admin';
    }
  };

  const setCurrentView = useCallback((view: ViewType) => {
    setCurrentViewState(view);
    const productSlug = products.find(p => p.id === productIdRef.current)?.slug;
    const articleSlug = articles.find(a => a.id === articleIdRef.current)?.slug;
    const path = pathForView(view, productSlug, articleSlug);
    if (path !== `${window.location.pathname}${window.location.search}`) {
      window.history.pushState({}, '', path);
    }
    track('page_view', { path });
    if (view === 'checkout') track('begin_checkout');
  }, [products, articles]);

  const resolvePendingSlug = useCallback(() => {
    if (pendingProductSlugRef.current && products.length > 0) {
      const match = products.find(p => p.slug === pendingProductSlugRef.current);
      pendingProductSlugRef.current = null;
      if (match) {
        productIdRef.current = match.id;
        setSelectedProductIdState(match.id);
      } else {
        setCurrentViewState('shop');
        window.history.replaceState({}, '', '/shop');
      }
    }
    if (pendingArticleSlugRef.current && articles.length > 0 && articles.some(a => 'slug' in a)) {
      const match = articles.find(a => 'slug' in a && (a as any).slug === pendingArticleSlugRef.current);
      pendingArticleSlugRef.current = null;
      if (match) {
        articleIdRef.current = match.id;
        setSelectedArticleIdState(match.id);
      } else {
        setCurrentViewState('discover');
        window.history.replaceState({}, '', '/journal');
      }
    }
  }, [products, articles]);

  useEffect(() => { resolvePendingSlug(); }, [resolvePendingSlug]);

  useEffect(() => {
    const parsePath = (pathname: string) => {
      const [root, slug] = pathname.split('/').filter(Boolean);
      if (root === 'products') {
        if (slug) { pendingProductSlugRef.current = decodeURIComponent(slug); setCurrentViewState('product'); }
        else setCurrentViewState('shop');
      } else if (root === 'journal') {
        if (slug) { pendingArticleSlugRef.current = decodeURIComponent(slug); setCurrentViewState('discover-article'); }
        else setCurrentViewState('discover');
      } else {
        const staticViews: Record<string, ViewType> = {
          'shop': 'shop', 'wishlist': 'wishlist',
          'checkout': 'checkout', 'order-confirmation': 'order-confirmation',
          'tracking': 'tracking', 'account': 'account', 'about': 'about',
          'faq': 'faq', 'contact': 'contact', 'shipping-policy': 'shipping-policy',
          'returns-policy': 'returns-policy', 'admin': 'admin'
        };
        setCurrentViewState(staticViews[root] || 'home');
      }
    };
    const onPopState = () => { parsePath(window.location.pathname); resolvePendingSlug(); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [resolvePendingSlug]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tanelia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart from API if authenticated
  useEffect(() => {
    const token = localStorage.getItem('tanelia_token');
    if (token) {
      api.cart.get()
        .then((res: any) => {
          if (res.items && res.items.length > 0) {
            const mappedCart: CartItem[] = res.items.map((item: any) => {
              const prod = item.products;
              const attrs = item.product_variants?.attributes || {};
              return {
                id: item.id,
                product: {
                  id: prod.id,
                  title: prod.name,
                  slug: prod.slug,
                  subtitle: '',
                  category: 'wigs',
                  price: prod.selling_price,
                  originalPrice: prod.selling_price,
                  supplierCost: 0,
                  rating: 5,
                  reviewCount: 0,
                  images: prod.product_images?.map((img: any) => img.image_url) || [],
                  isPreOrder: prod.is_preorder,
                  estimatedDelivery: '',
                  stockCount: 0,
                  textures: [],
                  lengths: [],
                  densities: [],
                  laceTypes: [],
                  colors: [],
                  description: '',
                  hairOrigin: '',
                  details: [],
                  careInstructions: [],
                  isNew: false,
                  isBestSeller: false,
                  supplierId: ''
                },
                selectedLength: attrs.lengths?.[0] || 'Unknown',
                selectedDensity: attrs.densities?.[0] || 'Unknown',
                selectedLace: attrs.laceTypes?.[0] || 'Unknown',
                selectedColor: attrs.colors?.[0] || 'Unknown',
                unitPrice: item.unit_price,
                quantity: item.quantity,
                isPreOrder: prod.is_preorder
              };
            });
            setCart(mappedCart);
          }
        })
        .catch(console.error);
    }
  }, []);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tanelia_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Sync orders from API if authenticated
  useEffect(() => {
    const token = localStorage.getItem('tanelia_token');
    if (!token) return;
    api.orders.list()
      .then((serverOrders: any[]) => {
        const mapped = serverOrders.map(buildOrderFromServer);
        setOrders(mapped.length > 0 ? mapped : []);
        if (mapped.length > 0) {
          setSelectedOrder(mapped[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Notifications — empty for new customers; server rows may fill this later.
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    texture: 'all',
    length: 'all',
    density: 'all',
    lace: 'all',
    availability: 'all',
    sortBy: 'featured',
    searchQuery: ''
  });

  // Coupon (server is the single source of truth)
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tanelia_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tanelia_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProductId, selectedArticleId]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatPrice = (amountInEur: number): string => {
    const { symbol, rate } = CURRENCY_MAP[currency];
    const converted = amountInEur * rate;
    if (currency === 'NOK') {
      return `${Math.round(converted).toLocaleString('no-NO')} ${symbol.trim()}`;
    }
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      texture: 'all',
      length: 'all',
      density: 'all',
      lace: 'all',
      availability: 'all',
      sortBy: 'featured',
      searchQuery: ''
    });
  };

  // Filtered Products computation
  const filteredProducts = products.filter(prod => {
    if (filters.category !== 'all') {
      if (filters.category === 'new-arrivals' && !prod.isNew) return false;
      if (filters.category === 'best-sellers' && !prod.isBestSeller) return false;
      if (['wigs', 'bundles', 'closures', 'frontals', 'extensions', 'accessories'].includes(filters.category)) {
        if (prod.category !== filters.category) return false;
      }
    }
    if (filters.texture !== 'all' && !prod.textures.includes(filters.texture)) return false;
    if (filters.length !== 'all' && !prod.lengths.includes(filters.length)) return false;
    if (filters.density !== 'all' && !prod.densities.includes(filters.density)) return false;
    if (filters.lace !== 'all' && !prod.laceTypes.includes(filters.lace)) return false;
    if (filters.availability === 'in-stock' && prod.isPreOrder) return false;
    if (filters.availability === 'pre-order' && !prod.isPreOrder) return false;
    
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchSubtitle = prod.subtitle.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      const matchOrigin = prod.hairOrigin.toLowerCase().includes(q);
      const matchTexture = prod.textures.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubtitle && !matchDesc && !matchCategory && !matchOrigin && !matchTexture) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0; // featured default
  });

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Cart operations
  const addToCart = (product: Product, options: {
    length: string;
    density: HairDensity;
    lace: LaceType;
    color: HairColor;
    quantity?: number;
  }) => {
    const qty = options.quantity || 1;
    // Display pricing mirrors the server rule (src/lib/pricing.ts ↔ server/lib/pricing.ts).
    const unitPrice = product.price + lengthSurchargeEuros(options.length);
    
    const itemId = `${product.id}-${options.length}-${options.density}-${options.lace}-${options.color}`.replace(/\s+/g, '-');
    
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + qty } : item);
      }
      const newItem: CartItem = {
        id: itemId,
        product,
        selectedLength: options.length,
        selectedDensity: options.density,
        selectedLace: options.lace,
        selectedColor: options.color,
        unitPrice,
        quantity: qty,
        isPreOrder: product.isPreOrder
      };
      return [...prev, newItem];
    });

    showToast('Added to Bag', `${product.title} (${options.length}) placed in shopping bag.`, 'gold');
    setIsCartDrawerOpen(true);
    track('add_to_cart', { productId: product.id, value: unitPrice * qty, currency: 'EUR' });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Removed from Bag', 'Item removed from your cart.', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const prod = products.find(p => p.id === productId);
      track('wishlist', { productId, value: exists ? 0 : 1 });
      if (exists) {
        showToast('Removed from Wishlist', `${prod?.title || 'Item'} removed.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', `${prod?.title || 'Item'} saved to your personal curation.`, 'gold');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = async (code: string, subtotal: number) => {
    const data: any = await api.checkout.validateCoupon(code, subtotal);
    if (data.valid) {
      setCouponCode(code.trim().toUpperCase());
      setCouponDiscount(data.discount);
    } else {
      setCouponCode('');
      setCouponDiscount(null);
    }
    return data;
  };

  const clearCoupon = () => {
    setCouponCode('');
    setCouponDiscount(null);
  };

  const addSavedAddress = (addressData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    setSavedAddresses(prev => [...prev, newAddr]);
    showToast('Address Saved', `${newAddr.name} saved to your Tanelia address book.`, 'gold');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendMockPushNotification = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type: 'order',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 ${title}`, message, 'gold');
  };

  const openProductQuickView = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
  };

  return (
    <StoreContext.Provider value={{
      currentView,
      setCurrentView,
      selectedProductId,
      setSelectedProductId,
      selectedArticleId,
      setSelectedArticleId,
      articles,
      selectedOrder,
      setSelectedOrder,
      currency,
      setCurrency,
      formatPrice,
      products,
      setProducts,
      selectedProduct,
      filters,
      setFilters,
      resetFilters,
      filteredProducts,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      couponCode,
      couponDiscount,
      applyCoupon,
      clearCoupon,
      savedAddresses,
      addSavedAddress,
      notifications,
      markNotificationRead,
      sendMockPushNotification,
      toasts,
      showToast,
      removeToast,
      openProductQuickView,
      siteSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
