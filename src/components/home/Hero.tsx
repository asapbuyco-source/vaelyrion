import React, { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SmartImage } from '../common/SmartImage';

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] min-h-[86vh] flex items-center border-b border-[#171614]/10">

      {/* Warm, quiet foundation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F0] via-[#F1EDE6] to-[#E5DED3]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:min-h-[90vh]">
          
          {/* LEFT: Editorial Text Column */}
          <div className="space-y-8 lg:py-24">

            {/* House mark */}
            <div 
              className="inline-flex items-center gap-2.5 border-l-2 border-[#B5935A] pl-4 text-xs text-[#8E7348] font-semibold tracking-widest uppercase"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s'
              }}
            >
              Tanelia · Oslo, Norway
            </div>

            {/* Big headline */}
            <div style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s'
            }}>
              <p className="section-num mb-5">THE CURRENT COLLECTION</p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold text-[#141414] leading-[1.01] tracking-tight text-balance">
                Hair with a<br />
                <span className="italic text-[#8E7348]">natural point</span><br />
                of view.
              </h1>
            </div>

            <div style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s'
            }}>
              <p className="text-stone-500 font-light text-base leading-relaxed max-w-md">
                Single-donor hair and fine lace pieces selected for movement, density, and a natural finish. Each order is inspected and prepared in Oslo before it leaves us.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.45s'
              }}
            >
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
                  setCurrentView('shop');
                }}
                className="group flex items-center justify-center gap-2.5 bg-[#171614] hover:bg-[#312c25] text-[#F7F5F0] text-xs uppercase tracking-widest font-bold py-4 px-10 rounded-none transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 text-[#B5935A] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('contact')}
                className="btn-text-arrow py-4 px-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#B5935A]" />
                <span>Speak with the house</span>
              </button>
            </div>

            {/* Trust stats */}
            <div 
              className="pt-6 border-t border-[#141414]/8 grid grid-cols-3 gap-4"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.7s ease 0.6s'
              }}
            >
              {[
                { icon: ShieldCheck, label: 'Single-Donor Hair', sub: 'Cuticle Aligned' },
                { icon: Sparkles, label: '0.03mm Swiss Lace', sub: 'Hand-Ventilated' },
                { icon: Truck, label: 'Prepared in Oslo', sub: 'Inspected by Hand' }
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="space-y-1">
                  <Icon className="w-4 h-4 text-[#B5935A] mb-2" />
                  <p className="font-serif text-sm font-medium text-[#141414]">{label}</p>
                  <p className="text-[11px] text-stone-400 font-light">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Large editorial imagery with floating card */}
          <div 
            className="relative block lg:pl-8"
            style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'all 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s'
            }}
          >
            <div className="hidden lg:flex absolute -right-2 top-10 z-10 [writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.35em] text-[#765C35]">
              TANELIA / OSLO / 01
            </div>

            {/* Main hero image */}
            <div className="animate-settle relative overflow-hidden shadow-2xl ring-1 ring-[#9B7A4A]/45 ring-offset-8 ring-offset-[#F7F5F0]" style={{ aspectRatio: '4/5' }}>
              <SmartImage
                src="https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065153v1aY413AR8x3UMJ1_9579f0ac-9a49-4d31-a5d7-1c0927f72b21.png?width=1200"
                alt="Velvet Noir deep wave wig from the Tanelia collection"
                fallbackKind="editorial"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-3 lg:left-2 w-24 h-24 border-l border-b border-[#9B7A4A]/60 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 bg-[#171614]/85 text-[#F7F5F0] px-5 py-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em]">Velvet Noir · Deep Wave</span>
              <span className="text-[10px] text-[#C8AD7F]">Prepared in Oslo</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] text-stone-400 uppercase tracking-widest">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#B5935A]" />
        <span>Scroll</span>
      </div>
    </section>
  );
};
