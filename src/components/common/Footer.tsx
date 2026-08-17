import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Instagram, Globe, Smartphone, QrCode } from 'lucide-react';
import { useStore, ViewType } from '../../context/StoreContext';

interface FooterProps {
  onOpenPlayStoreModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPlayStoreModal }) => {
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
    <footer className="bg-[#141414] text-[#FAF8F5] pt-16 pb-12 border-t border-[#262626]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#2A2A2A]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#B5935A] mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#FAF8F5]">100% Single-Donor Raw Hair</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Cuticle-aligned temple hair with zero chemical baths. Retains natural vitality and movement for 2+ years.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#B5935A] mb-1">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#FAF8F5]">Curated Weekly Batches</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Orders consolidated weekly for fresh handcrafting in China, followed by air freight to our Oslo fulfillment hub.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#B5935A] mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#FAF8F5]">Bespoke Oslo 3PL QC</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs font-light">
              Every unit is meticulously inspected, botanical-conditioned, and nestled into signature magnetic unboxing.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-[#B5935A] mb-1">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wide text-[#FAF8F5]">Uncompromised Guarantee</h4>
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
              <span className="font-display text-2xl tracking-[0.25em] font-semibold text-[#FAF8F5]">
                VAELYRION
              </span>
              <p className="text-xs tracking-widest text-[#B5935A] uppercase">Beyond What You Expect.</p>
            </div>
            
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-md">
              Vaelyrion is an international luxury house dedicated to single-origin raw temple hair, undetectable HD Swiss lace engineering, and sensory unboxing ceremonies.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] mb-2">
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
                  className="bg-[#222222] border border-stone-700 text-[#FAF8F5] text-xs px-4 py-3 w-full rounded-l-sm focus:outline-none focus:border-[#B5935A] placeholder-stone-500 font-light"
                />
                <button
                  type="submit"
                  className="bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-r-sm transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#B5935A] mt-2">✓ Priority invitation confirmed.</p>
              )}
            </div>

            {/* Mobile App Download Quick Badges */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Vaelyrion Atelier Mobile App
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onOpenPlayStoreModal}
                  className="flex items-center gap-2 bg-[#222222] hover:bg-[#333333] border border-stone-700 px-3 py-1.5 rounded-sm transition-colors text-left cursor-pointer group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.9L13.8 12 3.6 22.1c-.4-.3-.6-.8-.6-1.4V3.3c0-.6.2-1.1.6-1.4z"/>
                    <path fill="#FBBC04" d="M17.4 8.5L14.7 11.2l-2.7-2.7 5.4-3.1c.7-.4 1.5-.2 1.9.4.1.2.1.4.1.7 0 .4-.2.8-.5 1z"/>
                    <path fill="#0F9D58" d="M3.6 22.1l11.1-6.4 2.7 2.7-11.4 6.6c-.6.3-1.4.2-1.9-.3-.3-.2-.5-.5-.5-.6z"/>
                    <path fill="#EA4335" d="M17.4 15.5l-2.7-2.7 2.7-2.7 2.1 1.2c.6.3.8 1 .5 1.6-.1.3-.3.5-.5.6l-2.1 2z"/>
                  </svg>
                  <div>
                    <span className="block text-[8px] text-stone-400 leading-none">GET IT ON</span>
                    <span className="block text-[11px] font-semibold text-white group-hover:text-[#B5935A]">Google Play</span>
                  </div>
                </button>

                <button
                  onClick={onOpenPlayStoreModal}
                  className="flex items-center gap-2 bg-[#222222] hover:bg-[#333333] border border-stone-700 px-3 py-1.5 rounded-sm transition-colors text-left cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.71-.92 2.73 1.02.08 2.03-.49 2.63-1.22z"/>
                  </svg>
                  <div>
                    <span className="block text-[8px] text-stone-400 leading-none">DOWNLOAD ON</span>
                    <span className="block text-[11px] font-semibold text-white group-hover:text-[#B5935A]">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Links Column 1: Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#B5935A]">Collections</h5>
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
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#B5935A]">Experience</h5>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button 
                  onClick={onOpenPlayStoreModal}
                  className="hover:text-white transition-colors cursor-pointer text-[#B5935A] font-medium flex items-center gap-1"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Download Atelier App</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('find-hair')}
                  className="hover:text-white transition-colors cursor-pointer text-[#E8DFC8]"
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
                  onClick={() => setCurrentView('unboxing')}
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
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#B5935A]">Client Services</h5>
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
                <button 
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bespoke Stylist Concierge
                </button>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-stone-400">
                  <p className="text-stone-300 font-medium">Oslo Fulfillment HQ:</p>
                  <p>Vaelyrion Nordic Logistics Hub</p>
                  <p>Karenslyst Allé 16, 0278 Oslo, Norway</p>
                  <p className="mt-1 text-[#B5935A]">concierge@vaelyrion.com</p>
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

        <div className="flex items-center gap-6 text-[11px]">
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
