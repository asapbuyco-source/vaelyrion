import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomNav } from './components/common/MobileBottomNav';

// Pages
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { FindThisHairPage } from './components/findhair/FindThisHairPage';
import { DiscoverPage } from './components/discover/DiscoverPage';
import { ArticleDetailPage } from './components/discover/ArticleDetailPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/orders/OrderConfirmationPage';
import { OrderTrackingPage } from './components/orders/OrderTrackingPage';
import { AccountPage } from './components/account/AccountPage';
import { AboutPage } from './components/pages/AboutPage';
import { ShippingPolicyPage } from './components/pages/ShippingPolicyPage';
import { ReturnsPolicyPage } from './components/pages/ReturnsPolicyPage';
import { FaqPage } from './components/pages/FaqPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminPage } from './components/admin/AdminPage';

const AppContent: React.FC = () => {
  const { currentView, selectedProduct } = useStore();

  useEffect(() => {
    const pageMeta: Record<string, { title: string; description: string }> = {
      home: {
        title: 'Tanelia | Single-Donor Hair, Fine Swiss Lace & Care',
        description: 'Discover Tanelia hair: single-donor wigs, fine Swiss lace, raw bundles, extensions, and considered care prepared in Oslo.'
      },
      shop: {
        title: 'Shop the Tanelia Collection | Wigs, Bundles & Fine Lace',
        description: 'Explore Tanelia single-donor wigs, raw bundles, fine Swiss lace frontals, closures, extensions, and silk care pieces.'
      },
      discover: {
        title: 'The Tanelia Journal | Hair Craft, Care & Sourcing',
        description: 'Read the Tanelia Journal for thoughtful guidance on hair craft, lace construction, sourcing, styling, and care.'
      },
      'find-hair': {
        title: 'Find Your Hair Match | Tanelia',
        description: 'Share a reference image and discover the closest Tanelia texture, length, and finish for the look you have in mind.'
      },
      about: {
        title: 'About Tanelia | Hair, Considered',
        description: 'Learn how Tanelia selects single-donor hair, constructs fine Swiss lace, and prepares each piece in Oslo.'
      },
      faq: {
        title: 'Tanelia FAQ | Hair, Lace, Care & Delivery',
        description: 'Find answers about Tanelia hair origins, Swiss lace, care, release timing, delivery, and returns.'
      },
      contact: {
        title: 'Contact Tanelia | Client Services in Oslo',
        description: 'Contact Tanelia at info@tanelia.shop for help with textures, lace, sizing, delivery, and your order.'
      }
    };
    const fallback = pageMeta[currentView] || pageMeta.home;
    const title = currentView === 'product' && selectedProduct
      ? `${selectedProduct.title} | Tanelia`
      : fallback.title;
    const description = currentView === 'product' && selectedProduct
      ? selectedProduct.description
      : fallback.description;

    document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    descriptionTag?.setAttribute('content', description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;

    let schema = document.querySelector<HTMLScriptElement>('#tanelia-structured-data');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'tanelia-structured-data';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tanelia',
      url: window.location.origin,
      logo: `${window.location.origin}/brand/tanelia-favicon.png`,
      email: 'info@tanelia.shop',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Oslo',
        addressCountry: 'NO'
      },
      description: 'A modern hair house based in Oslo, dedicated to single-origin hair, fine Swiss lace, and considered care.'
    });
  }, [currentView, selectedProduct]);

  // Scroll to top upon navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const isFocusedView = currentView === 'checkout';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] font-sans antialiased flex flex-col selection:bg-[#E8DFC8] selection:text-[#141414] relative">

      {/* Universal Header (hidden on Checkout for focused UX) */}
      {!isFocusedView && <Header />}

      {/* Main Dynamic View Content (with padding on mobile for the floating bottom navigation bar) */}
      <main className={`flex-1 ${!isFocusedView ? 'pb-24 lg:pb-0' : ''}`}>
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'find-hair' && <FindThisHairPage />}
        {currentView === 'discover' && <DiscoverPage />}
        {currentView === 'discover-article' && <ArticleDetailPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'tracking' && <OrderTrackingPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'shipping-policy' && <ShippingPolicyPage />}
        {currentView === 'returns-policy' && <ReturnsPolicyPage />}
        {currentView === 'faq' && <FaqPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Universal Footer (hidden on Checkout) */}
      {!isFocusedView && <Footer />}

      {/* Mobile Fixed Bottom Navigation Bar (hidden on Checkout) */}
      {!isFocusedView && <MobileBottomNav />}

      {/* Global Interactive Elements */}
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
