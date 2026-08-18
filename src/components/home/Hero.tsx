import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Scan, ShieldCheck, Sparkles, Truck, Star } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-[#FAF8F5] min-h-[90vh] flex items-center">

      {/* Background texture / warm gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EDE8E1]" />
        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[90vh]">
          
          {/* LEFT: Editorial Text Column */}
          <div className="space-y-8 lg:py-24">

            {/* Batch badge */}
            <div 
              className="inline-flex items-center gap-2.5 glass-gold px-4 py-2 rounded-full text-xs text-[#8E7348] font-semibold tracking-widest uppercase cursor-pointer"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5935A] animate-gold-pulse" />
              Weekly Batch #003 · Allocations Open
            </div>

            {/* Big headline */}
            <div style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s'
            }}>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#141414] leading-[1.02] tracking-tight text-balance">
                Discover Your<br />
                <span className="italic text-[#8E7348]">Signature</span><br />
                Look
              </h1>
            </div>

            <div style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s'
            }}>
              <p className="text-stone-500 font-light text-base leading-relaxed max-w-md">
                Premium raw hair, ethically sourced worldwide. Handcrafted on demand,
                inspected in Oslo, delivered to your door.
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
                className="group flex items-center justify-center gap-2.5 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 text-[#B5935A] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('find-hair')}
                className="flex items-center justify-center gap-2.5 glass border border-[#141414]/12 text-[#141414] hover:border-[#B5935A]/40 text-xs uppercase tracking-widest font-semibold py-4 px-6 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                <Scan className="w-4 h-4 text-[#B5935A]" />
                <span>Find This Hair</span>
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
                { icon: ShieldCheck, label: '100% Single Donor', sub: 'Cuticle Aligned' },
                { icon: Sparkles, label: '0.03mm HD Lace', sub: 'Swiss Micro-Knot' },
                { icon: Truck, label: 'Oslo QC Hub', sub: 'Norway Inspected' }
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
            className="relative hidden lg:block"
            style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'all 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s'
            }}
          >
            {/* Main hero image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4' }}>
              <SmartImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85"
                alt="Tanelia Luxury Campaign"
                fallbackKind="editorial"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Floating product preview card */}
            <div className="absolute -bottom-6 -left-8 glass rounded-2xl p-4 shadow-xl max-w-[200px] animate-float">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                  <SmartImage 
                    src="https://cdn.shopify.com/s/files/1/2465/8681/files/2080932979095207936xsrAfr1mIeIlZkLF.png"
                    fallbackKind="hair"
                    className="w-full h-full object-cover" 
                    alt="Featured product"
                  />
                </div>
                <div>
                  <p className="font-serif text-xs font-medium leading-tight text-[#141414]">Signature HD Wig</p>
                  <p className="text-[10px] text-stone-400">26" Body Wave</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#141414]">€395</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-2.5 h-2.5 fill-[#B5935A] text-[#B5935A]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating batch badge */}
            <div className="absolute top-6 -right-4 glass-gold rounded-2xl p-3 shadow-lg">
              <p className="text-[10px] uppercase tracking-widest text-[#8E7348] font-bold">Batch #003</p>
              <p className="font-serif text-sm font-medium text-[#141414] mt-0.5">Now Open</p>
              <div className="mt-2 w-full bg-stone-200 rounded-full h-1">
                <div className="bg-[#B5935A] h-1 rounded-full" style={{ width: '68%' }} />
              </div>
              <p className="text-[9px] text-stone-400 mt-1">68% allocated</p>
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
