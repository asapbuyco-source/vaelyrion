import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { SmartImage } from '../common/SmartImage';

export const PackagingUnboxingShowcase: React.FC = () => {
  const inclusions = [
    { title: 'Matte Magnetic Box', desc: 'A rigid keepsake box finished with the house mark in champagne foil.' },
    { title: 'Mulberry Silk Pouch', desc: 'A soft protective layer for the hair between wears.' },
    { title: 'Velvet Hair Clips', desc: 'Quietly considered tools for styling at home.' },
    { title: 'Origin Certificate', desc: 'Single-donor provenance and care notes for your piece.' },
  ];

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image with floating tag */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-stone-900 aspect-[4/3]">
              <SmartImage
                src="/brand/tanelia-care-kit.svg"
                alt="Tanelia presentation box and care accessories"
                fallbackKind="care"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-4 right-2 sm:-right-6 glass-dark rounded-2xl p-4 shadow-2xl border border-white/10 max-w-[200px]">
              <div className="flex items-center gap-2 text-[#B5935A] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">The Arrival</span>
              </div>
              <p className="text-xs font-light text-stone-300 leading-relaxed">
                Prepared in Oslo and presented as part of the Tanelia arrival.
              </p>
            </div>
          </div>

          {/* Right: Editorial copy */}
          <div className="space-y-6">
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold">
              The Arrival
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium leading-tight">
              Considered From<br />The First Touch
            </h2>
            <p className="text-sm text-stone-500 font-light leading-relaxed">
              Your piece arrives ready to be lived in. Each order is conditioned, checked, and placed in its magnetic keepsake box with the care accessories selected for its first wear.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inclusions.map((item, idx) => (
                <div key={idx} className="card-float bg-white p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FAF5ED] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#B5935A]" />
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-stone-900">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-stone-400 font-light leading-relaxed pl-7">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
