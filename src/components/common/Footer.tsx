import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { useStore, ViewType } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Welcome to the Circle', 'You have been granted priority access to Batch #004 allocations.', 'gold');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#16150F] text-[#F6F3EE] pt-16 pb-32 lg:pb-12 border-t border-[#262626]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#26241A]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#9C7C43] mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#F6F3EE]">100% Single-Donor Raw Hair</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Cuticle-aligned temple hair with zero chemical baths. Retains natural vitality and movement for 2+ years.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#9C7C43] mb-1">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#F6F3EE]">Curated Weekly Batches</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Orders consolidated weekly for fresh handcrafting in China, followed by air freight to our Oslo fulfillment hub.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#9C7C43] mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#F6F3EE]">Bespoke Oslo 3PL QC</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Every unit is meticulously inspected, botanical-conditioned, and nestled into signature magnetic unboxing.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#9C7C43] mb-1">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#F6F3EE]">Uncompromised Guarantee</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              14-day lace inspection guarantee. Full refund or exchange if lace remains uncut and security seal intact.
            </p>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Brand Manifesto & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-display text-3xl tracking-[0.4em] font-medium text-[#F6F3EE]">
                VAELYRION
              </span>
              <p className="text-xs tracking-widest text-[#9C7C43] uppercase">Beyond What You Expect.</p>
            </div>
            
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-md">
              Vaelyrion is an international luxury house dedicated to single-origin raw temple hair, undetectable HD Swiss lace engineering, and sensory unboxing ceremonies.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#F6F3EE] mb-2">
                Join the Private Pre-Order Circle
              </p>
              <p className="text-xs text-stone-400 mb-3 font-light">
                Receive weekly batch drop alerts, private atelier lookbooks, and invitations to new hair drops.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-[#222222] border border-stone-700 text-[#F6F3EE] text-xs px-4 py-3 w-full rounded-l-sm focus:outline-none focus:border-[#9C7C43] placeholder-stone-500 font-light"
                />
                <button
                  type="submit"
                  className="bg-[#9C7C43] hover:bg-[#C5A880] text-black text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-r-sm transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#9C7C43] mt-2">✓ Priority invitation confirmed.</p>
              )}
            </div>
          </div>

          {/* Links Column 1: Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#9C7C43]">Collections</h5>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'wigs' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  HD Melt Swiss Wigs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'bundles' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Raw Virgin Bundles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'frontals' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  13x6 HD Frontals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'closures' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  5x5 Skin Closures
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'extensions' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Seamless Clip-Ins
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'accessories' })); setCurrentView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mulberry Silk & Care
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Experience & Model */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#9C7C43]">Experience</h5>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button 
                  onClick={() => setCurrentView('find-hair')}
                  className="hover:text-white transition-colors cursor-pointer text-[#E4D9C1]"
                >
                  Find This Hair (AI Match)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Editorial & Masterclasses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  The Unboxing Experience
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('shipping-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Weekly Batch Schedule
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Batch Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Concierge & Trust */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#9C7C43]">Client Services</h5>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button 
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('shipping-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping & Norway 3PL Transit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('returns-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Returns & Authenticity Policy
                </button>
              </li>
              <li>
                <a 
                  href="mailto:concierge@vaelyrion.com"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bespoke Stylist Concierge
                </a>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-stone-400">
                  <p className="text-stone-300 font-medium">Oslo Fulfillment HQ:</p>
                  <p>Vaelyrion Nordic Logistics Hub</p>
                  <p>Karenslyst Allé 16, 0278 Oslo, Norway</p>
                  <p className="mt-1 text-[#9C7C43]">concierge@vaelyrion.com</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Payment Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
        <div>
          © {new Date().getFullYear()} VAELYRION AS. All rights reserved. Registered in Norway (Org. nr 932 401 882).
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-[11px]">
          <span className="text-stone-400">Stripe Encrypted</span>
          <span>•</span>
          <span className="text-stone-400">Apple Pay</span>
          <span>•</span>
          <span className="text-stone-400">Klarna Verified</span>
          <span>•</span>
          <span className="text-stone-400">Posten / Bring</span>
        </div>
      </div>
    </footer>
  );
};
