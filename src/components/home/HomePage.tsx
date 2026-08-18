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
import { MOCK_ARTICLES } from '../../data/mockData';

export const HomePage: React.FC = () => {
  const { products, setCurrentView, setFilters, setSelectedArticleId } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'wigs' | 'bundles'>('featured');

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
    <div className="bg-[#F6F3EE] min-h-screen">

      {/* 1. Editorial Hero */}
      <Hero />

      {/* 2. Category Visual Grid */}
      <CategoryVisuals />

      {/* 3. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-2">Just Arrived</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">New Arrivals</h2>
            </div>
            <button
              onClick={() => { setFilters(p => ({ ...p, category: 'all' })); setCurrentView('shop'); }}
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#16150F] hover:text-[#7E6436] transition-colors cursor-pointer group"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} animationDelay={i * 80} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Hair Architecture (with tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#16150F]/8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-2">Our Curations</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">Featured Collection</h2>
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
                    ? 'bg-[#16150F] text-white shadow-sm'
                    : 'glass text-stone-600 hover:text-stone-900 border border-[#16150F]/10'
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
            className="btn-ink inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold px-10 py-4 rounded-md cursor-pointer shadow-sm group"
          >
            <span>Explore Full Collection</span>
            <ArrowRight className="w-4 h-4 text-[#B79A64] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 5. Find This Hair — Major Feature */}
      <FindThisHairBanner />

      {/* 6. Trending Now */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#16150F]/8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-2">Most Loved</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">Trending Now</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} animationDelay={i * 80} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Vaelyrion Experience / Trust */}
      <BatchTrustSection />

      {/* 8. Luxury Packaging Showcase */}
      <PackagingUnboxingShowcase />

      {/* 9. Editorial / Gazette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-2">Editorial</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">
              The Vaelyrion Gazette
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#16150F] hover:text-[#7E6436] transition-colors cursor-pointer group"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[featuredStory, secondaryStory].filter(Boolean).map((story, i) => (
            <div
              key={story.id}
              onClick={() => { setSelectedArticleId(story.id); setCurrentView('discover-article'); }}
              className="group bg-white overflow-hidden transition-all duration-500 cursor-pointer card-float"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#E6DFD4]">
                <SmartImage
                  src={story.image}
                  alt={story.title}
                  fallbackKind="editorial"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9C7C43]">
                  {story.category} · {story.readTime}
                </span>
                <h3 className="font-serif text-xl text-stone-900 font-medium group-hover:text-[#7E6436] transition-colors leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                  {story.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-900 group-hover:text-[#7E6436]">
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
