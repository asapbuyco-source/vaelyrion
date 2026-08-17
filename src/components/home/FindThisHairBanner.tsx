import React from 'react';
import { Sparkles, Scan, ArrowRight, Upload, Camera } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FindThisHairBanner: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <section className="bg-[#141414] text-[#FAF8F5] py-16 sm:py-24 border-y border-[#262626] relative overflow-hidden">
      
      {/* Visual Accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80"
          alt="Hair visual search AI"
          className="w-full h-full object-cover mix-blend-screen"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-[#2A2A2A] border border-[#B5935A]/40 px-3.5 py-1.5 rounded-full text-xs text-[#E8DFC8] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B5935A]" />
            <span>Signature Visual AI Matcher</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            FIND THIS HAIR
          </h2>

          <p className="font-serif text-lg sm:text-xl text-[#E8DFC8] italic font-light">
            Seen a look you love? Upload a photo and we'll help you find it.
          </p>

          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl leading-relaxed">
            Whether it's a screenshot from Instagram, a TikTok trend, a Pinterest board, or a red-carpet snapshot, our intelligent visual scanner analyzes hair wave curvature, density, lace micro-knots, and origin to match you with the exact Vaelyrion atelier piece.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('find-hair')}
              className="bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg active:scale-98"
            >
              <Scan className="w-4 h-4" />
              <span>Launch Visual Search</span>
            </button>

            <button
              onClick={() => setCurrentView('find-hair')}
              className="text-stone-300 hover:text-white text-xs uppercase tracking-widest font-medium py-3 px-4 transition-colors flex items-center gap-1.5 cursor-pointer underline"
            >
              <span>Try with Sample Editorial Looks →</span>
            </button>
          </div>

        </div>
      </div>

    </section>
  );
};
