import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Package, 
  ChevronRight, 
  Share2, 
  Check, 
  ArrowLeft,
  Ruler,
  HelpCircle,
  Clock,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';
import { Product, HairDensity, LaceType, HairColor } from '../../types';
import { useStore } from '../../context/StoreContext';
import { MOCK_REVIEWS } from '../../data/mockData';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProduct, 
    setCurrentView, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    products,
    showToast
  } = useStore();

  const product = selectedProduct || products[0];

  // Variant States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedLength, setSelectedLength] = useState<string>(product.lengths[0] || '20 inch');
  const [selectedDensity, setSelectedDensity] = useState<HairDensity>(product.densities[0] || '180%');
  const [selectedLace, setSelectedLace] = useState<LaceType>(product.laceTypes[0] || '13x4 HD Swiss Lace');
  const [selectedColor, setSelectedColor] = useState<HairColor>(product.colors[0] || 'Natural Black (#1B)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'unboxing' | 'shipping' | 'care'>('details');

  // Swipe Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && activeImageIdx < product.images.length - 1) {
      setActiveImageIdx(prev => prev + 1);
    }
    if (isRightSwipe && activeImageIdx > 0) {
      setActiveImageIdx(prev => prev - 1);
    }
  };

  // Length price calculation
  let lengthOffset = 0;
  const numLength = parseInt(selectedLength);
  if (numLength > 20) {
    lengthOffset = (numLength - 20) * 15;
  }
  const currentUnitPrice = product.price + lengthOffset;
  const isSaved = isInWishlist(product.id);

  const handleAddToBag = () => {
    addToCart(product, {
      length: selectedLength,
      density: selectedDensity,
      lace: selectedLace,
      color: selectedColor,
      quantity
    });
  };

  const handleBuyNow = () => {
    addToCart(product, {
      length: selectedLength,
      density: selectedDensity,
      lace: selectedLace,
      color: selectedColor,
      quantity
    });
    setCurrentView('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard.', 'gold');
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isTrending))
    .slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-[#141414]/6">
        <div className="flex items-center justify-between text-xs text-stone-500 font-light">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentView('shop')}
              className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Collection</span>
            </button>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-black font-medium truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>

          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Editorial Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4 select-none">
            {/* Primary Large Image */}
            <div 
              className="relative aspect-4/5 w-full bg-[#EFEAE4] rounded-sm overflow-hidden border border-[#141414]/8 shadow-xs touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-opacity duration-300 pointer-events-none"
                draggable={false}
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.isPreOrder ? (
                  <span className="bg-[#141414]/90 backdrop-blur-md text-[#FAF8F5] text-xs uppercase font-semibold tracking-widest px-3.5 py-1.5 rounded-xs border border-[#B5935A]/40 flex items-center gap-1.5 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-[#B5935A]" />
                    <span>Pre-Order Allocation · Batch #003</span>
                  </span>
                ) : (
                  <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-100 text-xs uppercase font-semibold tracking-widest px-3.5 py-1.5 rounded-xs border border-emerald-400/40 flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In Stock · Direct Norway 3PL Dispatch</span>
                  </span>
                )}
              </div>

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-stone-800 transition-all shadow-md cursor-pointer z-10"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#B5935A] text-[#B5935A]' : ''}`} />
              </button>

              {/* Mobile Swipe Indicators (Dots) */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 sm:hidden">
                  {product.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImageIdx === idx ? 'w-4 bg-[#B5935A]' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-4/5 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#B5935A] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Purchase Configurator (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header & Rating */}
            <div className="space-y-2 border-b border-[#141414]/10 pb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E7348] font-medium uppercase tracking-widest">{product.hairOrigin}</span>
                <div className="flex items-center gap-1.5 text-stone-800">
                  <div className="flex text-[#B5935A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B5935A]" />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#141414] leading-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#141414]">
                  {formatPrice(currentUnitPrice)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-stone-400 line-through">
                    {formatPrice(product.originalPrice + lengthOffset)}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-light">VAT included · Duty-Free to EU & Norway</span>
              </div>
            </div>

            {/* Batch / Fulfillment Status Box */}
            <div className={`p-4 rounded-sm border ${product.isPreOrder ? 'bg-[#FAF5ED] border-[#E5DAC8]' : 'bg-emerald-50/50 border-emerald-200'}`}>
              <div className="flex items-start gap-3">
                {product.isPreOrder ? (
                  <Clock className="w-4 h-4 text-[#8E7348] shrink-0 mt-0.5" />
                ) : (
                  <Truck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-stone-900">
                    {product.isPreOrder ? 'Weekly Batch #003 Pre-Order Item' : 'In Stock in Oslo Warehouse'}
                  </p>
                  <p className="text-stone-600 font-light leading-relaxed">
                    {product.estimatedDelivery}
                  </p>
                  {product.isPreOrder && (
                    <p className="text-[11px] text-[#8E7348] font-medium pt-1">
                      Orders close Sunday 23:59 CET → Handcrafted in Qingdao → Air transit → Oslo 3PL unboxing inspection.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Variant Selectors */}
            <div className="space-y-5 pt-2">
              
              {/* Length Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">
                    Hair Length: <span className="text-[#8E7348] font-mono">{selectedLength}</span>
                  </span>
                  <button 
                    onClick={() => setActiveTab('care')}
                    className="text-stone-500 hover:text-black transition-colors flex items-center gap-1 font-light cursor-pointer text-[11px]"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Length Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.lengths.map((len) => {
                    const isSelected = selectedLength === len;
                    const num = parseInt(len);
                    const diff = num > 20 ? (num - 20) * 15 : 0;
                    return (
                      <button
                        key={len}
                        onClick={() => setSelectedLength(len)}
                        className={`py-2 px-3 text-xs font-mono rounded-xs border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] font-semibold' 
                            : 'bg-white text-stone-700 border-[#141414]/15 hover:border-black'
                        }`}
                      >
                        <span>{len}</span>
                        {diff > 0 && <span className="text-[10px] text-stone-400 ml-1">(+{formatPrice(diff)})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Density Selector */}
              <div>
                <div className="text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">
                    Hair Density: <span className="text-[#8E7348] font-mono">{selectedDensity}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.densities.map((den) => (
                    <button
                      key={den}
                      onClick={() => setSelectedDensity(den)}
                      className={`py-2 px-2 text-xs text-center rounded-xs border transition-all cursor-pointer ${
                        selectedDensity === den
                          ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] font-semibold'
                          : 'bg-white text-stone-700 border-[#141414]/15 hover:border-black'
                      }`}
                    >
                      {den}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lace Type Selector */}
              <div>
                <div className="text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">
                    Lace Architecture: <span className="text-[#8E7348]">{selectedLace}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {product.laceTypes.map((lace) => (
                    <button
                      key={lace}
                      onClick={() => setSelectedLace(lace)}
                      className={`py-2.5 px-3.5 text-xs text-left rounded-xs border flex items-center justify-between transition-all cursor-pointer ${
                        selectedLace === lace
                          ? 'bg-[#FAF5ED] border-[#B5935A] text-stone-900 font-medium'
                          : 'bg-white border-[#141414]/12 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span>{lace}</span>
                      {selectedLace === lace && <Check className="w-3.5 h-3.5 text-[#B5935A]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <div className="text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">
                    Color Shade: <span className="text-[#8E7348]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-3 text-xs rounded-xs border transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'bg-[#141414] text-white border-black font-medium'
                          : 'bg-white text-stone-700 border-[#141414]/15 hover:border-stone-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTAs */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#141414]/20 rounded-xs bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-[#EFEAE4] transition-colors cursor-pointer text-stone-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-mono font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-[#EFEAE4] transition-colors cursor-pointer text-stone-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    onClick={handleAddToBag}
                    className="flex-1 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF8F5] py-3 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    <span>Add to Bag</span>
                    <span>•</span>
                    <span className="font-mono">{formatPrice(currentUnitPrice * quantity)}</span>
                  </button>
                </div>

                {/* Buy Now Express */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#B5935A] hover:bg-[#C5A880] text-black py-3 px-6 rounded-xs text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Buy Now — Express Allocation
                </button>
              </div>

              {/* Guarantees & Pillars */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#141414]/8 text-[11px] text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B5935A] shrink-0" />
                  <span>14-Day Lace Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#B5935A] shrink-0" />
                  <span>Vaelyrion Hard Box Packaging</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed In-Depth Information Section */}
        <div className="mt-16 sm:mt-24 border-t border-[#141414]/10 pt-10">
          <div className="flex border-b border-[#141414]/10 overflow-x-auto gap-8">
            {[
              { id: 'details', label: 'Hair Specifications' },
              { id: 'unboxing', label: 'Luxury Unboxing Experience' },
              { id: 'shipping', label: 'Weekly Batch & Norway 3PL Timeline' },
              { id: 'care', label: 'Care & Maintenance Guide' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                  activeTab === tab.id ? 'text-[#141414]' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B5935A]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-stone-700">
                <div className="space-y-4">
                  <h4 className="font-serif text-lg text-stone-900">Atelier Construction & Specifications</h4>
                  <ul className="space-y-2 font-light">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#B5935A] font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 bg-[#F4EFEA] p-6 rounded-sm">
                  <h4 className="font-serif text-lg text-stone-900">Material Provenance</h4>
                  <p className="font-light">
                    <strong>Hair Origin:</strong> {product.hairOrigin}. Sourced with fair remuneration directly from temple donors. Cuticles are collected in a single direction to eliminate friction, knotting, or synthetic coating.
                  </p>
                  <p className="font-light">
                    <strong>Lace Base:</strong> Ultra-fine 0.03mm HD Swiss lace with micro-ventilated single hair nodes. Ready for glueless wear or subtle salon melt.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'unboxing' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white border border-[#141414]/10 rounded-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#B5935A] font-serif font-bold">1</div>
                  <h5 className="font-serif text-base text-stone-900">Rigid Magnetic Black Box</h5>
                  <p className="text-xs text-stone-600 font-light">
                    Sturdy velvet-lined hard storage chest featuring gold-foil stamped Vaelyrion crest.
                  </p>
                </div>
                <div className="p-5 bg-white border border-[#141414]/10 rounded-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#B5935A] font-serif font-bold">2</div>
                  <h5 className="font-serif text-base text-stone-900">22-Momme Silk Storage Pouch</h5>
                  <p className="text-xs text-stone-600 font-light">
                    Protective mulberry silk pouch and signature silk sleeping bonnet to preserve hydration.
                  </p>
                </div>
                <div className="p-5 bg-white border border-[#141414]/10 rounded-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#B5935A] font-serif font-bold">3</div>
                  <h5 className="font-serif text-base text-stone-900">Certificate of Authenticity & QR</h5>
                  <p className="text-xs text-stone-600 font-light">
                    Numbered batch certificate of origin, wide-tooth detangling comb, and stylist masterclass link.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6 text-xs text-stone-700">
                <div className="bg-[#FAF5ED] p-6 rounded-sm border border-[#E5DAC8] space-y-3">
                  <h4 className="font-serif text-lg text-stone-900">The Vaelyrion Weekly Batch Fulfillment Promise</h4>
                  <p className="font-light leading-relaxed">
                    To maintain strict salon-grade hair freshness and prevent warehouse dry-out, we operate on a Weekly Batch consolidation schedule.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-3 bg-white/80 rounded-xs">
                      <span className="font-semibold text-stone-900 block">1. Cut-off Sunday 23:59</span>
                      <span className="text-[11px] text-stone-600">Weekly customer orders are grouped into direct artisan POs.</span>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xs">
                      <span className="font-semibold text-stone-900 block">2. Air Cargo to Norway</span>
                      <span className="text-[11px] text-stone-600">Dispatched via express temperature-controlled air freight.</span>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xs">
                      <span className="font-semibold text-stone-900 block">3. Oslo 3PL & Packaging</span>
                      <span className="text-[11px] text-stone-600">Conditioned, packaged into luxury boxes & sent via Posten.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 text-xs text-stone-700">
                <h4 className="font-serif text-lg text-stone-900">How to Maintain Your Vaelyrion Crown</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-light">
                  {product.careInstructions.map((inst, i) => (
                    <li key={i} className="p-4 bg-white border border-[#141414]/10 rounded-sm flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#B5935A] shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 pt-12 border-t border-[#141414]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl text-stone-900">Client Reviews & Experiences</h3>
              <p className="text-xs text-stone-500 font-light mt-1">Verified purchases from Norway, Scandinavia & Europe</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-[#B5935A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B5935A]" />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-900">{product.rating} out of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((rev) => (
              <div key={rev.id} className="p-6 bg-white border border-[#141414]/10 rounded-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900">{rev.author}</span>
                  <span className="text-stone-400 text-[11px]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="text-[#8E7348] font-medium">✓ Verified Purchase</span>
                  <span>•</span>
                  <span>{rev.location}</span>
                </div>
                <div className="flex text-[#B5935A]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#B5935A]" />
                  ))}
                </div>
                <h5 className="font-serif text-sm font-semibold text-stone-900">"{rev.title}"</h5>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {rev.content}
                </p>
                <div className="pt-2 text-[10px] text-stone-400 font-mono">
                  Length tested: {rev.hairLength} · Texture: {rev.hairTexture}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#141414]/10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest text-[#B5935A] font-semibold">Complementary Looks</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">Complete Your Curation</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Purchase Bar (Sitting neatly above mobile bottom nav) */}
      <div className="lg:hidden fixed bottom-[58px] inset-x-0 bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#141414]/10 px-4 py-2.5 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="font-mono text-sm font-semibold text-stone-900">{formatPrice(currentUnitPrice)}</span>
          <p className="text-[10px] text-stone-500 truncate max-w-[120px]">{selectedLength} · {selectedDensity}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-xs border border-[#141414]/20 text-stone-700 bg-white"
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#B5935A] text-[#B5935A]' : ''}`} />
          </button>
          <button
            onClick={handleAddToBag}
            className="bg-[#141414] hover:bg-black text-[#FAF8F5] text-[11px] uppercase tracking-widest font-semibold py-2.5 px-4 rounded-xs active:scale-98 transition-transform"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};
