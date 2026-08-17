import React, { useState } from 'react';
import { X, Star, Smartphone, Download, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MobileAppBannerProps {
  onOpenPlayStoreModal: () => void;
}

export const MobileAppBanner: React.FC<MobileAppBannerProps> = ({ onOpenPlayStoreModal }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isAppMode, setIsAppMode } = useStore();

  if (isDismissed || isAppMode) return null;

  return (
    <aside 
      aria-label="App Download Banner"
      className="bg-[#141414] text-white border-b border-[#2A2A2A] px-3 py-2 sm:hidden flex items-center justify-between gap-3 text-xs transition-all duration-300 relative z-30"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* App Icon */}
        <div className="w-8 h-8 rounded-lg bg-[#222222] border border-[#B5935A]/60 flex items-center justify-center font-serif text-[11px] font-bold text-[#B5935A] shrink-0 shadow-sm">
          VAE
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-stone-100 text-[11px] truncate leading-tight">
            Vaelyrion Atelier App
          </p>
          <div className="flex items-center gap-1 text-[10px] text-stone-400">
            <span className="flex items-center text-[#B5935A] font-semibold">
              4.9 <Star className="w-2.5 h-2.5 fill-[#B5935A] ml-0.5" />
            </span>
            <span>•</span>
            <span className="text-stone-300">Free on Google Play</span>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenPlayStoreModal}
          className="bg-[#B5935A] hover:bg-[#C5A880] text-black font-semibold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors cursor-pointer active:scale-95 shadow-sm"
        >
          GET APP
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss app banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
