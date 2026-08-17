import React from 'react';
import { Calendar, Plane, Package, ShieldCheck, Check, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BatchTrustSection: React.FC = () => {
  const { setCurrentView } = useStore();

  const steps = [
    {
      num: '01',
      title: 'Weekly Batch Pre-Order',
      desc: 'Customers place pre-orders throughout the week. The batch locks on Sunday 23:59 CET to consolidate factory production and ensure fresh single-donor salon hair.',
      tag: 'Order Window'
    },
    {
      num: '02',
      title: 'Artisan Atelier Handcrafting',
      desc: 'Consolidated purchase orders are handcrafted at our partner ateliers in Qingdao. Each Swiss HD lace wig is hand-ventilated with single micro-knots.',
      tag: 'China Atelier'
    },
    {
      num: '03',
      title: 'Express Air Freight to Norway',
      desc: 'Finished units are flown directly to Oslo Airport (OSL) in temperature-regulated air cargo, avoiding damp freight shipping delays.',
      tag: 'Air Cargo ✈'
    },
    {
      num: '04',
      title: 'Oslo 3PL QC & Luxury Unboxing',
      desc: 'Units are thoroughly inspected in Oslo, conditioned with organic argan treatment, and packaged in signature magnetic rigid boxes with mulberry silk pouches.',
      tag: 'Norway 3PL 🇳🇴'
    },
    {
      num: '05',
      title: 'Insured Domestic Dispatch',
      desc: 'Delivered directly to your door via Posten / Bring Norway with continuous SMS tracking. Estimated delivery: 10–18 business days total.',
      tag: 'Direct Delivery'
    }
  ];

  return (
    <section className="bg-[#F4EFEA] border-y border-[#141414]/10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            Radical Supply Chain Transparency
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-medium leading-tight">
            How The Weekly Batch Model Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            By eliminating wasteful retail warehousing and building each piece on demand, we deliver authentic virgin temple hair with zero cuticle degradation.
          </p>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#141414]/8 rounded-sm p-6 space-y-3 relative shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-semibold text-[#B5935A]">{s.num}</span>
                  <span className="text-[10px] font-mono uppercase bg-[#FAF5ED] text-[#8E7348] px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                    {s.tag}
                  </span>
                </div>

                <h3 className="font-serif text-base font-semibold text-stone-900 leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#141414]/6 flex items-center gap-1.5 text-[11px] text-[#8E7348] font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Quality Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 bg-white border border-[#141414]/10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#B5935A] shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-stone-900">Current Weekly Batch: #BATCH-2026-W34</h4>
              <p className="text-xs text-stone-500 font-light">Cut-off this Sunday at 23:59 CET. Expected delivery: 10–18 business days.</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('shipping-policy')}
            className="text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#8E7348] underline transition-colors cursor-pointer shrink-0"
          >
            Read Batch Fulfillment Schedule →
          </button>
        </div>

      </div>
    </section>
  );
};
