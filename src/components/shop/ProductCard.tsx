import React, { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { SmartImage } from '../common/SmartImage';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  animationDelay?: number;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, animationDelay = 0, priority = false }) => {
  const { 
    formatPrice, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProductId, 
    setCurrentView,
    addToCart
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
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
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 1800);
  };

  const activeImage = isHovered && product.images.length > 1 
    ? product.images[1] 
    : product.images[0];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const fallbackFor = (category: string) => {
    if (category === 'bundles') return 'bundles' as const;
    if (category === 'accessories') return 'care' as const;
    return 'portrait' as const;
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-float group flex flex-col bg-white cursor-pointer overflow-hidden animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image Frame */}
      <div className="relative overflow-hidden bg-[#EFEAE4]" style={{ borderRadius: '0', aspectRatio: '3/4' }}>
        <SmartImage
          src={activeImage}
          alt={product.title}
          fallbackKind={fallbackFor(product.category)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Unified badge column — v0 pattern */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {/* Primary status badge */}
            {(product.isBestSeller || product.isNew || product.isPreOrder) && (
              <span className="bg-[#141414]/85 text-[#E8DFC8] text-[9.5px] uppercase font-semibold tracking-[0.14em] px-2.5 py-1 rounded-sm backdrop-blur-sm w-fit">
                {product.isBestSeller ? 'Best Seller' : product.isNew ? 'New Drop' : 'Pre-Order'}
              </span>
            )}
            {/* Discount badge */}
            {discount && (
              <span className="bg-[#B5935A] text-[#141414] text-[9.5px] font-bold tracking-[0.1em] px-2 py-0.5 rounded-sm w-fit">
                −{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button — right side of the same flex row */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Save to wishlist"
            className="p-2.5 glass shadow-sm transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110 shrink-0"
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isSaved ? 'fill-[#B5935A] text-[#B5935A] scale-110' : 'text-[#3A382F]'}`} />
          </button>
        </div>

        {/* Quick Add Overlay — slides up on hover (desktop only) */}
        <div 
          className="absolute inset-x-3 bottom-3 z-10 hidden sm:block transition-all duration-300"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)'
          }}
        >
          <button
            onClick={handleQuickAdd}
            className={`w-full glass-dark text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold py-3 px-4 rounded-none transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-white/10 ${addedToBag ? 'bg-[#B5935A]/80' : ''}`}
          >
            {addedToBag ? (
              <>
                <span className="text-[#E8DFC8]">✓</span>
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#E8DFC8]" />
                <span>Quick Bag · {product.lengths[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information Panel */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white" style={{ borderRadius: '0' }}>
        {/* Hair Origin & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 font-light mb-2">
          <span className="truncate max-w-[150px] uppercase tracking-wide text-[10px]">{product.hairOrigin?.split(' ').slice(0, 4).join(' ')}</span>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-[#B5935A] text-[#B5935A]" />
            <span className="font-medium text-stone-700">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-base sm:text-lg font-medium text-[#141414] group-hover:text-[#8E7348] transition-colors duration-300 leading-snug line-clamp-2 flex-1">
          {product.title}
        </h3>

        <p className="text-xs text-stone-400 font-light mt-1 line-clamp-1">
          {product.subtitle}
        </p>

        {/* Price Row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-base font-bold text-[#141414]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-light text-stone-400 tracking-tight">
            {product.isPreOrder ? '10–18d' : '2–4d'}
          </span>
        </div>
      </div>
    </div>
  );
};
