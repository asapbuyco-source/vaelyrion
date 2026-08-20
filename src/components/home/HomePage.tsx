import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Hero } from './Hero';
import { CategoryVisuals } from './CategoryVisuals';
import { FindThisHairBanner } from './FindThisHairBanner';
import { BatchTrustSection } from './BatchTrustSection';
import { PackagingUnboxingShowcase } from './PackagingUnboxingShowcase';
import { ProductCard } from '../shop/ProductCard';
import { SmartImage } from '../common/SmartImage';
import { useStore } from '../../context/StoreContext';
import { useReveal } from '../../hooks/useReveal';
import { MOCK_ARTICLES } from '../../data/mockData';

export const HomePage: React.FC = () => {
  const { products, setCurrentView, setFilters, setSelectedArticleId } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'wigs' | 'bundles'>('featured');
  const revealRef = useReveal<HTMLDivElement>();

  const displayedProducts = products
    .filter(p => {
      if (activeTab === 'wigs') return p.category === 'wigs';
      if (activeTab === 'bundles') return p.category === 'bundles';
      return true;
    })
    .slice(0, 6);

  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const trending = products.filter(p => p.isBestSeller || p.rating >= 4.8).slice(0, 4);
  const featuredStory = MOCK_ARTICLES[0];
  const secondaryStory = MOCK_ARTICLES[1];

  return (
    <div className="bg-[#FAF8F5] min-h-screen" ref={revealRef}>

      {/* 1. Editorial Hero */}
      <Hero />

      {/* 2. Category Visual Grid */}
      <CategoryVisuals />

      {/* 2.5 Atelier Note — an editorial split, not a generic full-bleed banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] min-h-[420px] shadow-2xl">
          <div className="bg-[#171614] text-[#F7F5F0] p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <span className="section-num text-[#C8AD7F]">ATELIER NOTE · 01</span>
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl italic leading-[1.02] text-balance">
                Hair that moves like it was never touched.
              </h2>
              <div className="w-12 h-px bg-[#B5935A] my-7" />
              <p className="text-[#E8DFC8]/75 text-[11px] uppercase tracking-[0.26em] font-light">
                Single-Donor · Hand-Ventilated · Prepared in Oslo
              </p>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden bg-[#EDE8E1]">
            <SmartImage
              src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288705sGng7OjgwW8eKtnh.jpg?width=1600"
              alt="Tanelia atelier hair campaign"
              fallbackKind="editorial"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 3. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 01 · The New Release</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">New from the Atelier</h2>
            </div>
            <button
              onClick={() => { setFilters(p => ({ ...p, category: 'all' })); setCurrentView('shop'); }}
              className="btn-text-arrow hidden sm:inline-flex cursor-pointer"
            >
              <span>View All Pieces</span>
              <ArrowRight className="w-4 h-4 text-[#B5935A] transition-transform duration-300" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p, i) => (
              <div key={p.id} className={`${i === 1 ? 'lg:mt-12' : i === 3 ? 'lg:mt-6' : ''}`}>
                <ProductCard product={p} animationDelay={i * 80} priority />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Hair Architecture (with tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#141414]/8">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 02 · House Curations</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">The Signature Collection</h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'featured', label: 'All' },
              { id: 'wigs', label: 'HD Wigs' },
              { id: 'bundles', label: 'Bundles' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#171614] text-white shadow-sm'
                    : 'bg-transparent text-stone-600 hover:text-stone-900 border-b border-transparent hover:border-[#9B7A4A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} animationDelay={i * 80} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => { setFilters(p => ({ ...p, category: 'all' })); setCurrentView('shop'); }}
            className="inline-flex items-center gap-2.5 bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-bold px-10 py-4 rounded-full transition-all duration-300 cursor-pointer shadow-lg group"
          >
            <span>View the Full Collection</span>
            <ArrowRight className="w-4 h-4 text-[#B5935A] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 5. Find This Hair — Major Feature */}
      <FindThisHairBanner />

      {/* 6. Trending Now */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#141414]/8">
          <div className="reveal flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 03 · Most Requested</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">House Favourites</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((p, i) => (
              <div key={p.id} className={`${i === 1 ? 'lg:mt-10' : i === 3 ? 'lg:mt-16' : ''}`}>
                <ProductCard product={p} animationDelay={i * 80} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Tanelia Experience / Trust */}
      <BatchTrustSection />

      {/* 8. Luxury Packaging Showcase */}
      <PackagingUnboxingShowcase />

      {/* 9. Editorial / Gazette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 04 · The Journal</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">
              The Tanelia Journal
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="btn-text-arrow cursor-pointer"
          >
            <span>Read the Journal</span>
            <ArrowRight className="w-4 h-4 text-[#B5935A] transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[featuredStory, secondaryStory].filter(Boolean).map((story, i) => (
            <div
              key={story.id}
              onClick={() => { setSelectedArticleId(story.id); setCurrentView('discover-article'); }}
              className={`group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer card-float ${i === 1 ? 'md:mt-16' : ''}`}
            >
              <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B5935A]">
                  {story.category} · {story.readTime}
                </span>
                <h3 className="font-serif text-xl text-stone-900 font-medium group-hover:text-[#8E7348] transition-colors leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                  {story.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-900 group-hover:text-[#8E7348]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
