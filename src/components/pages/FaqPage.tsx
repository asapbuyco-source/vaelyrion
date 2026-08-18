import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FaqPage: React.FC = () => {
  const { setCurrentView } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is 100% Raw Virgin Single-Donor Temple Hair?',
      a: 'Unlike standard commercial "remy" hair which is floor-collected from mixed brushes and chemically stripped in acid baths, Tanelia hair is sourced directly from single donors at temples in Cambodia and Southern India. All cuticles run in the exact same biological direction, preserving natural moisture, tensile strength, and authentic luster for 3–5 years.'
    },
    {
      q: 'What makes 0.03mm Swiss HD Lace completely invisible on skin?',
      a: 'Our Swiss HD lace is manufactured from ultrathin micro-filament threads imported directly from Switzerland. Measuring only 0.03mm in thickness with irregular honeycomb pores, it mimics the natural skin epidermis. When pressed against the forehead, it melts invisibly without requiring thick makeup or lace tint spray.'
    },
    {
      q: 'Why do you use a Weekly Pre-Order Batch model instead of giant warehouses?',
      a: 'Mass-market retailers store thousands of pre-made wigs in non-climate-controlled warehouses for months or years, drying out the cuticles and weakening the lace. By consolidating weekly orders on Sundays and manufacturing freshly on demand, we deliver salon-grade fresh hair while eliminating wasteful retail markup.'
    },
    {
      q: 'Can I bleach and dye Tanelia hair?',
      a: 'Yes. Because our hair has never undergone acid baths or synthetic silicone coatings, it lifts effortlessly and safely up to level 10 (#613 Pure Blonde) or rich fashion tones while retaining its soft cuticle elasticity.'
    },
    {
      q: 'Which hair density should I choose (150%, 180%, 200%, 250%)?',
      a: '• 150% Density: Natural, lightweight, mimicking a standard healthy density.\n• 180% Density (Our Most Popular): Full, luxurious red-carpet volume with natural movement.\n• 200% Density: High-glamour, full-bodied look for longer lengths (24"+).\n• 250% Density: Ultra-full editorial density for maximum red-carpet drama.'
    },
    {
      q: 'How does the "Find This Hair" visual feature work?',
      a: 'If you have a screenshot of a celebrity, runway model, or influencer style from TikTok or Instagram, simply upload the image on our "Find This Hair" page. Our visual matcher identifies strand texture, wave pattern, lace type, and recommended length to suggest the exact atelier piece.'
    },
    {
      q: 'What is included in the signature Tanelia unboxing?',
      a: 'Every wig and bundle set arrives in our matte black magnetic keepsake box, complete with a 100% pure mulberry silk storage pouch, two salon sectioning clips, an atelier origin certificate, and our organic argan oil care guide.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      <div className="bg-[#F4EFEA] border-b border-[#141414]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            Hair Knowledge & Atelier Guides
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#141414]">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto">
            Everything you need to know about our raw hair origins, Swiss HD lace, and weekly batch ordering.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#141414]/10 rounded-sm overflow-hidden shadow-xs"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif text-base font-semibold text-stone-900 hover:text-[#8E7348] transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openIdx === idx ? 'rotate-180 text-[#B5935A]' : 'text-stone-400'}`} />
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-[#141414]/6 pt-4 whitespace-pre-line">
                {faq.a}
              </div>
            )}
          </div>
        ))}

        <div className="mt-12 p-8 bg-white border border-[#141414]/10 rounded-sm text-center space-y-3 shadow-xs">
          <h4 className="font-serif text-xl text-stone-900">Have a customized styling question?</h4>
          <p className="text-xs text-stone-500 font-light max-w-md mx-auto">
            Our Oslo Concierge team of master wigmakers and colorists is available daily.
          </p>
          <button
            onClick={() => setCurrentView('account')}
            className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-xs transition-colors cursor-pointer"
          >
            Contact Stylist Concierge
          </button>
        </div>
      </div>

    </div>
  );
};
