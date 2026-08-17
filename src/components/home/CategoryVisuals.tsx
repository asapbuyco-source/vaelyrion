import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';

export const CategoryVisuals: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();

  const visualCategories: {
    title: string;
    subtitle: string;
    category: CategoryType;
    image: string;
    tag: string;
  }[] = [
    {
      title: 'HD Swiss Lace Wigs',
      subtitle: '13x6 Melt Frontals & Glueless 3D Caps',
      category: 'wigs',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
      tag: 'Haute Craft'
    },
    {
      title: 'Raw Virgin Bundles',
      subtitle: 'Single-Donor Temple Cuticle Aligned',
      category: 'bundles',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
      tag: 'Pure Luster'
    },
    {
      title: '13x6 HD Frontals & Closures',
      subtitle: '0.03mm Invisible Skin Partings',
      category: 'frontals',
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85',
      tag: 'Micro Knots'
    },
    {
      title: 'Seamless Clip-In Extensions',
      subtitle: 'Ultra-Flat Polyurethane Band Sets',
      category: 'extensions',
      image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=85',
      tag: 'Instant Volume'
    },
    {
      title: 'Mulberry Silk & Care Kits',
      subtitle: '22-Momme Bonnets & Brass Detangling',
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85',
      tag: 'Longevity'
    }
  ];

  const handleCategoryClick = (cat: CategoryType) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    setCurrentView('shop');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium mt-1">
            Shop By Atelier Discipline
          </h2>
        </div>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, category: 'all' }));
            setCurrentView('shop');
          }}
          className="text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#8E7348] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>View Complete Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visualCategories.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(item.category)}
            className={`group relative overflow-hidden rounded-sm cursor-pointer border border-[#141414]/10 bg-stone-100 ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-16/9 lg:aspect-auto' : 'aspect-4/5'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
              <span className="bg-[#141414]/80 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs w-fit border border-white/15">
                {item.tag}
              </span>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight group-hover:text-[#E8DFC8] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-300 font-light">{item.subtitle}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B5935A]">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
