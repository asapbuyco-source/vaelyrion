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

const AppContent: React.FC = () => {
  const { currentView } = useStore();

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
