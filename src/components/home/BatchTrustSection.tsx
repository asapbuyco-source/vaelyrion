import React from 'react';
import { Package, Globe, ShieldCheck, Star, ArrowRight, Truck, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BatchTrustSection: React.FC = () => {
  const { setCurrentView } = useStore();

  const pillars = [
    {
      icon: Package,
      title: 'Premium Sourcing',
      desc: 'Single-donor raw hair ethically procured from verified temple and heritage suppliers across Asia.',
    },
    {
      icon: Globe,
      title: 'International Delivery',
      desc: 'Air-freighted weekly from our atelier, inspected and dispatched from our Oslo 3PL facility.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Checkout',
      desc: 'Stripe-powered PCI-DSS Level 1 encryption. Pay with card, Apple Pay, or Klarna installments.',
    },
    {
      icon: Clock,
      title: 'Tracked Orders',
      desc: 'Live batch tracking with SMS and push notifications at every fulfillment milestone.',
    },
  ];

  return (
    <section className="bg-[#EFEAE2] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label text-xs uppercase tracking-[0.25em] text-[#9C7C43] font-semibold mb-3 inline-block">
            Why Vaelyrion
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#16150F] font-medium">
            The Vaelyrion Experience
          </h2>
          <p className="text-stone-500 font-light text-sm mt-3 max-w-md mx-auto">
            Every detail of your order is curated for a seamless, premium experience from atelier to doorstep.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-md p-7 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="w-12 h-12 rounded-md bg-[#F3ECDF] border border-[#E4D9C1] flex items-center justify-center mb-5 group-hover:bg-[#9C7C43]/10 transition-colors">
                <Icon className="w-5 h-5 text-[#9C7C43]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#16150F] mb-2">{title}</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Batch process timeline */}
        <div className="mt-16 bg-white rounded-lg p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#9C7C43] font-semibold mb-1">How It Works</p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#16150F] font-medium">Weekly Batch Journey</h3>
            </div>
            <button
              onClick={() => setCurrentView('shipping-policy')}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#16150F] hover:text-[#7E6436] transition-colors cursor-pointer group"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-5 left-5 right-5 h-px bg-[#E4D9C1] hidden sm:block" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              {[
                { step: '01', label: 'Order Placed', desc: 'Pre-order joins Batch #003 pool' },
                { step: '02', label: 'Atelier Crafting', desc: 'Hand-knotted by master wigmakers' },
                { step: '03', label: 'Oslo QC Inspection', desc: '3PL quality check & luxury boxing' },
                { step: '04', label: 'Doorstep Delivery', desc: 'Tracked courier to your address' },
              ].map(({ step, label, desc }) => (
                <div key={step} className="relative flex flex-col items-start sm:items-center sm:text-center gap-3">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#16150F] border-4 border-[#EFEAE2] flex items-center justify-center text-[#9C7C43] font-mono text-xs font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-medium text-[#16150F]">{label}</p>
                    <p className="text-[11px] text-stone-400 font-light mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
