import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  VisualMatchResult,
  AppNotification,
  UserAddress
} from '../types';
import { 
  MOCK_ARTICLES, 
  INITIAL_ORDER_SAMPLE 
} from '../data/mockData';
import { api } from '../lib/api';

export type Currency = 'EUR' | 'USD' | 'NOK' | 'GBP';

interface CurrencyRate {
  symbol: string;
  rate: number;
  label: string;
}

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
  { step: 'payment_confirmed', title: 'Payment Confirmed', description: 'Secure transaction processed via Stripe Gateway.', location: 'Vaelyrion Commerce Engine' },
  { step: 'order_received', title: 'Order Allocated to Weekly Batch', description: 'Order registered into this week\'s supplier batch pool.', location: 'Vaelyrion Operations Hub' },
  { step: 'weekly_batch_created', title: 'Weekly Batch PO Generated', description: 'Consolidated purchase order transmitted to Qingdao atelier.', location: 'Operations · Oslo' },
  { step: 'supplier_processing', title: 'Artisan Custom Handcrafting', description: 'Single-knot ventilation & cuticle alignment inspection in progress.', location: 'Qingdao Atelier, China' },
  { step: 'shipped_china', title: 'Dispatched from Supplier Atelier', description: 'Handed over to International Air Freight.', location: 'Qingdao Airport (TAO), China' },
  { step: 'international_transit', title: 'International Air Transit', description: 'Flight in transit toward Scandinavian Hub.', location: 'In Flight · International Air Corridor' },
  { step: 'arrived_norway', title: 'Customs Clearance & Arrival in Norway', description: 'Batch arrives at Gardermoen Cargo & enters bonded transfer.', location: 'Oslo Gardermoen (OSL), Norway' },
  { step: 'fulfillment_center', title: 'Received by Oslo 3PL Center', description: 'Quality QC, argan conditioning & placement into luxury box.', location: 'Vaelyrion 3PL Center, Oslo' },
  { step: 'preparing_shipment', title: 'Branded Luxury Packaging Sealed', description: 'Silk bonnet, brass comb, authenticity card & ribbon secured.', location: 'Fulfillment Logistics, Oslo' },
  { step: 'shipped_customer', title: 'Dispatched with Posten / Bring Norway', description: 'Local tracking number assigned.', location: 'Posten Hub, Oslo' },
  { step: 'out_for_delivery', title: 'Out for Courier Delivery', description: 'Courier on route to your specified address.', location: 'Destination Route' },
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
        title: item.product_name_snapshot || item.products?.name || 'Vaelyrion Creation',
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
  | 'find-hair'
  | 'wishlist'
  | 'checkout'
  | 'order-confirmation'
  | 'tracking'
  | 'account'
  | 'about'
  | 'faq'
  | 'shipping-policy'
  | 'returns-policy';

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

  // Visual Search / Find This Hair
  visualSearchResults: VisualMatchResult[] | null;
  isSearchingImage: boolean;
  performVisualSearch: (imageSrc: string) => Promise<void>;
  clearVisualSearch: () => void;

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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(INITIAL_ORDER_SAMPLE);

  // Currency
  const [currency, setCurrency] = useState<Currency>('EUR');

  // Products - start empty, load from API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products from backend on mount
  useEffect(() => {
    api.products.list()
      .then((data: any[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.warn('Failed to load products from API, falling back to mock data:', err.message);
        // Fallback to mock data if API is unavailable
        import('../data/mockData').then(m => setProducts(m.MOCK_PRODUCTS));
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vaelyrion_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart from API if authenticated
  useEffect(() => {
    const token = localStorage.getItem('vaelyrion_token');
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
      const saved = localStorage.getItem('vaelyrion_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER_SAMPLE]);

  // Sync orders from API if authenticated
  useEffect(() => {
    const token = localStorage.getItem('vaelyrion_token');
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

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-01',
      title: 'Weekly Batch #002 In Transit ✈',
      message: 'Your Sovereign HD Wig is currently aboard flight EN-882 en route to our Oslo fulfillment center.',
      timestamp: '2 hours ago',
      type: 'batch',
      read: false,
      orderId: 'ord-10245'
    },
    {
      id: 'notif-02',
      title: 'New Drop: Monarch Platinum 613',
      message: 'Cold-lifted raw temple blonde wigs are now available for Batch #003 pre-orders.',
      timestamp: '1 day ago',
      type: 'drop',
      read: true
    }
  ]);

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

  // Visual search
  const [visualSearchResults, setVisualSearchResults] = useState<VisualMatchResult[] | null>(null);
  const [isSearchingImage, setIsSearchingImage] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vaelyrion_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vaelyrion_wishlist', JSON.stringify(wishlist));
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
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
    // Calculate length price offset if length > 20"
    let lengthOffset = 0;
    const numLength = parseInt(options.length);
    if (numLength > 20) {
      lengthOffset = (numLength - 20) * 15;
    }
    const unitPrice = product.price + lengthOffset;
    
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

  // Visual Search Simulation
  const performVisualSearch = async (imageSrc: string) => {
    setIsSearchingImage(true);
    // Simulate AI Vision recognition
    await new Promise(res => setTimeout(res, 1800));

    // Curated high similarity matches based on image analysis
    const matches: VisualMatchResult[] = [
      {
        product: products[0], // Sovereign HD
        similarityScore: 98,
        matchReasons: ['Cuticle-aligned flow pattern', 'Undetectable HD lace gradient', 'Silky body wave geometry'],
        detectedTexture: 'Body Wave / Straight',
        detectedLength: '24-28 inch',
        detectedColor: 'Natural Black (#1B)'
      },
      {
        product: products[3], // Velvet Noir Glueless
        similarityScore: 92,
        matchReasons: ['Deep wave natural coil curvature', 'Natural high luster', '3D dome hairline shape'],
        detectedTexture: 'Deep Wave',
        detectedLength: '24 inch',
        detectedColor: 'Natural Black (#1B)'
      },
      {
        product: products[1], // Aura bundles
        similarityScore: 87,
        matchReasons: ['Lustrous wave frequency', 'Triple weft thickness match'],
        detectedTexture: 'Body Wave',
        detectedLength: '22-26 inch',
        detectedColor: 'Natural Black (#1B)'
      }
    ];

    setVisualSearchResults(matches);
    setIsSearchingImage(false);
    showToast('Visual Matches Found', 'Found 3 high-affinity Vaelyrion matching styles.', 'gold');
  };

  const clearVisualSearch = () => {
    setVisualSearchResults(null);
  };

  const addSavedAddress = (addressData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    setSavedAddresses(prev => [...prev, newAddr]);
    showToast('Address Saved', `${newAddr.name} saved to your Vaelyrion address book.`, 'gold');
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
      visualSearchResults,
      isSearchingImage,
      performVisualSearch,
      clearVisualSearch,
      savedAddresses,
      addSavedAddress,
      notifications,
      markNotificationRead,
      sendMockPushNotification,
      toasts,
      showToast,
      removeToast,
      openProductQuickView
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
