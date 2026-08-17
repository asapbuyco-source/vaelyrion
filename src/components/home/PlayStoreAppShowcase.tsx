import React, { useState } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  Camera, 
  Bell, 
  ShieldCheck, 
  QrCode, 
  Download, 
  Check, 
  Star, 
  ArrowRight,
  Plane,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PlayStoreAppShowcaseProps {
  onOpenPlayStoreModal?: () => void;
}

export const PlayStoreAppShowcase: React.FC<PlayStoreAppShowcaseProps> = ({ onOpenPlayStoreModal }) => {
  const { setIsAppMode, setCurrentView, showToast } = useStore();
  const [activeScreen, setActiveScreen] = useState<'batch' | 'vision' | 'vip'>('batch');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://play.google.com/store/apps/details?id=com.vaelyrion.atelier');
    setCopiedLink(true);
    showToast('Play Store Link Copied', 'Google Play Store URL copied to clipboard.', 'gold');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const appPerks = [
    {
      icon: Plane,
      title: 'Weekly Batch Cargo Radar',
      desc: 'Track your raw hair in real time from Qingdao single-knot ventilation to Scandinavian customs clearance at Oslo Gardermoen.'
    },
    {
      icon: Camera,
      title: 'Instant "Find This Hair" Vision Tool',
      desc: 'Point your camera at any runway, celebrity, or TikTok look to instantly match exact cuticle wave patterns and Swiss HD lace density.'
    },
    {
      icon: Flame,
      title: 'VIP Batch Drop Alerts',
      desc: 'Get push notifications 30 minutes before Sunday 23:59 CET batch allocations close and gain early access to rare #613 Platinum drops.'
    },
    {
      icon: ShieldCheck,
      title: 'NFC Untouched Lace Authenticator',
      desc: 'Scan your physical box security seal with your smartphone NFC reader to verify single-donor temple origin and warranty certificate.'
    }
  ];

  return (
    <section className="bg-[#141414] text-white py-16 sm:py-24 overflow-hidden border-b border-[#2A2A2A] relative">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B5935A]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8E7348]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#222222] border border-[#B5935A]/40 px-3 py-1 rounded-full text-xs text-[#B5935A] uppercase tracking-widest font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Atelier Architecture</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FAF8F5]">
            Download The Vaelyrion Atelier App
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-xl mx-auto">
            Available on Google Play and the App Store. Experience real-time weekly batch flight radar, instant camera AI hair matching, and private client drops directly on your smartphone.
          </p>
        </div>

        {/* Interactive App Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Phone Simulator Preview (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Device Frame */}
              <div className="bg-[#1F1F1F] p-3.5 rounded-[44px] border-4 border-[#333333] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
                
                {/* Speaker & Dynamic Island */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700"></div>
                </div>

                {/* Inner Screen */}
                <div className="bg-[#FAF8F5] text-stone-900 rounded-[34px] overflow-hidden p-4 space-y-3 min-h-[480px] flex flex-col justify-between border border-black/10">
                  
                  {/* App Header */}
                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-2">
                    <span className="font-serif font-bold text-xs tracking-widest text-[#141414]">VAELYRION</span>
                    <div className="flex items-center gap-1.5 bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#E5DAC8] text-[9px] font-semibold text-[#8E7348]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E7348] animate-pulse"></span>
                      <span>BATCH #003 RADAR</span>
                    </div>
                  </div>

                  {/* Screen Content Tabs Selector inside Mockup */}
                  <div className="flex bg-[#EFEAE4] p-1 rounded-sm gap-1">
                    <button
                      onClick={() => setActiveScreen('batch')}
                      className={`flex-1 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                        activeScreen === 'batch' ? 'bg-[#141414] text-white shadow-xs' : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      Flight Radar
                    </button>
                    <button
                      onClick={() => setActiveScreen('vision')}
                      className={`flex-1 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                        activeScreen === 'vision' ? 'bg-[#141414] text-white shadow-xs' : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      AI Vision
                    </button>
                    <button
                      onClick={() => setActiveScreen('vip')}
                      className={`flex-1 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                        activeScreen === 'vip' ? 'bg-[#141414] text-white shadow-xs' : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      VIP Drop
                    </button>
                  </div>

                  {/* Screen 1: Flight Radar */}
                  {activeScreen === 'batch' && (
                    <div className="bg-white p-3 rounded-xs border border-[#141414]/10 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-stone-900 flex items-center gap-1">
                          <Plane className="w-3.5 h-3.5 text-[#B5935A]" />
                          Flight EN-882 (TAO ➔ OSL)
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">In Flight</span>
                      </div>
                      
                      {/* Live Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-stone-500 font-mono">
                          <span>Qingdao Atelier</span>
                          <span>Oslo Gardermoen</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#B5935A] rounded-full w-2/3 animate-pulse"></div>
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-600 font-light leading-snug">
                        Batch #003 contains 48 handcrafted HD Swiss wigs. Expected touch down at Oslo OSL at 16:45 CET.
                      </p>
                    </div>
                  )}

                  {/* Screen 2: AI Vision */}
                  {activeScreen === 'vision' && (
                    <div className="bg-white p-3 rounded-xs border border-[#141414]/10 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-stone-900 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-[#B5935A]" />
                          Strand Match: 98%
                        </span>
                        <span className="text-[10px] bg-[#FAF5ED] text-[#8E7348] font-bold px-1.5 py-0.5 rounded-full">HD Swiss Match</span>
                      </div>
                      <div className="aspect-16/9 bg-stone-900 rounded-xs overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                          alt="AI Match Demo"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 border border-[#B5935A]/80 m-2 rounded-xs flex items-center justify-center">
                          <span className="bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-mono">Body Wave · 26" · 200%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-600 font-light leading-snug">
                        Recognized: The Sovereign 13x6 Melt Wig in Natural Black #1B.
                      </p>
                    </div>
                  )}

                  {/* Screen 3: VIP Drop */}
                  {activeScreen === 'vip' && (
                    <div className="bg-white p-3 rounded-xs border border-[#141414]/10 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-stone-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          Monarch Platinum 613 Drop
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded-full">Only 8 Units</span>
                      </div>
                      <p className="text-[10px] text-stone-600 font-light leading-snug">
                        Cold-lifted pure blonde single-donor units allocated for Batch #004. Priority unlock for app users.
                      </p>
                      <button 
                        onClick={() => {
                          setCurrentView('shop');
                        }}
                        className="w-full bg-[#141414] text-white py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-xs"
                      >
                        Reserve Allocation
                      </button>
                    </div>
                  )}

                  {/* App Bottom Micro Nav */}
                  <div className="bg-white border border-[#141414]/10 rounded-full py-1.5 px-4 flex items-center justify-between text-stone-400 text-[10px]">
                    <span className="text-[#141414] font-bold">Home</span>
                    <span>Shop</span>
                    <span className="text-[#B5935A] font-bold">● Scan</span>
                    <span>Orders</span>
                    <span>VIP</span>
                  </div>

                </div>

              </div>

              {/* Decorative Floating Pill */}
              <div className="absolute -top-3 -left-3 bg-[#141414] text-white py-1 px-3 rounded-full border border-[#B5935A] text-[10px] font-semibold tracking-wider flex items-center gap-1 shadow-xl">
                <Star className="w-3 h-3 fill-[#B5935A] text-[#B5935A]" />
                <span>4.9 ★ ON PLAY STORE</span>
              </div>

            </div>
          </div>

          {/* RIGHT: Editorial Copy, Feature Perks & Store Badges (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold">
                Scandinavian Digital Atelier
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF8F5] font-medium leading-snug">
                The Full Vaelyrion Experience In The Palm Of Your Hand
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Engineered for luxury clients across Norway, Scandinavia, and Europe. Receive instant weekly batch consolidation status, track air cargo departures from Qingdao to Oslo, and experience our signature AI visual hair finder.
              </p>
            </div>

            {/* Perks 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appPerks.map((perk, idx) => {
                const IconComponent = perk.icon;
                return (
                  <div key={idx} className="p-4 bg-[#1C1C1C] border border-[#2F2F2F] rounded-xs space-y-2 hover:border-[#B5935A]/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#B5935A]">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-serif text-xs font-semibold text-white">{perk.title}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Store Download Actions & QR Code */}
            <div className="pt-2 border-t border-[#2A2A2A] space-y-6">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Official Google Play Store Button */}
                <button
                  onClick={onOpenPlayStoreModal}
                  className="flex items-center gap-3 bg-[#0A0A0A] hover:bg-[#202020] border border-stone-700 hover:border-[#B5935A] text-white px-5 py-3 rounded-md transition-all cursor-pointer shadow-lg group active:scale-98"
                >
                  {/* Google Play Triangle Logo SVG */}
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.9L13.8 12 3.6 22.1c-.4-.3-.6-.8-.6-1.4V3.3c0-.6.2-1.1.6-1.4z"/>
                    <path fill="#FBBC04" d="M17.4 8.5L14.7 11.2l-2.7-2.7 5.4-3.1c.7-.4 1.5-.2 1.9.4.1.2.1.4.1.7 0 .4-.2.8-.5 1z"/>
                    <path fill="#0F9D58" d="M3.6 22.1l11.1-6.4 2.7 2.7-11.4 6.6c-.6.3-1.4.2-1.9-.3-.3-.2-.5-.5-.5-.6z"/>
                    <path fill="#EA4335" d="M17.4 15.5l-2.7-2.7 2.7-2.7 2.1 1.2c.6.3.8 1 .5 1.6-.1.3-.3.5-.5.6l-2.1 2z"/>
                  </svg>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-medium">GET IT ON</span>
                    <span className="block text-sm font-semibold tracking-wide text-white group-hover:text-[#B5935A] transition-colors">Google Play</span>
                  </div>
                </button>

                {/* Apple App Store Button */}
                <button
                  onClick={onOpenPlayStoreModal}
                  className="flex items-center gap-3 bg-[#0A0A0A] hover:bg-[#202020] border border-stone-700 hover:border-[#B5935A] text-white px-5 py-3 rounded-md transition-all cursor-pointer shadow-lg group active:scale-98"
                >
                  {/* Apple Logo SVG */}
                  <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.71-.92 2.73 1.02.08 2.03-.49 2.63-1.22z"/>
                  </svg>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-medium">Download on the</span>
                    <span className="block text-sm font-semibold tracking-wide text-white group-hover:text-[#B5935A] transition-colors">App Store</span>
                  </div>
                </button>

                {/* Instant Live In-Browser Mobile Experience */}
                <button
                  onClick={() => {
                    setIsAppMode(true);
                    showToast('Android App View Active', 'Simulating native Vaelyrion mobile application.', 'gold');
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-md transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch Live Mobile Experience</span>
                </button>

              </div>

              {/* QR Code Mini Banner */}
              <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-xs border border-[#2F2F2F] text-xs">
                <div className="w-14 h-14 bg-white p-1 rounded-xs flex items-center justify-center shrink-0 shadow-sm">
                  {/* Stylized QR Code */}
                  <div className="grid grid-cols-5 gap-0.5 w-full h-full p-0.5">
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <p className="font-semibold text-white">Scan to download directly to your Android or iPhone</p>
                  <p className="text-stone-400 text-[11px] font-light">
                    Point your camera at this QR code to download the APK or open the official Play Store listing.
                  </p>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="hidden sm:inline-flex text-[11px] uppercase tracking-wider font-semibold text-[#B5935A] hover:underline cursor-pointer"
                >
                  {copiedLink ? '✓ Copied' : 'Copy Link'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
