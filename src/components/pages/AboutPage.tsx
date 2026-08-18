import React from 'react';
import { Sparkles, ShieldCheck, Heart, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="bg-[#F6F3EE] min-h-screen pb-24">
      
      {/* Brand Hero */}
      <div className="bg-[#16150F] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#9C7C43] font-semibold">
            Brand Manifesto
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight">
            BEYOND WHAT YOU EXPECT.
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Vaelyrion was founded to dismantle the chaotic, deceptive landscape of online hair extensions and wigs with radical transparency, uncompromised craftsmanship, and Scandinavian aesthetic restraint.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Editorial Story Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-4/5 rounded-sm overflow-hidden border border-[#16150F]/10 bg-stone-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85"
              alt="Raw single-donor temple hair"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#7E6436] font-semibold">The Raw Material</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
              Single-Donor Purity. No Acid Baths. No Synthetic Blends.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Standard commercial hair is stripped in hydrochloric acid baths to remove tangling cuticles, then coated with artificial silicone that washes out in three shampoos.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Vaelyrion curates exclusively from single donors. Every strand runs in its natural biological cuticle direction, delivering an authentic 3–5 year lifespan under proper care.
            </p>
          </div>
        </div>

        {/* Editorial Story Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 md:order-1 order-2">
            <span className="text-xs uppercase tracking-widest text-[#7E6436] font-semibold">The Architecture</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
              0.03mm Micro-Ventilated Swiss HD Lace
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Our master artisans in Qingdao hand-ventilate every lace frontal using single micro-knots that melt seamlessly against all melanin skin tones without heavy concealer or demarcation lines.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Finished caps feature ergonomic 3D stretch ear contours and removable elastic bands for secure, tension-free glueless styling.
            </p>
          </div>
          <div className="aspect-4/5 rounded-sm overflow-hidden border border-[#16150F]/10 bg-stone-100 shadow-sm md:order-2 order-1">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85"
              alt="Swiss HD Lace Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="border-t border-[#16150F]/10 pt-12">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl text-stone-900">The Vaelyrion Guarantees</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#16150F]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#9C7C43] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">100% Raw Hair</h4>
              <p className="text-xs text-stone-500 font-light">Zero synthetic filler fibers or animal hair blends. Guaranteed under chemical lab testing.</p>
            </div>
            <div className="bg-white border border-[#16150F]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <Truck className="w-6 h-6 text-[#9C7C43] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">Oslo 3PL QC Hub</h4>
              <p className="text-xs text-stone-500 font-light">Every creation is received and inspected in Norway before insured courier delivery to you.</p>
            </div>
            <div className="bg-white border border-[#16150F]/8 p-6 rounded-xs space-y-2 text-center shadow-xs">
              <Sparkles className="w-6 h-6 text-[#9C7C43] mx-auto" />
              <h4 className="font-serif text-base font-semibold text-stone-900">Velvet Keepsake Box</h4>
              <p className="text-xs text-stone-500 font-light">Includes complimentary 22-momme pure mulberry silk storage bag and bespoke styling clips.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-[#16150F] hover:bg-[#26241A] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-xs transition-colors cursor-pointer"
          >
            Discover The Collection
          </button>
        </div>

      </div>

    </div>
  );
};
