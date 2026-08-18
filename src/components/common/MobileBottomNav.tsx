import React from 'react';
import { Home, Sparkles, Camera, Heart, ShoppingBag } from 'lucide-react';
import { useStore, ViewType } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, setCurrentView, cartCount, wishlist,
    setIsCartDrawerOpen, setFilters
  } = useStore();

  const isShopActive = currentView === 'shop' || currentView === 'product';
  const isWishlistActive = currentView === 'wishlist';
  const isFindHairActive = currentView === 'find-hair';

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-4 inset-x-4 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="nav-pill glass border border-[#16150F]/10 px-3 py-2 flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => { setCurrentView('home'); setFilters(p => ({ ...p, category: 'all', searchQuery: '' })); }}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
            currentView === 'home' ? 'text-[#16150F]' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Home className={`w-5 h-5 transition-all ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Home</span>
          {currentView === 'home' && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#9C7C43]" />}
        </button>

        {/* Shop */}
        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
            isShopActive ? 'text-[#16150F]' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Sparkles className={`w-5 h-5 transition-all ${isShopActive ? 'stroke-[2.5] text-[#9C7C43]' : 'stroke-[1.5]'}`} />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Shop</span>
        </button>

        {/* Find This Hair — Elevated center button */}
        <button
          onClick={() => setCurrentView('find-hair')}
          className="flex flex-col items-center gap-1 -mt-4 cursor-pointer group"
        >
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-active:scale-95 border-2 ${
            isFindHairActive
              ? 'bg-[#16150F] text-[#F6F3EE] border-[#9C7C43] ring-4 ring-[#9C7C43]/15'
              : 'bg-[#16150F] text-[#F6F3EE] border-stone-800 group-hover:border-[#9C7C43]/50'
          }`} style={{ width: '52px', height: '52px' }}>
            <Camera className="w-5 h-5 text-[#E4D9C1]" />
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wide ${isFindHairActive ? 'text-[#7E6436]' : 'text-stone-500'}`}>
            Find Hair
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer relative ${
            isWishlistActive ? 'text-[#16150F]' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 transition-all ${isWishlistActive ? 'stroke-[2.5] fill-[#9C7C43] text-[#9C7C43]' : 'stroke-[1.5]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#9C7C43] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-wide">Saved</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-stone-400 hover:text-stone-700 transition-all duration-200 cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#16150F] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-wide">Bag</span>
        </button>

      </div>
    </nav>
  );
};
