import React from 'react';
import { Sparkles, Gift, Check, ShieldCheck } from 'lucide-react';

export const PackagingUnboxingShowcase: React.FC = () => {
  const packagingInclusions = [
    { title: 'Matte Black Magnetic Box', desc: 'Heavyweight rigid construction with hot-stamped champagne gold foil branding.' },
    { title: '100% Pure Mulberry Silk Bag', desc: 'Protects natural hair cuticles from humidity, friction, and environmental tangling.' },
    { title: 'Dual-Tone Velvet Hair Clips', desc: 'Salon-grade alligator sectioning clips for flawless home styling and installation.' },
    { title: 'Atelier Certificate & Care Manual', desc: 'Includes single-donor temple origin verification and washing protocol.' }
  ];

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-24 overflow-hidden border-b border-[#141414]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Presentation */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-4/3 rounded-sm overflow-hidden border border-[#141414]/10 shadow-xl bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85"
                alt="Vaelyrion Luxury Packaging & Unboxing"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Luxury Tag */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#141414] text-white p-4 rounded-xs border border-[#B5935A]/50 shadow-2xl space-y-1 max-w-xs">
              <div className="flex items-center gap-2 text-[#B5935A] text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="uppercase font-semibold tracking-wider text-[10px]">Complimentary With Every Order</span>
              </div>
              <p className="text-xs font-light text-stone-300">
                Packaged at our Oslo 3PL facility under sterile white-glove inspection.
              </p>
            </div>
          </div>

          {/* Right Editorial Copy & Inclusions */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
              The Unboxing Ritual
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium leading-tight">
              An Elevated Unboxing Experience From The First Touch
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We believe luxury hair deserves an uncompromising presentation. From our custom magnetic keepsake box to the organic argan oil conditioning performed before dispatch, every parcel is prepared as a personal gift.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {packagingInclusions.map((item, idx) => (
                <div key={idx} className="p-4 bg-white border border-[#141414]/8 rounded-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FAF5ED] text-[#8E7348] text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <h4 className="font-serif text-xs font-semibold text-stone-900">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed pl-6">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
