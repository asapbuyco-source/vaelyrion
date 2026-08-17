import React from 'react';
import { 
  Home, 
  Sparkles, 
  Camera, 
  Heart, 
  ShoppingBag, 
  User, 
  Clock, 
  Search,
  Truck
} from 'lucide-react';
import { useStore, ViewType } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    wishlist, 
    setIsCartDrawerOpen,
    setFilters
  } = useStore();

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-lg border-t border-[#141414]/12 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom)+4px)] transition-all duration-300"
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        
        {/* 1. Home Button */}
        <button
          onClick={() => {
            setCurrentView('home');
            setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer relative ${
            currentView === 'home' 
              ? 'text-[#141414]' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-tight font-medium mt-1 whitespace-nowrap">Home</span>
          {currentView === 'home' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#B5935A]"></span>
          )}
        </button>

        {/* 2. Shop / Catalog Button */}
        <button
          onClick={() => {
            setCurrentView('shop');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer relative ${
            currentView === 'shop' || currentView === 'product'
              ? 'text-[#141414]' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${currentView === 'shop' || currentView === 'product' ? 'stroke-[2.5] text-[#B5935A]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-tight font-medium mt-1 whitespace-nowrap">Shop</span>
          {(currentView === 'shop' || currentView === 'product') && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#B5935A]"></span>
          )}
        </button>

        {/* 3. CENTER SIGNATURE: Find This Hair (Visual AI Scanner) */}
        <button
          onClick={() => setCurrentView('find-hair')}
          className="flex flex-col items-center justify-center -mt-5 relative group cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 border-2 ${
            currentView === 'find-hair'
              ? 'bg-[#141414] text-[#FAF8F5] border-[#B5935A] ring-4 ring-[#B5935A]/20'
              : 'bg-[#141414] text-[#FAF8F5] border-stone-800'
          }`}>
            <Camera className="w-5 h-5 text-[#E8DFC8]" />
          </div>
          <span className={`text-[10px] font-semibold tracking-tight mt-1 whitespace-nowrap ${
            currentView === 'find-hair' ? 'text-[#8E7348]' : 'text-stone-600'
          }`}>
            Find Hair
          </span>
        </button>

        {/* 4. Wishlist Button */}
        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer relative ${
            currentView === 'wishlist' 
              ? 'text-[#141414]' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'stroke-[2.5] fill-[#B5935A] text-[#B5935A]' : 'stroke-[1.75]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#B5935A] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-1 whitespace-nowrap">Wishlist</span>
          {currentView === 'wishlist' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#B5935A]"></span>
          )}
        </button>

        {/* 5. Bag / Cart Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#141414] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-1 whitespace-nowrap">Bag</span>
        </button>

      </div>
    </nav>
  );
};
