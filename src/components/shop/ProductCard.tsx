import React, { useState } from 'react';
import { Heart, Star, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProductId, 
    setCurrentView,
    addToCart
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      length: product.lengths[0] || '20 inch',
      density: product.densities[0] || '180%',
      lace: product.laceTypes[0] || '13x4 HD Swiss Lace',
      color: product.colors[0] || 'Natural Black (#1B)',
      quantity: 1
    });
  };

  const activeImage = isHovered && product.images.length > 1 
    ? product.images[1] 
    : product.images[0];

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-[#FAF8F5] border border-[#141414]/6 hover:border-[#B5935A]/50 transition-all duration-300 rounded-sm overflow-hidden cursor-pointer"
    >
      {/* Image Frame */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#EFEAE4]">
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isPreOrder ? (
            <span className="bg-[#141414]/90 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-xs border border-[#B5935A]/30">
              Pre-Order · Batch #003
            </span>
          ) : (
            <span className="bg-emerald-900/90 backdrop-blur-xs text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-xs border border-emerald-500/30">
              In Stock · Oslo 3PL
            </span>
          )}

          {product.isBestSeller && (
            <span className="bg-[#B5935A] text-black text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs w-fit">
              Best Seller
            </span>
          )}
          {product.isNew && !product.isBestSeller && (
            <span className="bg-[#FAF8F5] text-[#141414] text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs w-fit border border-[#141414]/10">
              New Drop
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-[#141414] transition-all duration-200 z-10 shadow-xs cursor-pointer active:scale-90"
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-[#B5935A] text-[#B5935A]' : 'text-stone-700'}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#141414]/95 backdrop-blur-xs hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold py-2.5 px-4 rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg border border-[#B5935A]/30 cursor-pointer"
          >
            <span>Quick Bag</span>
            <span className="text-[10px] text-[#B5935A]">({product.lengths[0]})</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#FAF8F5]">
        <div>
          {/* Subtitle / Lace & Origin */}
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-light mb-1">
            <span className="truncate max-w-[180px]">{product.hairOrigin}</span>
            <div className="flex items-center gap-1 text-[#B5935A] font-medium shrink-0">
              <Star className="w-3 h-3 fill-[#B5935A]" />
              <span className="text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base font-medium text-[#141414] group-hover:text-[#8E7348] transition-colors leading-snug line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-stone-500 font-light mt-0.5 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Delivery Notice */}
        <div className="pt-3 mt-2 border-t border-[#141414]/6 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-[#141414]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-light text-stone-500 tracking-tight text-right">
            {product.isPreOrder ? '10–18d Batch' : '2–4d Dispatch'}
          </span>
        </div>
      </div>
    </div>
  );
};
