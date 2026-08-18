import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { SmartImage } from '../common/SmartImage';

export const PackagingUnboxingShowcase: React.FC = () => {
  const inclusions = [
    { title: 'Matte Magnetic Box', desc: 'Heavyweight rigid, hot-stamped champagne gold foil branding.' },
    { title: 'Pure Mulberry Silk Bag', desc: 'Protects cuticles from humidity, friction, and tangling.' },
    { title: 'Velvet Hair Clips', desc: 'Salon-grade alligator clips for flawless home styling.' },
    { title: 'Atelier Certificate', desc: 'Single-donor temple origin verification + care manual.' },
  ];

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image with floating tag */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl bg-[#16150F] aspect-[4/3]">
              <SmartImage
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85"
                alt="Vaelyrion luxury packaging"
                fallbackKind="care"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-4 right-2 sm:-right-6 glass-dark rounded-2xl p-4 shadow-2xl border border-white/10 max-w-[200px]">
              <div className="flex items-center gap-2 text-[#9C7C43] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Included Free</span>
              </div>
              <p className="text-xs font-light text-stone-300 leading-relaxed">
                White-glove packaged at our Oslo 3PL facility.
              </p>
            </div>
          </div>

          {/* Right: Editorial copy */}
          <div className="space-y-6">
            <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold">
              The Unboxing Ritual
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium leading-tight">
              An Elevated Experience<br />From the First Touch
            </h2>
            <p className="text-sm text-stone-500 font-light leading-relaxed">
              We believe luxury hair deserves an uncompromising presentation. Every parcel is prepared as a personal gift — from our magnetic keepsake box to the organic argan oil conditioning performed before dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inclusions.map((item, idx) => (
                <div key={idx} className="card-float bg-white p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F3ECDF] border border-[#E4D9C1] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#9C7C43]" />
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
