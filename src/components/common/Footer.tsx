import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Welcome to the Circle', 'You have been granted priority access to Batch №004 allocations.', 'gold');
      setEmail('');
    }
  };

  const pillars = [
    { title: 'Single-donor raw hair', desc: 'Cuticle-aligned temple hair, zero chemical baths.' },
    { title: 'Curated weekly batches', desc: 'Consolidated, handcrafted, air-freighted fresh.' },
    { title: 'Oslo 3PL inspection', desc: 'Individually checked, conditioned, boxed by hand.' },
    { title: '14-day lace guarantee', desc: 'Full refund while lace remains uncut and sealed.' },
  ];

  const columns: { heading: string; links: { label: string; onClick: () => void; email?: boolean }[] }[] = [
    {
      heading: 'Collections',
      links: [
        { label: 'HD Melt Swiss Wigs', onClick: () => { setFilters(p => ({ ...p, category: 'wigs' })); setCurrentView('shop'); } },
        { label: 'Raw Virgin Bundles', onClick: () => { setFilters(p => ({ ...p, category: 'bundles' })); setCurrentView('shop'); } },
        { label: '13×6 HD Frontals', onClick: () => { setFilters(p => ({ ...p, category: 'frontals' })); setCurrentView('shop'); } },
        { label: '5×5 Skin Closures', onClick: () => { setFilters(p => ({ ...p, category: 'closures' })); setCurrentView('shop'); } },
        { label: 'Seamless Clip-Ins', onClick: () => { setFilters(p => ({ ...p, category: 'extensions' })); setCurrentView('shop'); } },
        { label: 'Mulberry Silk & Care', onClick: () => { setFilters(p => ({ ...p, category: 'accessories' })); setCurrentView('shop'); } },
      ],
    },
    {
      heading: 'Experience',
      links: [
        { label: 'Find This Hair', onClick: () => setCurrentView('find-hair') },
        { label: 'Editorial & Masterclasses', onClick: () => setCurrentView('discover') },
        { label: 'The Unboxing Ritual', onClick: () => setCurrentView('home') },
        { label: 'Weekly Batch Schedule', onClick: () => setCurrentView('shipping-policy') },
        { label: 'Live Batch Tracking', onClick: () => setCurrentView('tracking') },
      ],
    },
    {
      heading: 'Client Services',
      links: [
        { label: 'Frequently Asked Questions', onClick: () => setCurrentView('faq') },
        { label: 'Shipping & Norway 3PL', onClick: () => setCurrentView('shipping-policy') },
        { label: 'Returns & Authenticity', onClick: () => setCurrentView('returns-policy') },
        { label: 'Stylist Concierge', onClick: () => { window.location.href = 'mailto:concierge@vaelyrion.com'; }, email: true },
      ],
    },
  ];

  return (
    <footer className="bg-[#F5F3EF] text-[#141414] pt-20 pb-32 lg:pb-16 border-t border-[#141414]/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Value pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pb-16 border-b border-[#141414]/12">
          {pillars.map((p, i) => (
            <div key={p.title} className="space-y-2">
              <span className="font-display text-xs font-semibold text-[#9A968F] tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="font-display text-sm font-semibold text-[#141414] leading-snug">{p.title}</h4>
              <p className="text-xs text-[#6E6B65] font-light leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 py-16">

          {/* Brand + newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-display text-3xl tracking-[0.3em] font-bold text-[#141414] pl-[0.3em] block">
              VAELYRION
            </span>
            <p className="text-sm text-[#6E6B65] font-light leading-relaxed max-w-md">
              An international house devoted to single-origin raw temple hair,
              undetectable HD Swiss lace engineering, and a sensory unboxing ceremony.
            </p>

            <div className="pt-4 max-w-md">
              <p className="eyebrow mb-3">Join the Private Pre-Order Circle</p>
              <form onSubmit={handleSubscribe} className="flex items-center border-b border-[#141414]/30 focus-within:border-[#141414] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="bg-transparent text-sm py-3 w-full focus:outline-none placeholder-[#9A968F] font-light"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="shrink-0 p-2 text-[#141414] hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#141414] mt-2 uppercase tracking-widest">Priority invitation confirmed</p>
              )}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="lg:col-span-2 space-y-4 lg:col-start-auto">
              <h5 className="eyebrow">{col.heading}</h5>
              <ul className="space-y-3 text-[13px] text-[#6E6B65] font-light">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={link.onClick} className="link-underline text-left hover:text-[#141414] transition-colors cursor-pointer">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="lg:col-span-1 space-y-4">
            <h5 className="eyebrow">Oslo HQ</h5>
            <div className="text-[13px] text-[#6E6B65] font-light leading-relaxed">
              <p>Karenslyst Allé 16</p>
              <p>0278 Oslo, Norway</p>
              <p className="mt-2 text-[#141414]">concierge@vaelyrion.com</p>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-8 border-t border-[#141414]/12 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#9A968F] font-light">
          <span className="uppercase tracking-[0.12em]">
            © {new Date().getFullYear()} Vaelyrion AS — Registered in Norway (Org. 932 401 882)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 uppercase tracking-[0.12em]">
            <span>Stripe</span>
            <span>Apple Pay</span>
            <span>Klarna</span>
            <span>Posten / Bring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
