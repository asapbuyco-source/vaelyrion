import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal,
  X,
  Menu,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useStore, Currency, ViewType } from '../../context/StoreContext';

interface HeaderProps {
  onOpenPlayStoreModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPlayStoreModal }) => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    wishlist, 
    setIsCartDrawerOpen, 
    currency, 
    setCurrency, 
    isAppMode, 
    setIsAppMode,
    filters,
    setFilters
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery.trim()) {
      setCurrentView('shop');
      setIsSearchOpen(false);
    }
  };

  const navItems: { label: string; view: ViewType; category?: string }[] = [
    { label: 'Shop All', view: 'shop' },
    { label: 'Wigs', view: 'shop', category: 'wigs' },
    { label: 'Bundles & Frontals', view: 'shop', category: 'bundles' },
    { label: 'Discover', view: 'discover' },
    { label: 'Find This Hair', view: 'find-hair' },
    { label: 'Weekly Batches', view: 'shipping-policy' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#141414]/8 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#141414] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-widest flex items-center justify-between border-b border-[#2A2A2A]">
        <div className="hidden md:flex items-center gap-3 text-[#B5935A]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B5935A] animate-pulse"></span>
          <span className="text-[11px] font-medium tracking-wider text-[#E8DFC8]">BATCH #003 OPEN · CUT-OFF SUN 23:59 CET</span>
        </div>
        
        <div className="w-full md:w-auto text-center font-light text-[11px] tracking-wider flex items-center justify-center gap-2">
          <span>FREE INSURED DISPATCH TO NORWAY & EUROPE OVER €250</span>
          <span className="hidden sm:inline text-[#B5935A]">•</span>
          <span className="hidden sm:inline text-[#C5A880]">100% SINGLE-DONOR RAW HAIR</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <button 
            onClick={() => setCurrentView('admin')}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Admin Suite</span>
          </button>
          <div className="h-3 w-px bg-stone-700"></div>
          <button
            onClick={() => setIsAppMode(!isAppMode)}
            className="text-[#C5A880] hover:text-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-1 font-medium"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isAppMode ? 'Web Store View' : 'Android App Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: Brand Title (Single text element) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setCurrentView('home');
                setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
              }}
              className="text-left group cursor-pointer focus-visible:outline-none"
            >
              <span className="font-display text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#141414] group-hover:text-[#8E7348] transition-colors">
                VAELYRION
              </span>
            </button>
          </div>

          {/* ZONE 2: Nav Links (1-2 word labels, single line) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.category) {
                    setFilters(prev => ({ ...prev, category: item.category as any, searchQuery: '' }));
                  }
                  setCurrentView(item.view);
                }}
                className={`text-[13px] tracking-[0.15em] uppercase font-medium transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  currentView === item.view ? 'text-[#141414] font-semibold' : 'text-[#555555] hover:text-[#141414]'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B5935A]"></span>
                )}
              </button>
            ))}
          </nav>

          {/* ZONE 3: Actions (Search, Currency, Wishlist, Account, Bag) */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="p-2 text-[#222222] hover:text-[#B5935A] transition-colors cursor-pointer rounded-full hover:bg-[#EFEAE4]/50"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#222222] hover:text-[#B5935A] py-1.5 px-2.5 rounded-md hover:bg-[#EFEAE4]/60 transition-colors cursor-pointer border border-[#141414]/10"
              >
                <Globe className="w-3.5 h-3.5 text-[#B5935A]" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#777777]" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#FAF8F5] border border-[#141414]/12 shadow-xl py-1 rounded-sm z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs tracking-wider flex items-center justify-between hover:bg-[#EFEAE4] transition-colors ${
                        currency === curr ? 'font-bold text-[#B5935A] bg-[#F4EFEA]' : 'text-[#333333]'
                      }`}
                    >
                      <span>{curr}</span>
                      <span className="text-[10px] text-stone-500">
                        {curr === 'EUR' ? '€' : curr === 'USD' ? '$' : curr === 'NOK' ? 'kr' : '£'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              aria-label="Wishlist"
              className="relative p-2 text-[#222222] hover:text-[#B5935A] transition-colors cursor-pointer rounded-full hover:bg-[#EFEAE4]/50"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#B5935A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Portal */}
            <button
              onClick={() => setCurrentView('account')}
              aria-label="Account"
              className="p-2 text-[#222222] hover:text-[#B5935A] transition-colors cursor-pointer rounded-full hover:bg-[#EFEAE4]/50"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2 bg-[#141414] text-[#FAF8F5] hover:bg-[#2A2A2A] px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-[#E8DFC8]" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Bag</span>
              <span className="text-xs font-bold bg-[#B5935A] text-black px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#222222] hover:text-[#B5935A] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-[#F4EFEA] border-t border-b border-[#141414]/10 py-4 px-4 sm:px-6 animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-[#888888] absolute left-4" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search raw wigs, HD closures, 24 inch bundles, platinum blonde..."
                className="w-full bg-white border border-[#141414]/15 py-3 pl-12 pr-24 text-sm text-[#141414] placeholder-[#888888] rounded-sm focus:outline-none focus:border-[#B5935A] transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#666666]">
              <span className="font-semibold text-[#141414]">Popular:</span>
              {['HD Melt Wig', 'Deep Wave', 'Raw Cambodian Bundles', 'Silk Bonnet', '613 Blonde', 'Pre-Order Batch'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, searchQuery: term }));
                    setCurrentView('shop');
                    setIsSearchOpen(false);
                  }}
                  className="bg-white/80 hover:bg-white border border-[#141414]/8 px-2.5 py-1 rounded-full text-[11px] text-[#444444] hover:text-[#B5935A] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-t border-[#141414]/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-3 pb-4 border-b border-[#141414]/8">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.category) {
                    setFilters(prev => ({ ...prev, category: item.category as any, searchQuery: '' }));
                  }
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm uppercase tracking-widest font-medium text-[#222222] hover:text-[#B5935A]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#141414]/8">
              <span className="text-[#666666] uppercase tracking-wider">Currency</span>
              <div className="flex gap-2">
                {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 text-xs rounded border ${
                      currency === c ? 'bg-[#141414] text-white border-black' : 'border-[#141414]/15 text-[#444444]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenPlayStoreModal) onOpenPlayStoreModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-[#141414] text-white rounded-sm font-semibold tracking-wider uppercase text-xs border border-stone-800"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M3.6 1.9L13.8 12 3.6 22.1c-.4-.3-.6-.8-.6-1.4V3.3c0-.6.2-1.1.6-1.4z"/>
                <path fill="#FBBC04" d="M17.4 8.5L14.7 11.2l-2.7-2.7 5.4-3.1c.7-.4 1.5-.2 1.9.4.1.2.1.4.1.7 0 .4-.2.8-.5 1z"/>
                <path fill="#0F9D58" d="M3.6 22.1l11.1-6.4 2.7 2.7-11.4 6.6c-.6.3-1.4.2-1.9-.3-.3-.2-.5-.5-.5-.6z"/>
                <path fill="#EA4335" d="M17.4 15.5l-2.7-2.7 2.7-2.7 2.1 1.2c.6.3.8 1 .5 1.6-.1.3-.3.5-.5.6l-2.1 2z"/>
              </svg>
              <span>Download on Google Play (4.9 ★)</span>
            </button>

            <button
              onClick={() => {
                setIsAppMode(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#F4EFEA] text-[#141414] rounded-sm font-medium tracking-wider uppercase text-xs border border-[#141414]/10"
            >
              <Smartphone className="w-4 h-4 text-[#B5935A]" />
              <span>Launch Android App View</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 text-[#666666] hover:text-[#141414] text-xs uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin Operations Hub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
