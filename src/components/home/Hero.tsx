import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Scan } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();

  return (
    <section className="relative bg-[#141414] text-[#FAF8F5] overflow-hidden">
      
      {/* Background Editorial Visuals */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85"
          alt="Vaelyrion Luxury Campaign"
          className="w-full h-full object-cover object-top opacity-40 mix-blend-luminosity scale-105 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl space-y-6">
          
          {/* Subtle VIP Badge */}
          <div className="inline-flex items-center gap-2 bg-[#222222]/80 backdrop-blur-md border border-[#B5935A]/40 px-3.5 py-1.5 rounded-full text-xs text-[#E8DFC8] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B5935A]" />
            <span>Weekly Batch #003 Allocations Now Open</span>
          </div>

          {/* Major Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.05]">
            THE NEW COLLECTION
          </h1>

          <p className="font-serif text-xl sm:text-2xl text-[#E8DFC8] italic font-light">
            Beyond What You Expect.
          </p>

          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg leading-relaxed">
            Ethically sourced single-donor temple hair, engineered with undetectable 0.03mm Swiss HD lace. Handcrafted on demand, inspected at our Oslo 3PL facility, and delivered in signature velvet unboxing.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
                setCurrentView('shop');
              }}
              className="w-full sm:w-auto bg-[#FAF8F5] hover:bg-white text-[#141414] text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-xs transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer shadow-lg active:scale-98"
            >
              <span>Shop The Collection</span>
              <ArrowRight className="w-4 h-4 text-[#8E7348]" />
            </button>

            <button
              onClick={() => setCurrentView('find-hair')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs uppercase tracking-widest font-semibold py-4 px-6 rounded-xs transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4 text-[#B5935A]" />
              <span>Find This Hair (AI Match)</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-xs font-light text-stone-400">
            <div className="flex items-center sm:block gap-3">
              <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center sm:hidden text-[#B5935A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-serif text-sm">100% Single Donor</strong>
                <span>Temple Cuticle Aligned</span>
              </div>
            </div>
            <div className="flex items-center sm:block gap-3">
              <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center sm:hidden text-[#B5935A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-serif text-sm">0.03mm HD Swiss</strong>
                <span>Micro-Knotted Scalp Melt</span>
              </div>
            </div>
            <div className="flex items-center sm:block gap-3">
              <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center sm:hidden text-[#B5935A]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-serif text-sm">Oslo 3PL QC Hub</strong>
                <span>Inspected in Norway</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
