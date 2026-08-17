import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart } from 'lucide-react';
import { Hero } from './Hero';
import { CategoryVisuals } from './CategoryVisuals';
import { FindThisHairBanner } from './FindThisHairBanner';
import { BatchTrustSection } from './BatchTrustSection';
import { PackagingUnboxingShowcase } from './PackagingUnboxingShowcase';
import { PlayStoreAppShowcase } from './PlayStoreAppShowcase';
import { ProductCard } from '../shop/ProductCard';
import { useStore } from '../../context/StoreContext';
import { MOCK_ARTICLES } from '../../data/mockData';

interface HomePageProps {
  onOpenPlayStoreModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenPlayStoreModal }) => {
  const { products, setCurrentView, setFilters, setSelectedArticleId } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'wigs' | 'bundles'>('featured');

  const displayedProducts = products
    .filter(p => {
      if (activeTab === 'wigs') return p.category === 'wigs';
      if (activeTab === 'bundles') return p.category === 'bundles';
      return true;
    })
    .slice(0, 6);

  const featuredStory = MOCK_ARTICLES[0];
  const secondaryStory = MOCK_ARTICLES[1];

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      
      {/* 1. High-Fashion Editorial Hero */}
      <Hero />

      {/* 2. Visual Category Navigation */}
      <CategoryVisuals />

      {/* 3. Featured Atelier Creations Grid with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#141414]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
              Master Atelier Curations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">
              Featured Hair Architecture
            </h2>
          </div>

          {/* Filter Sub-Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'featured', label: 'All Curations' },
              { id: 'wigs', label: 'HD Swiss Wigs' },
              { id: 'bundles', label: 'Temple Bundles' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#141414] text-white'
                    : 'bg-white text-stone-600 border border-[#141414]/10 hover:border-stone-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setCurrentView('shop');
            }}
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-xs transition-colors cursor-pointer shadow-md"
          >
            <span>Explore All 12 Creations</span>
            <ArrowRight className="w-4 h-4 text-[#B5935A]" />
          </button>
        </div>
      </section>

      {/* 4. Find This Hair Interactive Signature Feature Banner */}
      <FindThisHairBanner />

      {/* 5. Weekly Batch Supply Chain Infographic & Trust */}
      <BatchTrustSection />

      {/* 6. Luxury Packaging & Unboxing Ritual */}
      <PackagingUnboxingShowcase />

      {/* 7. Download App on Google Play Store Showcase */}
      <PlayStoreAppShowcase onOpenPlayStoreModal={onOpenPlayStoreModal} />

      {/* 8. Discover & Gazette Editorial Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
              The Vaelyrion Gazette
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium mt-1">
              Editorial & Styling Masterclass
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('discover')}
            className="text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#8E7348] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredStory && (
            <div
              onClick={() => {
                setSelectedArticleId(featuredStory.id);
                setCurrentView('discover-article');
              }}
              className="group bg-white border border-[#141414]/10 rounded-sm overflow-hidden shadow-xs hover:border-[#B5935A] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E7348]">
                  {featuredStory.category} · {featuredStory.readTime}
                </span>
                <h3 className="font-serif text-2xl text-stone-900 font-medium group-hover:text-[#8E7348] transition-colors leading-snug">
                  {featuredStory.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                  {featuredStory.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-900 group-hover:text-[#8E7348]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {secondaryStory && (
            <div
              onClick={() => {
                setSelectedArticleId(secondaryStory.id);
                setCurrentView('discover-article');
              }}
              className="group bg-white border border-[#141414]/10 rounded-sm overflow-hidden shadow-xs hover:border-[#B5935A] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={secondaryStory.image}
                  alt={secondaryStory.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E7348]">
                  {secondaryStory.category} · {secondaryStory.readTime}
                </span>
                <h3 className="font-serif text-2xl text-stone-900 font-medium group-hover:text-[#8E7348] transition-colors leading-snug">
                  {secondaryStory.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                  {secondaryStory.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-900 group-hover:text-[#8E7348]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
