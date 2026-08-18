import React, { useState } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Scan, 
  CheckCircle2, 
  ShoppingBag, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  Image as ImageIcon 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';

export const FindThisHairPage: React.FC = () => {
  const { 
    performVisualSearch, 
    isSearchingImage, 
    visualSearchResults, 
    clearVisualSearch,
    addToCart,
    formatPrice,
    setSelectedProductId,
    setCurrentView
  } = useStore();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Curated lookbook presets for instant demo
  const sampleLooks = [
    {
      title: 'Sleek Bone Straight 28"',
      tag: 'Red Carpet Silk',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Defined Natural Deep Wave',
      tag: 'Editorial Volume',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Lustrous Hollywood Body Wave',
      tag: 'Soft Romantic S-Curve',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Pure Platinum 613 Cold Lift',
      tag: 'High Impact Blonde',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreviewImage(src);
      performVisualSearch(src);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (image: string) => {
    setPreviewImage(image);
    performVisualSearch(image);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#141414] text-[#FAF8F5] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none font-display text-[160px] tracking-tighter">
          VAE
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2A2A2A] border border-[#B5935A]/40 px-3.5 py-1.5 rounded-full text-xs text-[#E8DFC8] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B5935A]" />
            <span>AI Hair Architecture Matcher</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white">
            FIND THIS HAIR
          </h1>

          <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Seen a look you love on Instagram, Pinterest, TikTok, or the runway? Upload a photo or screenshot and our visual intelligence matches the exact texture, density, lace gauge, and lengths from our master ateliers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Upload Interface Box */}
        <div className="bg-white border border-[#141414]/10 rounded-sm shadow-xl p-6 sm:p-10">
          
          {!previewImage ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-sm p-8 sm:p-14 text-center transition-all ${
                dragActive ? 'border-[#B5935A] bg-[#FAF5ED]' : 'border-stone-300 bg-[#FAF8F5] hover:border-stone-400'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto text-[#B5935A] mb-4">
                <Scan className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-medium mb-1">
                Upload Photo, Screenshot, or Runway Look
              </h3>
              <p className="text-xs text-stone-500 font-light max-w-md mx-auto mb-6">
                Drag and drop your image file here (PNG, JPG, WEBP), or select a file from your device.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-xs cursor-pointer transition-colors flex items-center gap-2 shadow-sm">
                  <Upload className="w-4 h-4 text-[#B5935A]" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Sample Quick Try Looks */}
              <div className="mt-10 pt-8 border-t border-[#141414]/8">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-4">
                  Or test with sample editorial looks:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sampleLooks.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample.image)}
                      className="group text-left rounded-xs overflow-hidden border border-[#141414]/10 bg-white hover:border-[#B5935A] transition-all cursor-pointer"
                    >
                      <div className="aspect-3/4 overflow-hidden bg-stone-100">
                        <img
                          src={sample.image}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <span className="text-[10px] text-[#8E7348] font-mono block">{sample.tag}</span>
                        <p className="text-[11px] font-serif text-stone-900 font-medium truncate">{sample.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Analysis & Results Display */
            <div className="space-y-8">
              
              {/* Top Selected Image & Scanning Status */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#FAF8F5] rounded-sm border border-[#141414]/10">
                <div className="relative w-28 h-36 rounded-xs overflow-hidden shrink-0 border border-[#141414]/15 shadow-sm">
                  <img src={previewImage} alt="Uploaded look" className="w-full h-full object-cover" />
                  {isSearchingImage && (
                    <div className="absolute inset-0 bg-[#B5935A]/20 backdrop-blur-xs flex items-center justify-center animate-pulse">
                      <Scan className="w-8 h-8 text-black" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {isSearchingImage ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-[#B5935A] animate-ping"></span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    )}
                    <span className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                      {isSearchingImage ? 'Analyzing Texture & Lace Architecture...' : 'Visual Match Complete'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-light">
                    {isSearchingImage 
                      ? 'Extracting strand curvature, reflection coefficient, parting depth, and density index...'
                      : 'Extracted attributes matched against 100% single-donor temple hair and Swiss HD bases in our catalog.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPreviewImage(null);
                    clearVisualSearch();
                  }}
                  className="text-xs text-stone-500 hover:text-black transition-colors flex items-center gap-1.5 underline cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Upload Different Photo</span>
                </button>
              </div>

              {/* Loading Scanner Animation */}
              {isSearchingImage && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 border-3 border-[#B5935A] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="font-serif text-xl text-stone-900">Searching master ateliers for matching hair...</h4>
                  <p className="text-xs text-stone-500 font-light">Comparing against raw Cambodian temple stocks and HD Swiss lace frontals.</p>
                </div>
              )}

              {/* Matched Results */}
              {!isSearchingImage && visualSearchResults && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-3">
                    <h3 className="font-serif text-2xl text-stone-900 font-medium">
                      Top Visual Matches ({visualSearchResults.length})
                    </h3>
                    <span className="text-xs text-[#8E7348] font-semibold tracking-wider uppercase">
                      Direct Atelier Replacements
                    </span>
                  </div>

                  <div className="space-y-6">
                    {visualSearchResults.map((match, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-[#141414]/12 hover:border-[#B5935A] rounded-sm p-4 sm:p-6 transition-all shadow-xs flex flex-col md:flex-row gap-6 items-center"
                      >
                        {/* Match Image */}
                        <div 
                          onClick={() => {
                            setSelectedProductId(match.product.id);
                            setCurrentView('product');
                          }}
                          className="w-32 h-40 rounded-xs overflow-hidden shrink-0 bg-[#EFEAE4] cursor-pointer"
                        >
                          <img
                            src={match.product.images[0]}
                            alt={match.product.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Match Details */}
                        <div className="flex-1 space-y-3 text-left w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#141414] text-[#FAF8F5] text-xs font-mono font-bold px-2.5 py-0.5 rounded-xs">
                                {match.similarityScore}% Match
                              </span>
                              <span className="text-xs uppercase font-medium text-[#8E7348] tracking-widest">
                                {match.product.hairOrigin}
                              </span>
                            </div>

                            <span className="font-mono text-base font-semibold text-stone-900">
                              {formatPrice(match.product.price)}
                            </span>
                          </div>

                          <h4 
                            onClick={() => {
                              setSelectedProductId(match.product.id);
                              setCurrentView('product');
                            }}
                            className="font-serif text-lg font-semibold text-stone-900 hover:text-[#8E7348] transition-colors cursor-pointer"
                          >
                            {match.product.title}
                          </h4>

                          {/* Detected match reasons */}
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {match.matchReasons.map((reason, rIdx) => (
                              <span key={rIdx} className="bg-[#FAF5ED] text-[#8E7348] px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                                ✓ {reason}
                              </span>
                            ))}
                          </div>

                          {/* Detected attributes */}
                          <div className="text-xs text-stone-600 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-light">
                            <div><strong className="font-medium text-stone-800">Texture:</strong> {match.detectedTexture}</div>
                            <div><strong className="font-medium text-stone-800">Length:</strong> {match.detectedLength}</div>
                            <div><strong className="font-medium text-stone-800">Color:</strong> {match.detectedColor}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 w-full md:w-48 shrink-0">
                          <button
                            onClick={() => {
                              addToCart(match.product, {
                                length: match.product.lengths[0] || '20 inch',
                                density: match.product.densities[0] || '180%',
                                lace: match.product.laceTypes[0] || '13x4 HD Swiss Lace',
                                color: match.product.colors[0] || 'Natural Black (#1B)',
                                quantity: 1
                              });
                            }}
                            className="w-full bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#B5935A]" />
                            <span>Add to Bag</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProductId(match.product.id);
                              setCurrentView('product');
                            }}
                            className="w-full bg-white hover:bg-stone-50 border border-[#141414]/15 text-stone-800 text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xs transition-colors text-center cursor-pointer"
                          >
                            Configure Look
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
