import React, { useEffect, useState } from 'react';
import { ArrowRight, Scan, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SmartImage } from '../common/SmartImage';

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const reveal = (delay: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.8s var(--transition-smooth) ${delay}s, transform 0.8s var(--transition-smooth) ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden bg-[#F6F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">

          {/* LEFT: Editorial column */}
          <div className="lg:col-span-6 flex flex-col justify-center py-14 lg:py-24">

            <div style={reveal(0.05)}>
              <div className="inline-flex items-center gap-2.5 text-[11px] text-[#7E6436] font-semibold tracking-[0.22em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9C7C43] animate-gold-pulse" />
                Weekly Batch #003 · Allocations Open
              </div>
            </div>

            <h1
              className="mt-7 font-serif text-[15vw] leading-[0.92] sm:text-7xl lg:text-[5.6rem] font-normal text-[#16150F] tracking-[-0.02em] text-balance"
              style={reveal(0.12)}
            >
              Beyond what
              <br />
              you <span className="italic text-[#7E6436]">expect</span>
            </h1>

            <p
              className="mt-7 text-[#6E6A5E] text-base sm:text-lg leading-relaxed max-w-md font-light"
              style={reveal(0.22)}
            >
              Single-donor raw virgin hair and undetectable HD Swiss lace —
              ethically sourced, handcrafted on demand, inspected in Oslo,
              delivered to your door.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3" style={reveal(0.3)}>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
                  setCurrentView('shop');
                }}
                className="group btn-ink flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.18em] font-semibold py-4 px-9 rounded-md cursor-pointer"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 text-[#B79A64] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('find-hair')}
                className="flex items-center justify-center gap-2.5 border border-[#16150F]/15 text-[#16150F] hover:border-[#9C7C43]/50 hover:bg-[#EFEAE2] text-[11px] uppercase tracking-[0.18em] font-semibold py-4 px-7 rounded-md transition-all duration-300 cursor-pointer"
              >
                <Scan className="w-4 h-4 text-[#9C7C43]" />
                <span>Find This Hair</span>
              </button>
            </div>

            {/* Trust row */}
            <div
              className="mt-12 pt-8 border-t border-[#16150F]/10 grid grid-cols-3 gap-5"
              style={reveal(0.4)}
            >
              {[
                { icon: ShieldCheck, label: 'Single Donor', sub: 'Cuticle aligned' },
                { icon: Sparkles, label: '0.03mm HD Lace', sub: 'Swiss micro-knot' },
                { icon: Truck, label: 'Oslo QC Hub', sub: 'Norway inspected' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label}>
                  <Icon className="w-4 h-4 text-[#9C7C43] mb-3" />
                  <p className="font-serif text-[15px] font-medium text-[#16150F] leading-tight">{label}</p>
                  <p className="text-[11px] text-[#8A8578] font-light mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Editorial image */}
          <div
            className="lg:col-span-6 relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 1s var(--transition-smooth) 0.2s, transform 1s var(--transition-smooth) 0.2s',
            }}
          >
            <div className="relative h-[62vh] min-h-[440px] lg:h-full lg:min-h-[640px] overflow-hidden rounded-md lg:rounded-none">
              <SmartImage
                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=1100&q=88"
                alt="Vaelyrion luxury hair campaign"
                fallbackKind="portrait"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16150F]/35 via-transparent to-transparent" />

              {/* Batch allocation card */}
              <div className="absolute top-6 right-6 glass-gold rounded-md p-4 w-[168px] shadow-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E6436] font-bold">Batch #003</p>
                <p className="font-serif text-lg font-medium text-[#16150F] mt-0.5">Now Open</p>
                <div className="mt-3 w-full bg-[#16150F]/10 rounded-full h-1">
                  <div className="bg-[#9C7C43] h-1 rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-[10px] text-[#6E6A5E] mt-1.5">68% allocated</p>
              </div>

              {/* Caption chip */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="text-[#F6F3EE]">
                  <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#E4D9C1]">The Sovereign</p>
                  <p className="font-serif text-2xl font-medium leading-tight">13x6 HD Melt Lace</p>
                </div>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'wigs', searchQuery: '' }));
                    setCurrentView('shop');
                  }}
                  aria-label="Shop wigs"
                  className="shrink-0 w-11 h-11 rounded-full bg-[#F6F3EE] text-[#16150F] flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
