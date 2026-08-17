import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  QrCode,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({ isOpen, onClose }) => {
  const { setIsAppMode, showToast } = useStore();
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>('idle');
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'playstore' | 'qrcode' | 'features'>('playstore');

  if (!isOpen) return null;

  const handleStartInstall = () => {
    setInstallState('installing');
    setInstallProgress(10);
  };

  React.useEffect(() => {
    if (installState === 'installing') {
      const interval = setInterval(() => {
        setInstallProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 25;
        });
      }, 450);

      return () => clearInterval(interval);
    }
  }, [installState]);

  React.useEffect(() => {
    if (installProgress >= 100 && installState === 'installing') {
      setInstallState('installed');
      showToast('Vaelyrion App Ready', 'App installed. You can now launch the native mobile experience.', 'gold');
    }
  }, [installProgress, installState, showToast]);

  const handleLaunchApp = () => {
    setIsAppMode(true);
    onClose();
    showToast('Launched Android App Mode', 'Welcome to the Vaelyrion mobile application.', 'gold');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white text-stone-900 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Play Store Top Bar */}
        <div className="bg-[#FAF8F5] border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Google Play Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M3.6 1.9L13.8 12 3.6 22.1c-.4-.3-.6-.8-.6-1.4V3.3c0-.6.2-1.1.6-1.4z"/>
              <path fill="#FBBC04" d="M17.4 8.5L14.7 11.2l-2.7-2.7 5.4-3.1c.7-.4 1.5-.2 1.9.4.1.2.1.4.1.7 0 .4-.2.8-.5 1z"/>
              <path fill="#0F9D58" d="M3.6 22.1l11.1-6.4 2.7 2.7-11.4 6.6c-.6.3-1.4.2-1.9-.3-.3-.2-.5-.5-.5-.6z"/>
              <path fill="#EA4335" d="M17.4 15.5l-2.7-2.7 2.7-2.7 2.1 1.2c.6.3.8 1 .5 1.6-.1.3-.3.5-.5.6l-2.1 2z"/>
            </svg>
            <span className="font-semibold text-xs text-stone-700 tracking-wide">Google Play Store</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* App Header (Icon, Title, Dev, Install Button) */}
          <div className="flex gap-4 items-start">
            {/* App Icon */}
            <div className="w-18 h-18 rounded-2xl bg-[#141414] border border-[#B5935A]/50 flex items-center justify-center p-3 shadow-md shrink-0">
              <span className="font-serif font-bold text-lg tracking-widest text-[#B5935A]">VAE</span>
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                Vaelyrion: Raw Hair & HD Wigs
              </h3>
              <p className="text-[#8E7348] font-medium text-[11px]">
                Vaelyrion Nordic Luxury AS · Shopping
              </p>
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <span>Contains ads</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">In-app purchases</span>
              </div>
            </div>
          </div>

          {/* Metrics Row (Rating, Downloads, Size, Age) */}
          <div className="grid grid-cols-4 divide-x divide-stone-200 border-y border-stone-200 py-3 text-center">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-bold text-stone-900 text-sm">
                <span>4.9</span>
                <Star className="w-3 h-3 fill-stone-900 text-stone-900" />
              </div>
              <p className="text-[10px] text-stone-500">2.4K reviews</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-stone-900 text-sm block">50K+</span>
              <p className="text-[10px] text-stone-500">Downloads</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-stone-900 text-sm block">28 MB</span>
              <p className="text-[10px] text-stone-500">App Size</p>
            </div>

            <div className="space-y-0.5">
              <div className="inline-block border border-stone-800 px-1 py-0.2 rounded-xs font-bold text-[10px]">
                PEGI 3
              </div>
              <p className="text-[10px] text-stone-500">Rated for 3+</p>
            </div>
          </div>

          {/* Action Installation CTA */}
          <div className="space-y-2">
            {installState === 'idle' && (
              <button
                onClick={handleStartInstall}
                className="w-full bg-[#01875f] hover:bg-[#01704f] text-white py-3 px-4 rounded-full font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Install from Google Play (28 MB)</span>
              </button>
            )}

            {installState === 'installing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#01875f]">
                  <span>Downloading & Installing...</span>
                  <span>{installProgress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#01875f] transition-all duration-300 rounded-full"
                    style={{ width: `${installProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {installState === 'installed' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-xs">Vaelyrion App successfully installed on your device!</span>
                </div>
                <button
                  onClick={handleLaunchApp}
                  className="w-full bg-[#141414] hover:bg-black text-white py-3 px-4 rounded-full font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Smartphone className="w-4 h-4 text-[#B5935A]" />
                  <span>Open Vaelyrion App Now</span>
                </button>
              </div>
            )}

            {/* Quick Web Simulator Button */}
            <button
              onClick={handleLaunchApp}
              className="w-full bg-[#FAF5ED] hover:bg-[#EFEAE4] border border-[#E5DAC8] text-[#8E7348] py-2.5 px-4 rounded-full font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Live Mobile Simulation</span>
            </button>
          </div>

          {/* Feature Highlights Screenshots */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-sm font-semibold text-stone-900">App Preview & Features</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-stone-900 text-white rounded-md p-2 aspect-3/4 flex flex-col justify-between border border-stone-300">
                <div className="flex items-center justify-between text-[9px] text-[#B5935A]">
                  <span>Radar</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] font-medium leading-tight">Live Cargo Flight Tracker</p>
              </div>

              <div className="bg-stone-900 text-white rounded-md p-2 aspect-3/4 flex flex-col justify-between border border-stone-300">
                <div className="flex items-center justify-between text-[9px] text-[#B5935A]">
                  <span>AI Vision</span>
                  <CameraIcon className="w-2.5 h-2.5" />
                </div>
                <p className="text-[10px] font-medium leading-tight">Instant Hair Pattern Match</p>
              </div>

              <div className="bg-stone-900 text-white rounded-md p-2 aspect-3/4 flex flex-col justify-between border border-stone-300">
                <div className="flex items-center justify-between text-[9px] text-[#B5935A]">
                  <span>VIP Drops</span>
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
                <p className="text-[10px] font-medium leading-tight">Sunday Cut-Off Priority</p>
              </div>
            </div>
          </div>

          {/* About this App */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h4 className="font-serif text-sm font-semibold text-stone-900">About this app</h4>
            <p className="text-stone-600 font-light leading-relaxed text-[11px]">
              The official mobile shopping client for Vaelyrion Nordic Luxury AS. Sourced from single-donor temples in Cambodia and Southern India, our handcrafted raw hair extensions and 0.03mm Swiss HD lace units are tracked end-to-end.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['#1 Luxury Hair App', 'Weekly Pre-Order Batch', 'Oslo 3PL Logistics', 'Raw Temple Hair'].map((tag) => (
                <span key={tag} className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-full border border-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FAF8F5] border-t border-stone-200 px-6 py-3 flex items-center justify-between text-[11px] text-stone-500">
          <span>Version 3.4.2 · Updated Aug 2026</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified by Play Protect
          </span>
        </div>

      </div>

    </div>
  );
};

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
