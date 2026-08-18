import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
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

  const flag = product.isNew ? 'New' : product.isBestSeller ? 'Best Seller' : null;

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col cursor-pointer animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image Frame */}
      <div className={`img-frame relative ${isHovered ? 'is-hover' : ''}`} style={{ aspectRatio: '3/4' }}>
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Top meta row */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {flag && (
              <span className="bg-[#141414] text-[#F5F3EF] text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
                {flag}
              </span>
            )}
            {discount && (
              <span className="bg-[#F5F3EF] text-[#141414] text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
                −{discount}%
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            aria-label="Save to Wishlist"
            className="p-1.5 text-[#141414] transition-transform duration-200 cursor-pointer active:scale-90 hover:scale-110"
          >
            <Heart className={`w-4 h-4 transition-all ${isSaved ? 'fill-[#141414]' : 'text-[#141414]'}`} strokeWidth={1.5} />
          </button>
        </div>

        {/* Quick Add — slides up on hover (desktop) */}
        <div 
          className="absolute inset-x-3 bottom-3 hidden sm:block transition-all duration-300"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#141414] text-[#F5F3EF] text-[10px] uppercase tracking-[0.22em] font-semibold py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-[#2C2C2C]"
          >
            {addedToBag ? (
              <><Check className="w-3.5 h-3.5" /><span>Added</span></>
            ) : (
              <><Plus className="w-3.5 h-3.5" /><span>Quick Add · {product.lengths[0]}</span></>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] font-semibold text-[#141414] leading-snug tracking-tight line-clamp-2">
            {product.title}
          </h3>
          <span className="font-sans text-sm font-medium text-[#141414] whitespace-nowrap tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-[11px] text-[#9A968F] uppercase tracking-[0.12em] truncate">
            {product.hairOrigin?.split(' ').slice(0, 3).join(' ')}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-sans text-xs text-[#9A968F] line-through tabular-nums whitespace-nowrap">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
