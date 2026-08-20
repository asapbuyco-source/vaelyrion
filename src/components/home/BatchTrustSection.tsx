import React from 'react';
import { Package, Globe, ShieldCheck, Star, ArrowRight, Truck, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BatchTrustSection: React.FC = () => {
  const { setCurrentView } = useStore();

  const pillars = [
    {
      icon: Package,
      title: 'Selected by Origin',
      desc: 'Single-donor hair chosen for its natural movement, density, and aligned cuticle.',
    },
    {
      icon: Globe,
      title: 'Prepared in Oslo',
      desc: 'Each piece is inspected, conditioned, and prepared for its journey from our Oslo house.',
    },
    {
      icon: ShieldCheck,
      title: 'Considered Service',
      desc: 'Clear delivery timelines, protected payment, and support from selection through arrival.',
    },
    {
      icon: Clock,
      title: 'A Clear Journey',
      desc: 'Follow your piece from atelier preparation to the moment it reaches your door.',
    },
  ];

  return (
    <section className="bg-[#F4EFEA] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold mb-3 inline-block">
            The House Standard
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-medium">
            From Selection to Arrival
          </h2>
          <p className="text-stone-500 font-light text-sm mt-3 max-w-md mx-auto">
            Every piece is selected, prepared, and presented with the same attention to detail—from first selection to final delivery.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="luxury-box p-7 transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-[#F4EBDD] border border-[#B5935A]/45 flex items-center justify-center mb-5 group-hover:bg-[#E8DFC8] transition-colors">
                <Icon className="w-5 h-5 text-[#B5935A]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#141414] mb-2">{title}</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Batch process timeline */}
        <div className="mt-16 luxury-box p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
            <p className="text-xs uppercase tracking-widest text-[#B5935A] font-semibold mb-1">The Journey</p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#141414] font-medium">From Atelier to Door</h3>
            </div>
            <button
              onClick={() => setCurrentView('shipping-policy')}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#8E7348] transition-colors cursor-pointer group"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-5 left-5 right-5 h-px bg-[#E8DFC8] hidden sm:block" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              {[
                { step: '01', label: 'Piece Selected', desc: 'Your order is reserved from the release' },
                { step: '02', label: 'Atelier Preparation', desc: 'Finished and checked by hand' },
                { step: '03', label: 'Oslo Inspection', desc: 'Conditioned and prepared for dispatch' },
                { step: '04', label: 'Arrival', desc: 'Delivered with care to your door' },
              ].map(({ step, label, desc }) => (
                <div key={step} className="relative flex flex-col items-start sm:items-center sm:text-center gap-3">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#141414] border-4 border-[#F4EFEA] flex items-center justify-center text-[#B5935A] font-mono text-xs font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-medium text-[#141414]">{label}</p>
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
