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

      {/* 2.5 Full-Bleed Atelier Band */}
      <section className="relative h-[52vh] min-h-[360px] lg:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4d79?auto=format&fit=crop&w=2400&q=80"
            alt="Tanelia Atelier"
            fallbackKind="editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        </div>
        <div className="reveal relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-12 lg:pb-16">
          <span className="section-num text-[#C8AD7F]">ATELIER NOTE · 01</span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF8F5] italic mt-4 max-w-3xl text-balance leading-tight">
            "Hair that moves like it was never touched."
          </h2>
          <div className="w-12 h-px bg-[#B5935A] my-6" />
          <p className="text-[#E8DFC8]/80 text-[11px] uppercase tracking-[0.3em] font-light">
            Single-Donor · Hand-Ventilated · Oslo-Inspected
          </p>
        </div>
      </section>

      {/* 3. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 01 · Just Arrived</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">New Arrivals</h2>
            </div>
            <button
              onClick={() => { setFilters(p => ({ ...p, category: 'all' })); setCurrentView('shop'); }}
              className="btn-text-arrow hidden sm:inline-flex cursor-pointer"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4 text-[#B5935A] transition-transform duration-300" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p, i) => (
              <div key={p.id} className={`reveal ${i % 2 === 1 ? 'lg:mt-10' : ''}`}>
                <ProductCard product={p} animationDelay={i * 80} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Hair Architecture (with tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#141414]/8">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 02 · Our Curations</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">Featured Collection</h2>
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
                    ? 'bg-[#141414] text-white shadow-sm'
                    : 'glass text-stone-600 hover:text-stone-900 border border-[#141414]/10'
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
            <span>Explore Full Collection</span>
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
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 03 · Most Loved</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">Trending Now</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} animationDelay={i * 80} />
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
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">No. 04 · Editorial</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">
              The Tanelia Gazette
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="btn-text-arrow cursor-pointer"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 text-[#B5935A] transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[featuredStory, secondaryStory].filter(Boolean).map((story, i) => (
            <div
              key={story.id}
              onClick={() => { setSelectedArticleId(story.id); setCurrentView('discover-article'); }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer card-float"
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
