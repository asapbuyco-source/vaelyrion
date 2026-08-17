import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileAppBanner } from './components/common/MobileAppBanner';
import { PlayStoreModal } from './components/common/PlayStoreModal';
import { MobileAppContainer } from './components/mobile/MobileAppContainer';

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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutPage } from './components/pages/AboutPage';
import { ShippingPolicyPage } from './components/pages/ShippingPolicyPage';
import { ReturnsPolicyPage } from './components/pages/ReturnsPolicyPage';
import { FaqPage } from './components/pages/FaqPage';

const AppContent: React.FC = () => {
  const { currentView, isAppMode } = useStore();
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Scroll to top upon navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // If user activated native Android app view mode
  if (isAppMode) {
    return (
      <div className="min-h-screen bg-stone-950 font-sans antialiased text-[#141414]">
        <MobileAppContainer />
        <PlayStoreModal 
          isOpen={isPlayStoreModalOpen} 
          onClose={() => setIsPlayStoreModalOpen(false)} 
        />
        <CartDrawer />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] font-sans antialiased flex flex-col selection:bg-[#E8DFC8] selection:text-[#141414] relative">
      
      {/* Mobile App Download Top Smart Banner */}
      {currentView !== 'checkout' && currentView !== 'admin' && (
        <MobileAppBanner onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)} />
      )}

      {/* Universal Header (hidden on Checkout & Admin for focused UX) */}
      {currentView !== 'checkout' && currentView !== 'admin' && (
        <Header onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)} />
      )}

      {/* Main Dynamic View Content (with padding on mobile for the bottom navigation bar) */}
      <main className={`flex-1 ${currentView !== 'checkout' && currentView !== 'admin' ? 'pb-16 lg:pb-0' : ''}`}>
        {currentView === 'home' && <HomePage onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)} />}
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
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'shipping-policy' && <ShippingPolicyPage />}
        {currentView === 'returns-policy' && <ReturnsPolicyPage />}
        {currentView === 'faq' && <FaqPage />}
      </main>

      {/* Universal Footer (hidden on Checkout & Admin) */}
      {currentView !== 'checkout' && currentView !== 'admin' && (
        <Footer onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)} />
      )}

      {/* Mobile Fixed Bottom Navigation Bar (hidden on Checkout & Admin) */}
      {currentView !== 'checkout' && currentView !== 'admin' && (
        <MobileBottomNav />
      )}

      {/* Google Play Store / App Store Download Modal */}
      <PlayStoreModal 
        isOpen={isPlayStoreModalOpen} 
        onClose={() => setIsPlayStoreModalOpen(false)} 
      />

      {/* Global Interactive Elements */}
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
