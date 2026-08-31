import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Hero } from './Hero';
import { CategoryVisuals } from './CategoryVisuals';
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

      {/* 2.5 Brand Story — Beauty, Refined. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E1] order-2 lg:order-1 shadow-xl ring-1 ring-[#141414]/8">
            <SmartImage
              src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288705sGng7OjgwW8eKtnh.jpg?width=1600"
              alt="Tanelia luxury hair campaign"
              fallbackKind="editorial"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2 lg:pl-6">
            <p className="section-num">THE HOUSE</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-balance">
              Beauty, <span className="italic text-[#8E7348]">Refined.</span>
            </h2>
            <div className="w-12 h-px bg-[#B5935A]" />
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              Tanelia was founded on a simple belief — that exceptional hair should feel effortless. We select rare textures, pair them with fine Swiss lace, and finish every piece by hand, so that what arrives feels less like a purchase and more like a quiet luxury you keep.
            </p>
            <button
              onClick={() => setCurrentView('about')}
              className="btn-text-arrow cursor-pointer"
            >
              <span>Our Story</span>
              <ArrowRight className="w-4 h-4 text-[#B5935A] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">New Arrivals</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">New from the Atelier</h2>
            </div>
            <button
              onClick={() => { setFilters(p => ({ ...p, category: 'new-arrivals' })); setCurrentView('shop'); }}
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

      {/* 3.5 Featured Editorial — Made to Be Seen. */}
      <section className="relative py-24 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085320187267063808XAthZtraG4AWmex5_59fc5448-331b-4270-8cd2-8dfbc8c32be3.png?width=2000"
            alt="Tanelia editorial campaign"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-[#141414]/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#C8AD7F] font-semibold mb-3">Editorial</p>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-[1.05] text-balance">
              Made to Be Seen.
            </h2>
            <p className="text-sm sm:text-base text-[#E8DFC8]/85 font-light leading-relaxed mt-5 max-w-sm">
              Hair should not simply complement your look. It should become part of it.
            </p>
            <button
              onClick={() => { setFilters(p => ({ ...p, category: 'all' })); setCurrentView('shop'); }}
              className="mt-8 inline-flex items-center gap-2.5 border border-[#C8AD7F] text-[#F7F5F0] text-xs uppercase tracking-widest font-semibold py-4 px-10 hover:bg-[#F7F5F0] hover:text-[#141414] transition-all duration-300 cursor-pointer group"
            >
              <span>Explore Tanelia</span>
              <ArrowRight className="w-4 h-4 text-[#C8AD7F] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. The Tanelia Collection (Signature, with tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#141414]/8">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-2">Signature Collection</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">The Tanelia Collection</h2>
            <p className="text-sm text-stone-500 font-light mt-2">Curated textures. Exceptional quality. Timeless beauty.</p>
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
