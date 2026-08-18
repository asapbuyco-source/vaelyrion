import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';
import { SmartImage } from '../common/SmartImage';

export const CategoryVisuals: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();

  const categories = [
    {
      title: 'HD Swiss Lace Wigs',
      subtitle: 'Undetectable melt — 13x6 frontals',
      category: 'wigs' as CategoryType,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
      tag: 'Most Popular',
      span: 'lg:col-span-2 lg:row-span-2'
    },
    {
      title: 'Raw Virgin Bundles',
      subtitle: 'Single-donor temple cuticle aligned',
      category: 'bundles' as CategoryType,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=85',
      tag: 'Bestseller',
      span: ''
    },
    {
      title: 'HD Frontals & Closures',
      subtitle: '0.03mm invisible skin partings',
      category: 'frontals' as CategoryType,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=85',
      tag: 'Micro Knots',
      span: ''
    },
    {
      title: 'Clip-In Extensions',
      subtitle: 'Ultra-flat polyurethane band sets',
      category: 'extensions' as CategoryType,
      image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=85',
      tag: 'Instant Volume',
      span: ''
    },
    {
      title: 'Silk & Care Kits',
      subtitle: '22-momme mulberry silk bonnets',
      category: 'accessories' as CategoryType,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=85',
      tag: 'Longevity',
      span: ''
    },
  ];

  const handleClick = (cat: CategoryType) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    setCurrentView('shop');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-2">
            Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">
            Shop By Category
          </h2>
        </div>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, category: 'all' }));
            setCurrentView('shop');
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#16150F] hover:text-[#7E6436] transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Masonry-style category grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 auto-rows-[220px] lg:auto-rows-[200px]">
        {categories.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(item.category)}
            className={`group relative overflow-hidden rounded-md cursor-pointer border border-[#16150F]/10 transition-all duration-500 ${item.span}`}
          >
            <SmartImage
              src={item.image}
              alt={item.title}
              fallbackKind="portrait"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#16150F]/80 via-[#16150F]/15 to-transparent" />

            {/* Top tag */}
            <div className="absolute top-4 left-4">
              <span className="glass-dark text-[#E4D9C1] text-[9.5px] uppercase font-semibold tracking-[0.16em] px-2.5 py-1 rounded-sm">
                {item.tag}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <h3 className="font-serif text-xl lg:text-2xl font-medium leading-tight group-hover:text-[#E4D9C1] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-stone-300 font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.subtitle}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9C7C43]">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
