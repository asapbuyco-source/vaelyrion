import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  WeeklyBatch, 
  Supplier, 
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
  MOCK_PRODUCTS, 
  MOCK_BATCHES, 
  MOCK_SUPPLIERS, 
  MOCK_ARTICLES, 
  INITIAL_ORDER_SAMPLE 
} from '../data/mockData';

export type Currency = 'EUR' | 'USD' | 'NOK' | 'GBP';

interface CurrencyRate {
  symbol: string;
  rate: number;
  label: string;
}

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
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'tracking'
  | 'account'
  | 'admin'
  | 'faq'
  | 'shipping-policy'
  | 'returns-policy'
  | 'contact'
  | 'unboxing';

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
  
  // App mode (Android app simulator vs Web)
  isAppMode: boolean;
  setIsAppMode: (val: boolean) => void;
  appActiveTab: 'home' | 'shop' | 'discover' | 'orders' | 'profile';
  setAppActiveTab: (tab: 'home' | 'shop' | 'discover' | 'orders' | 'profile') => void;

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
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingEvents' | 'batchId' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: Order['orderStatus']) => void;

  // Batches (Admin & Logistics)
  batches: WeeklyBatch[];
  approveBatch: (batchId: string) => void;
  generateSupplierPO: (batchId: string) => void;
  
  // Suppliers (Admin)
  suppliers: Supplier[];
  updateSupplier: (supplier: Supplier) => void;

  // Visual Search / Find This Hair
  visualSearchResults: VisualMatchResult[] | null;
  isSearchingImage: boolean;
  performVisualSearch: (imageSrc: string) => Promise<void>;
  clearVisualSearch: () => void;

  // User & Addresses
  user: {
    name: string;
    email: string;
    phone: string;
    tier: string;
  };
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
  
  // App Mode & active Android tab
  const [isAppMode, setIsAppMode] = useState<boolean>(false);
  const [appActiveTab, setAppActiveTab] = useState<'home' | 'shop' | 'discover' | 'orders' | 'profile'>('home');

  // Currency
  const [currency, setCurrency] = useState<Currency>('EUR');

  // Products
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

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

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vaelyrion_wishlist');
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-04'];
    } catch {
      return ['prod-01', 'prod-04'];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER_SAMPLE]);

  // Batches
  const [batches, setBatches] = useState<WeeklyBatch[]>(MOCK_BATCHES);

  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

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

  // User Profile
  const [user] = useState({
    name: 'Astrid Holmsen',
    email: 'astrid.holmsen@example.no',
    phone: '+47 982 45 102',
    tier: 'Vaelyrion Black Diamond Member'
  });

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([
    {
      id: 'addr-01',
      name: 'Home (Oslo)',
      street: 'Bygdøy Allé 14B',
      city: 'Oslo',
      postalCode: '0262',
      country: 'Norway',
      isDefault: true,
      phone: '+47 982 45 102'
    },
    {
      id: 'addr-02',
      name: 'Summer House (Bergen)',
      street: 'Kalfarveien 28',
      city: 'Bergen',
      postalCode: '5018',
      country: 'Norway',
      isDefault: false,
      phone: '+47 982 45 102'
    }
  ]);

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

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingEvents' | 'batchId' | 'trackingNumber'>): Order => {
    const orderNum = `VA${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `VAE-NO-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      batchId: 'batch-003',
      trackingNumber: trackingNum,
      estimatedDeliveryRange: '10–18 business days',
      trackingEvents: [
        {
          step: 'payment_confirmed',
          title: 'Payment Confirmed',
          description: 'Secure transaction confirmed with Vaelyrion Vault.',
          location: 'Vaelyrion Commerce Engine',
          timestamp: 'Just now',
          completed: true,
          current: false
        },
        {
          step: 'order_received',
          title: 'Order Queued in Batch #BATCH-2026-W34',
          description: 'Order consolidated into this Sunday\'s supplier batch pool.',
          location: 'Operations · Oslo',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          step: 'weekly_batch_created',
          title: 'Weekly Batch PO Generation',
          description: 'Batch closes Sunday 23:59 CET for artisan dispatch.',
          location: 'Operations · Oslo',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'supplier_processing',
          title: 'Artisan Custom Handcrafting',
          description: 'Single-knot ventilation & cuticle alignment in Qingdao atelier.',
          location: 'Qingdao Atelier, China',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'shipped_china',
          title: 'Dispatched from Supplier Atelier',
          description: 'Export clearance and air cargo freight transfer.',
          location: 'Qingdao (TAO), China',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'international_transit',
          title: 'International Air Transit',
          description: 'Air freight express to Scandinavia.',
          location: 'In Flight · Air Corridor',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'arrived_norway',
          title: 'Customs Clearance in Norway',
          description: 'Arrival at Gardermoen Cargo bonded warehouse.',
          location: 'Oslo Gardermoen (OSL)',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'fulfillment_center',
          title: 'Received by Oslo 3PL Center',
          description: 'QC inspection & signature unboxing presentation.',
          location: 'Vaelyrion 3PL Center, Oslo',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'preparing_shipment',
          title: 'Vaelyrion Luxury Packaging Sealed',
          description: 'Magnetic hard box, silk bonnet, detangling comb & certificate.',
          location: 'Fulfillment Logistics, Oslo',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'shipped_customer',
          title: 'Dispatched via Posten / Bring Norway',
          description: 'Courier tracking barcode generated.',
          location: 'Posten Hub, Oslo',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'out_for_delivery',
          title: 'Out for Courier Delivery',
          description: 'Courier on final route to destination.',
          location: orderData.customer.city,
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          step: 'delivered',
          title: 'Delivered in Vaelyrion Luxury Packaging',
          description: 'Signed and completed.',
          location: `${orderData.customer.address}, ${orderData.customer.city}`,
          timestamp: 'Pending',
          completed: false,
          current: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    clearCart();

    // Notify user
    sendMockPushNotification(
      `Order Confirmed #${orderNum}`,
      `Your luxury pre-order has been registered in Batch #003. Live tracking is active.`
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    const stepOrder: Order['orderStatus'][] = [
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

    const targetIdx = stepOrder.indexOf(newStatus);

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedEvents = ord.trackingEvents.map(evt => {
          const evtIdx = stepOrder.indexOf(evt.step);
          return {
            ...evt,
            completed: evtIdx <= targetIdx,
            current: evtIdx === targetIdx,
            timestamp: evtIdx <= targetIdx ? (evt.timestamp.includes('Pending') ? 'Updated Today' : evt.timestamp) : 'Pending'
          };
        });

        return {
          ...ord,
          orderStatus: newStatus,
          trackingEvents: updatedEvents
        };
      }
      return ord;
    }));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        orderStatus: newStatus,
        trackingEvents: prev.trackingEvents.map(evt => {
          const evtIdx = stepOrder.indexOf(evt.step);
          return {
            ...evt,
            completed: evtIdx <= targetIdx,
            current: evtIdx === targetIdx,
            timestamp: evtIdx <= targetIdx ? (evt.timestamp.includes('Pending') ? 'Updated Today' : evt.timestamp) : 'Pending'
          };
        })
      } : null);
    }

    showToast('Order Status Updated', `Status changed to ${newStatus.replace(/_/g, ' ')}.`, 'gold');
  };

  // Batches operations
  const approveBatch = (batchId: string) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'supplier_processing' } : b));
    showToast('Weekly Batch Approved', 'PO transmitted to Qingdao atelier. Supplier processing begun.', 'gold');
  };

  const generateSupplierPO = (batchId: string) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'po_generated', poDocumentNumber: `PO-VAE-2026-${Math.floor(1000 + Math.random() * 9000)}` } : b));
    showToast('Supplier Purchase Order Generated', 'Batch consolidated with complete unit breakdown.', 'gold');
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
    showToast('Supplier Profile Updated', `${supplier.name} parameters saved.`, 'gold');
  };

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
      isAppMode,
      setIsAppMode,
      appActiveTab,
      setAppActiveTab,
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
      createOrder,
      updateOrderStatus,
      batches,
      approveBatch,
      generateSupplierPO,
      suppliers,
      updateSupplier,
      visualSearchResults,
      isSearchingImage,
      performVisualSearch,
      clearVisualSearch,
      user,
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
