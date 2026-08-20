import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, User, Search, 
  X, Menu, ChevronDown, Globe
} from 'lucide-react';
import { useStore, Currency, ViewType } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    currentView, setCurrentView, cartCount, wishlist,
    setIsCartDrawerOpen, currency, setCurrency,
    filters, setFilters
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery.trim()) {
      setCurrentView('shop');
      setIsSearchOpen(false);
    }
  };

  const navItems: { label: string; view: ViewType; category?: string }[] = [
    { label: 'Collections', view: 'shop' },
    { label: 'Wigs', view: 'shop', category: 'wigs' },
    { label: 'Bundles', view: 'shop', category: 'bundles' },
    { label: 'Discover', view: 'discover' },
    { label: 'Find Your Match', view: 'find-hair' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FAF8F5]/95 backdrop-blur-xl shadow-sm border-b border-[#141414]/8'
        : 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#141414]/6'
    }`}>
      {/* Announcement bar */}
      <div className="bg-[#171614] text-[#F7F5F0] px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#B5935A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5935A] animate-pulse" />
          <span className="text-[#E8DFC8] font-medium">THE AUGUST ATELIER RELEASE · ORDERS CLOSE SUNDAY</span>
        </div>
        <div className="w-full md:w-auto text-center font-light flex items-center justify-center gap-2">
          <span>COMPLIMENTARY INSURED DELIVERY OVER €250 · EUROPE & NORWAY</span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-5">
          
          {/* Logo */}
          <button 
            onClick={() => { setCurrentView('home'); setFilters(p => ({ ...p, category: 'all', searchQuery: '' })); }}
            className="text-left cursor-pointer focus-visible:outline-none group"
          >
            <img
              src="/brand/tanelia-logo.png"
              alt="Tanelia"
              className="brand-logo brand-logo-header w-[140px] sm:w-[220px] h-auto object-contain transition-opacity duration-300 group-hover:opacity-75"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.category) setFilters(p => ({ ...p, category: item.category as any, searchQuery: '' }));
                  setCurrentView(item.view);
                }}
                className={`text-[13px] tracking-[0.12em] uppercase font-medium transition-colors whitespace-nowrap cursor-pointer py-1 relative group ${
                  currentView === item.view ? 'text-[#141414] font-semibold' : 'text-stone-500 hover:text-[#141414]'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#B5935A] transition-all duration-300 ${
                  currentView === item.view ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="p-2 min-w-11 min-h-11 flex items-center justify-center text-stone-600 hover:text-[#171614] transition-all duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Currency */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-stone-600 hover:text-[#171614] py-2 px-2 transition-all duration-200 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#B5935A]" />
                <span>{currency}</span>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 glass border border-[#141414]/10 shadow-xl py-1.5 rounded-2xl z-50 animate-fade-in">
                  {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => { setCurrency(curr); setIsCurrencyDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-[#EFEAE4]/60 transition-colors rounded-xl mx-auto ${
                        currency === curr ? 'font-bold text-[#B5935A]' : 'text-stone-700'
                      }`}
                    >
                      <span>{curr}</span>
                      <span className="text-stone-400">{curr === 'EUR' ? '€' : curr === 'USD' ? '$' : curr === 'NOK' ? 'kr' : '£'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              aria-label="Wishlist"
              className="relative p-2 min-w-11 min-h-11 flex items-center justify-center text-stone-600 hover:text-[#171614] transition-all duration-200 cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#B5935A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => setCurrentView('account')}
              aria-label="Account"
              className="p-2 min-w-11 min-h-11 flex items-center justify-center text-stone-600 hover:text-[#171614] transition-all duration-200 cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2 min-h-11 bg-[#171614] hover:bg-[#312c25] text-[#F7F5F0] px-4 py-2.5 rounded-none transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.97] group"
            >
              <ShoppingBag className="w-4 h-4 text-[#E8DFC8]" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Bag</span>
              <span className={`text-xs font-bold min-w-5 text-center px-1.5 py-0.5 rounded-full ${
                cartCount > 0 ? 'bg-[#B5935A] text-black' : 'bg-stone-700 text-stone-300'
              }`}>
                {cartCount}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-w-11 min-h-11 p-2.5 text-stone-600 hover:text-[#141414] transition-colors cursor-pointer rounded-xl hover:bg-[#EFEAE4]/70"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FAF8F5]/98 backdrop-blur-xl border-t border-[#141414]/8 py-5 px-4 sm:px-6 animate-fade-in shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-5">
              <img
                src="/brand/tanelia-logo.png"
                alt="Tanelia"
                className="brand-logo w-[170px] sm:w-[205px] h-auto object-contain"
              />
            </div>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-4" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(p => ({ ...p, searchQuery: e.target.value }))}
                placeholder="Search the collection…"
                className="w-full glass border border-[#141414]/12 py-3.5 pl-12 pr-28 text-sm text-[#141414] placeholder-stone-400 rounded-2xl focus:outline-none focus:border-[#B5935A]/50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 bg-[#171614] text-[#F7F5F0] text-xs uppercase tracking-wider px-5 py-2.5 rounded-none hover:bg-[#333] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Popular:</span>
              {['HD Lace Wig', 'Deep Wave', 'Raw Cambodian', '613 Blonde', 'Silk Bonnet'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setFilters(p => ({ ...p, searchQuery: term })); setCurrentView('shop'); setIsSearchOpen(false); }}
                  className="glass border border-[#141414]/8 px-3 py-1 rounded-full text-[11px] text-stone-600 hover:text-[#B5935A] hover:border-[#B5935A]/30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 h-[calc(100vh-73px)] bg-[#FAF8F5]/98 backdrop-blur-xl border-t border-[#141414]/8 px-6 py-6 space-y-5 shadow-xl overflow-y-auto pb-32">
          <div className="space-y-1">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.category) setFilters(p => ({ ...p, category: item.category as any, searchQuery: '' }));
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 px-4 text-sm font-medium text-stone-700 hover:text-[#141414] hover:bg-[#EFEAE4]/60 rounded-xl transition-all uppercase tracking-widest"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#141414]/8 space-y-3">
            <div className="flex items-center justify-between py-3 px-4 bg-[#EFEAE4]/50 rounded-xl">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">Currency</span>
              <div className="flex gap-1.5">
                {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 text-xs rounded-xl border transition-all ${
                      currency === c ? 'bg-[#141414] text-white border-transparent' : 'border-[#141414]/12 text-stone-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
              className="w-full text-left py-3 px-4 text-sm font-medium text-stone-700 hover:text-[#141414] hover:bg-[#EFEAE4]/60 rounded-xl transition-all uppercase tracking-widest"
            >
              My Account
            </button>
            <button
              onClick={() => { setCurrentView('tracking'); setIsMobileMenuOpen(false); }}
              className="w-full text-left py-3 px-4 text-sm font-medium text-stone-700 hover:text-[#141414] hover:bg-[#EFEAE4]/60 rounded-xl transition-all uppercase tracking-widest"
            >
              Track My Order
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
