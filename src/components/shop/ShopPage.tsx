import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Check, 
  ChevronDown,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType, HairTexture, LaceType, HairDensity } from '../../types';
import { ProductCard } from './ProductCard';

export const ShopPage: React.FC = () => {
  const { 
    filteredProducts, 
    filters, 
    setFilters, 
    resetFilters 
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Pieces' },
    { id: 'wigs', label: 'HD Wigs' },
    { id: 'bundles', label: 'Raw Bundles' },
    { id: 'frontals', label: '13x6 Frontals' },
    { id: 'closures', label: '5x5 Closures' },
    { id: 'extensions', label: 'Clip-In Extensions' },
    { id: 'accessories', label: 'Silk Care & Kits' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'best-sellers', label: 'Best Sellers' },
  ];

  const textures: HairTexture[] = [
    'Straight', 'Body Wave', 'Deep Wave', 'Water Wave', 'Kinky Curly', 'Loose Wave', 'Silky Blunt Cut'
  ];

  const lengths = ['14 inch', '16 inch', '18 inch', '20 inch', '22 inch', '24 inch', '26 inch', '28 inch', '30 inch'];
  const densities: HairDensity[] = ['150%', '180%', '200%', '250%'];
  const laceTypes: LaceType[] = [
    '13x6 HD Lace', '13x4 HD Swiss Lace', '5x5 HD Closure', 'Transparent Lace', 'Full Lace Invisible'
  ];

  const activeFiltersCount = 
    (filters.category !== 'all' ? 1 : 0) +
    (filters.texture !== 'all' ? 1 : 0) +
    (filters.length !== 'all' ? 1 : 0) +
    (filters.density !== 'all' ? 1 : 0) +
    (filters.lace !== 'all' ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28">
      
      {/* Editorial Category Header */}
      <div className="bg-gradient-to-b from-[#F4EFEA] to-[#FAF8F5] border-b border-[#141414]/8 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold inline-block">
            The Tanelia Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#141414]">
            {filters.category === 'all' && 'The Complete Collection'}
            {filters.category === 'wigs' && 'HD Swiss Lace Wigs'}
            {filters.category === 'bundles' && 'Raw Virgin Bundles'}
            {filters.category === 'frontals' && '13x6 HD Frontals'}
            {filters.category === 'closures' && '5x5 Closures'}
            {filters.category === 'extensions' && 'Clip-In Extensions'}
            {filters.category === 'accessories' && 'Silk & Care Kits'}
            {filters.category === 'new-arrivals' && 'New Arrivals'}
            {filters.category === 'best-sellers' && 'Best Sellers'}
          </h1>
          <p className="text-sm text-stone-500 font-light max-w-md mx-auto">
            Single-donor hair, hand-finished lace, and considered care from selection to arrival.
          </p>

          {/* Category pills */}
          <div className="pt-6 flex items-center justify-center gap-2 flex-wrap pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                className={`py-2 px-5 text-xs tracking-wider uppercase font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  filters.category === cat.id
                    ? 'bg-[#141414] text-white shadow-sm'
                    : 'glass border border-[#141414]/10 text-stone-600 hover:text-stone-900 hover:border-[#141414]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Control Bar: Total count, Search indicator, Sorting, Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#141414]/10">
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-600 uppercase tracking-widest font-light">
              Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> creations
            </span>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-[#8E7348] hover:text-black transition-colors font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 py-2 px-3.5 bg-white border border-[#141414]/15 rounded-xs text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#B5935A]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#141414] text-white text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-light hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-white border border-[#141414]/15 py-2 px-3 rounded-xs text-xs text-stone-800 focus:outline-none focus:border-[#B5935A] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Drops</option>
              </select>
            </div>

          </div>

        </div>

        {/* Shop Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Desktop Filters Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
            
            {/* Availability Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                Fulfillment Status
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'in-stock', label: 'In Stock (2–4d Oslo 3PL)' },
                  { id: 'pre-order', label: 'Pre-Order (Batch #003)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilters(prev => ({ ...prev, availability: opt.id as any }))}
                    className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                      filters.availability === opt.id ? 'bg-[#F4EFEA] font-semibold text-black' : 'hover:bg-white text-stone-600'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {filters.availability === opt.id && <Check className="w-3 h-3 text-[#B5935A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Texture Filter */}
            <div className="space-y-3 pt-6 border-t border-[#141414]/8">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                Hair Texture
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, texture: 'all' }))}
                  className={`py-1 px-2.5 text-[11px] rounded-xs border transition-colors cursor-pointer ${
                    filters.texture === 'all' ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600'
                  }`}
                >
                  All Textures
                </button>
                {textures.map((tex) => (
                  <button
                    key={tex}
                    onClick={() => setFilters(prev => ({ ...prev, texture: tex }))}
                    className={`py-1 px-2.5 text-[11px] rounded-xs border transition-colors cursor-pointer ${
                      filters.texture === tex ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {tex}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Filter */}
            <div className="space-y-3 pt-6 border-t border-[#141414]/8">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                Length
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, length: 'all' }))}
                  className={`py-1 px-2 text-[11px] rounded-xs border transition-colors cursor-pointer text-center ${
                    filters.length === 'all' ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600'
                  }`}
                >
                  All
                </button>
                {lengths.map((len) => (
                  <button
                    key={len}
                    onClick={() => setFilters(prev => ({ ...prev, length: len }))}
                    className={`py-1 px-2 text-[11px] rounded-xs border font-mono transition-colors cursor-pointer text-center ${
                      filters.length === len ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {len.replace(' inch', '"')}
                  </button>
                ))}
              </div>
            </div>

            {/* Density Filter */}
            <div className="space-y-3 pt-6 border-t border-[#141414]/8">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                Density
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, density: 'all' }))}
                  className={`py-1 px-2 text-[11px] rounded-xs border transition-colors cursor-pointer text-center ${
                    filters.density === 'all' ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600'
                  }`}
                >
                  All Densities
                </button>
                {densities.map((den) => (
                  <button
                    key={den}
                    onClick={() => setFilters(prev => ({ ...prev, density: den }))}
                    className={`py-1 px-2 text-[11px] rounded-xs border transition-colors cursor-pointer text-center ${
                      filters.density === den ? 'bg-[#141414] text-white border-black font-medium' : 'bg-white border-[#141414]/10 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {den}
                  </button>
                ))}
              </div>
            </div>

            {/* Lace Architecture */}
            <div className="space-y-3 pt-6 border-t border-[#141414]/8">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                Lace Construction
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, lace: 'all' }))}
                  className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    filters.lace === 'all' ? 'bg-[#F4EFEA] font-semibold text-black' : 'hover:bg-white text-stone-600'
                  }`}
                >
                  <span>All Lace Types</span>
                  {filters.lace === 'all' && <Check className="w-3 h-3 text-[#B5935A]" />}
                </button>
                {laceTypes.map((lace) => (
                  <button
                    key={lace}
                    onClick={() => setFilters(prev => ({ ...prev, lace }))}
                    className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between transition-colors cursor-pointer text-[11px] ${
                      filters.lace === lace ? 'bg-[#F4EFEA] font-semibold text-black' : 'hover:bg-white text-stone-600'
                    }`}
                  >
                    <span className="truncate">{lace}</span>
                    {filters.lace === lace && <Check className="w-3 h-3 text-[#B5935A]" />}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Product Grid (9 cols on lg) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF5ED] flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7 text-[#B5935A]" />
                </div>
                <h3 className="font-serif text-xl text-stone-900">No matching pieces found</h3>
                <p className="text-sm text-stone-400 font-light max-w-xs mx-auto">
                  Try adjusting your filters or resetting your search.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#141414] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3 rounded-2xl hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} animationDelay={i * 50} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)]">
              
              <div className="flex items-center justify-between border-b border-[#141414]/10 pb-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">Refine Selection</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Availability */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">Fulfillment Status</h4>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'in-stock', label: 'In Stock (2–4d Oslo 3PL)' },
                    { id: 'pre-order', label: 'Pre-Order (Batch #003)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFilters(prev => ({ ...prev, availability: opt.id as any }))}
                      className={`w-full text-left py-2 px-3 rounded-xs text-xs flex justify-between ${
                        filters.availability === opt.id ? 'bg-[#141414] text-white font-medium' : 'bg-white text-stone-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Texture */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900">Texture</h4>
                <div className="flex flex-wrap gap-1.5">
                  {textures.map(tex => (
                    <button
                      key={tex}
                      onClick={() => setFilters(prev => ({ ...prev, texture: filters.texture === tex ? 'all' : tex }))}
                      className={`py-1.5 px-3 text-xs rounded-xs border ${
                        filters.texture === tex ? 'bg-[#141414] text-white' : 'bg-white text-stone-700'
                      }`}
                    >
                      {tex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply / Reset Actions */}
              <div className="pt-6 border-t border-[#141414]/10 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold border border-[#141414]/20 rounded-2xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold bg-[#141414] text-white rounded-2xl"
                >
                  View ({filteredProducts.length})
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
