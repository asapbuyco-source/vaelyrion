import React, { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  animationDelay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, animationDelay = 0 }) => {
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

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-float group flex flex-col bg-white cursor-pointer overflow-hidden animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image Frame */}
      <div className="relative overflow-hidden bg-[#EFEAE4]" style={{ borderRadius: '20px 20px 0 0', aspectRatio: '3/4' }}>
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          loading="lazy"
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {product.isPreOrder ? (
            <span className="glass-dark text-[#E8DFC8] text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-full border border-[#B5935A]/30">
              Pre-Order
            </span>
          ) : (
            <span className="glass text-emerald-800 text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-full border border-emerald-200/60">
              In Stock
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 mt-8 z-10">
            <span className="bg-[#B5935A] text-black text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          </div>
        )}

        {/* Best Seller / New */}
        {(product.isBestSeller || product.isNew) && (
          <div className="absolute top-3 left-3 mt-8 z-10">
            <span className="glass text-[#8E7348] text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-[#B5935A]/20">
              {product.isBestSeller ? 'Best Seller' : 'New Drop'}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full glass shadow-sm transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${isSaved ? 'fill-[#B5935A] text-[#B5935A] scale-110' : 'text-stone-600'}`} />
        </button>

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
            className={`w-full glass-dark text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-white/10 ${addedToBag ? 'bg-[#B5935A]/80' : ''}`}
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
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white" style={{ borderRadius: '0 0 20px 20px' }}>
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
