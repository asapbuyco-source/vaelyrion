import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, User, Search, 
  X, Menu, ChevronDown
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
    { label: 'Shop All', view: 'shop' },
    { label: 'Wigs', view: 'shop', category: 'wigs' },
    { label: 'Bundles', view: 'shop', category: 'bundles' },
    { label: 'Discover', view: 'discover' },
    { label: 'Find This Hair', view: 'find-hair' },
  ];

  return (
    <header className={`sticky top-0 z-40 bg-[#F5F3EF] transition-shadow duration-300 ${
      isScrolled ? 'border-b border-[#141414]/12' : 'border-b border-transparent'
    }`}>
      {/* Announcement bar */}
      <div className="bg-[#141414] text-[#F5F3EF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center sm:justify-between gap-4">
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.28em] text-[#F5F3EF]/60">
            Batch №003 — Open through Sunday 23:59 CET
          </span>
          <span className="text-[10px] uppercase tracking-[0.28em]">
            Complimentary insured shipping over €250
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.28em] text-[#F5F3EF]/60">
            Europe &amp; Norway
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: mobile menu + desktop nav */}
          <div className="flex items-center gap-7 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              className="lg:hidden -ml-2 p-2 text-[#141414] cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.category) setFilters(p => ({ ...p, category: item.category as any, searchQuery: '' }));
                    setCurrentView(item.view);
                  }}
                  className={`link-underline text-[11px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap cursor-pointer ${
                    currentView === item.view ? 'text-[#141414] font-semibold' : 'text-[#6E6B65] hover:text-[#141414] font-medium'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Center: Wordmark */}
          <button 
            onClick={() => { setCurrentView('home'); setFilters(p => ({ ...p, category: 'all', searchQuery: '' })); }}
            className="cursor-pointer focus-visible:outline-none shrink-0"
            aria-label="Vaelyrion — Home"
          >
            <span className="font-display text-xl sm:text-2xl tracking-[0.42em] font-bold text-[#141414] pl-[0.42em]">
              VAELYRION
            </span>
          </button>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">

            {/* Currency */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#6E6B65] hover:text-[#141414] py-2 px-2 transition-colors cursor-pointer"
              >
                <span>{currency}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#141414]/12 shadow-[0_16px_40px_rgba(20,20,20,0.10)] py-1 z-50 animate-fade-in">
                  {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => { setCurrency(curr); setIsCurrencyDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-[11px] tracking-widest uppercase flex items-center justify-between hover:bg-[#F5F3EF] transition-colors ${
                        currency === curr ? 'font-semibold text-[#141414]' : 'text-[#6E6B65]'
                      }`}
                    >
                      <span>{curr}</span>
                      <span className="text-[#9A968F]">{curr === 'EUR' ? '€' : curr === 'USD' ? '$' : curr === 'NOK' ? 'kr' : '£'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="p-2.5 text-[#141414] hover:text-[#6E6B65] transition-colors cursor-pointer"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setCurrentView('wishlist')}
              aria-label="Wishlist"
              className="relative p-2.5 text-[#141414] hover:text-[#6E6B65] transition-colors cursor-pointer"
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#141414]" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('account')}
              aria-label="Account"
              className="hidden sm:block p-2.5 text-[#141414] hover:text-[#6E6B65] transition-colors cursor-pointer"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2 pl-3 pr-1 py-2 text-[#141414] cursor-pointer group"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold tabular-nums min-w-4 text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F3EF] border-t border-[#141414]/12 py-6 px-4 sm:px-6 animate-fade-in shadow-[0_24px_48px_rgba(20,20,20,0.08)]">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-[#141414]/25 focus-within:border-[#141414] transition-colors">
              <Search className="w-5 h-5 text-[#9A968F] shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(p => ({ ...p, searchQuery: e.target.value }))}
                placeholder="Search HD wigs, raw bundles, deep wave, 613 blonde…"
                className="w-full bg-transparent py-3.5 pl-4 pr-24 text-base text-[#141414] placeholder-[#9A968F] focus:outline-none font-light"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#6E6B65] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
              <span className="eyebrow">Popular</span>
              {['HD Lace Wig', 'Deep Wave', 'Raw Cambodian', '613 Blonde', 'Silk Bonnet'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setFilters(p => ({ ...p, searchQuery: term })); setCurrentView('shop'); setIsSearchOpen(false); }}
                  className="link-underline text-xs text-[#6E6B65] hover:text-[#141414] transition-colors"
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
        <div className="lg:hidden absolute top-full left-0 right-0 h-[calc(100vh-112px)] bg-[#F5F3EF] border-t border-[#141414]/12 px-6 py-8 space-y-8 overflow-y-auto pb-32">
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.category) setFilters(p => ({ ...p, category: item.category as any, searchQuery: '' }));
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 font-display text-2xl font-semibold text-[#141414] tracking-tight"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-[#141414]/12 space-y-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Currency</span>
              <div className="flex gap-4">
                {(['EUR', 'USD', 'NOK', 'GBP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`text-xs tracking-widest uppercase transition-colors ${
                      currency === c ? 'text-[#141414] font-semibold' : 'text-[#9A968F]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-[#6E6B65]"
            >
              My Account
            </button>
            <button
              onClick={() => { setCurrentView('tracking'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-xs uppercase tracking-[0.2em] font-medium text-[#6E6B65]"
            >
              Track My Order
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
