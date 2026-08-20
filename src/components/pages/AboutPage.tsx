import React from 'react';
import { Sparkles, ShieldCheck, Heart, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Brand Hero */}
      <div className="bg-[#141414] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B5935A] font-semibold">
            The House of Tanelia
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
            HAIR, CONSIDERED.
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Tanelia was founded around a simple belief: exceptional hair should feel natural, considered, and easy to trust. We pair single-donor sourcing with precise construction and a quiet Scandinavian sensibility.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Editorial Story Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-4/5 rounded-sm overflow-hidden border border-[#141414]/10 bg-stone-100 shadow-sm">
            <img
              src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288704Xp9vRzsMdgUsmQaX_3483a27a-35e4-469a-a27c-a8669c3694ec.jpg?width=1000"
              alt="Raw single-donor temple hair"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8E7348] font-semibold">The Origin</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
              Single-Donor Hair. Selected for Its Natural Movement.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We select hair for the qualities that cannot be manufactured: its natural fall, aligned cuticle, and soft, quiet sheen.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Each piece is sourced from a single donor and kept aligned from root to tip, preserving the movement and touch that make the hair feel like your own.
            </p>
          </div>
        </div>

        {/* Editorial Story Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 md:order-1 order-2">
            <span className="text-xs uppercase tracking-widest text-[#8E7348] font-semibold">The Construction</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
              Fine Swiss Lace. Hand-Ventilated for a Natural Finish.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Each frontal is hand-ventilated with fine single knots to create a soft, natural-looking hairline without a heavy edge or visible transition.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              The finished cap is shaped for a secure, comfortable fit, with adjustable bands for styling without unnecessary tension.
            </p>
          </div>
          <div className="aspect-4/5 rounded-sm overflow-hidden border border-[#141414]/10 bg-stone-100 shadow-sm md:order-2 order-1">
            <img
              src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085320187267063808XAthZtraG4AWmex5_59fc5448-331b-4270-8cd2-8dfbc8c32be3.png?width=1000"
              alt="Swiss HD Lace Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="border-t border-[#141414]/10 pt-12">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl text-stone-900">The House Standard</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#141414]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#B5935A] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">Single-Donor Hair</h4>
              <p className="text-xs text-stone-500 font-light">Selected for natural movement, aligned cuticle, and a soft finish.</p>
            </div>
            <div className="bg-white border border-[#141414]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <Truck className="w-6 h-6 text-[#B5935A] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">Oslo Preparation</h4>
              <p className="text-xs text-stone-500 font-light">Every piece is received, inspected, and prepared in Norway before delivery.</p>
            </div>
            <div className="bg-white border border-[#141414]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <Sparkles className="w-6 h-6 text-[#B5935A] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">The Arrival</h4>
              <p className="text-xs text-stone-500 font-light">Presented in a magnetic keepsake box with silk storage and considered care pieces.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-xs transition-colors cursor-pointer"
          >
            Discover The Collection
          </button>
        </div>

      </div>

    </div>
  );
};
