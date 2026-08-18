import React from 'react';
import { Scan, Upload, ArrowRight, Sparkles, Camera } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FindThisHairBanner: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-[#141414] min-h-[440px] flex flex-col lg:flex-row">

        {/* LEFT: Text content */}
        <div className="relative z-10 flex-1 p-10 sm:p-14 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#B5935A]/20 border border-[#B5935A]/30 text-[#C8AD7F] text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full w-fit mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Match
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-white leading-tight mb-4">
            Seen a look<br />
            <span className="italic text-[#C8AD7F]">you love?</span>
          </h2>

          <p className="text-stone-400 font-light text-sm leading-relaxed max-w-xs mb-8">
            Upload a screenshot, photo, or video frame. Our AI matches it to the exact hair texture, 
            length, and style in our catalog.
          </p>

          <button
            onClick={() => setCurrentView('find-hair')}
            className="group flex items-center gap-2.5 bg-[#FAF8F5] hover:bg-white text-[#141414] text-xs uppercase tracking-widest font-bold py-4 px-7 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg w-fit active:scale-[0.98]"
          >
            <Camera className="w-4 h-4 text-[#8E7348]" />
            <span>Find This Hair</span>
            <ArrowRight className="w-4 h-4 text-[#8E7348] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* RIGHT: Visual upload zone */}
        <div className="relative flex-1 p-10 sm:p-14 flex items-center justify-center">
          {/* Decorative circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-white/5" />
            <div className="absolute w-48 h-48 rounded-full border border-white/8" />
            <div className="absolute w-32 h-32 rounded-full border border-white/10" />
          </div>

          {/* Floating upload card */}
          <div className="relative z-10 glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl text-center w-full max-w-xs cursor-pointer hover:border-[#B5935A]/30 transition-all duration-300 group"
            onClick={() => setCurrentView('find-hair')}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#B5935A]/15 border border-[#B5935A]/20 flex items-center justify-center group-hover:bg-[#B5935A]/25 transition-colors">
              <Upload className="w-7 h-7 text-[#C8AD7F] group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-white font-serif text-base mb-1">Drop your photo here</p>
            <p className="text-stone-500 text-xs font-light mb-4">JPG, PNG, MP4 up to 20MB</p>
            <div className="border border-dashed border-[#B5935A]/30 rounded-xl p-3 text-[11px] text-[#C8AD7F] uppercase tracking-widest font-semibold">
              Browse Files
            </div>
          </div>

          {/* Floating match example */}
          <div className="absolute top-8 right-8 glass-gold rounded-2xl p-3 text-left shadow-lg hidden lg:block animate-float">
            <p className="text-[10px] uppercase tracking-widest text-[#8E7348] font-bold mb-1">Match Found</p>
            <p className="font-serif text-sm text-[#141414]">22" Body Wave</p>
            <p className="text-[10px] text-stone-500">98% similarity</p>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B5935A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#B5935A]/3 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
};
