import React, { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { SmartImage } from '../common/SmartImage';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  animationDelay?: number;
}

const fallbackFor = (category: string) => {
  if (category === 'bundles') return 'bundles' as const;
  if (category === 'accessories') return 'care' as const;
  return 'portrait' as const;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, animationDelay = 0 }) => {
  const {
    formatPrice,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView,
    addToCart,
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
      quantity: 1,
    });
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 1800);
  };

  const activeImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const statusBadge = product.isBestSeller
    ? 'Best Seller'
    : product.isNew
      ? 'New Drop'
      : product.isPreOrder
        ? 'Pre-Order'
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
      <div className="product-image-wrap relative bg-[#E6DFD4]" style={{ aspectRatio: '3/4' }}>
        <SmartImage
          src={activeImage}
          alt={product.title}
          fallbackKind={fallbackFor(product.category)}
          className="w-full h-full object-cover object-center"
        />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {statusBadge && (
              <span className="bg-[#16150F]/85 text-[#E4D9C1] text-[9.5px] uppercase font-semibold tracking-[0.14em] px-2.5 py-1 rounded-sm backdrop-blur-sm">
                {statusBadge}
              </span>
            )}
            {discount && (
              <span className="bg-[#9C7C43] text-[#16150F] text-[9.5px] font-bold tracking-[0.1em] px-2 py-0.5 rounded-sm w-fit">
                −{discount}%
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Save to wishlist"
            className="p-2.5 rounded-full glass shadow-sm transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110"
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isSaved ? 'fill-[#9C7C43] text-[#9C7C43]' : 'text-[#3A382F]'}`} />
          </button>
        </div>

        {/* Quick add — desktop hover */}
        <div
          className="absolute inset-x-3 bottom-3 z-10 hidden sm:block transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <button
            onClick={handleQuickAdd}
            className={`w-full glass-dark text-[#F6F3EE] text-[11px] uppercase tracking-[0.16em] font-semibold py-3 px-4 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${addedToBag ? 'bg-[#9C7C43]/80' : ''}`}
          >
            {addedToBag ? (
              <>
                <span className="text-[#E4D9C1]">✓</span>
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#E4D9C1]" />
                <span>Quick Bag · {product.lengths[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between text-[10.5px] mb-2">
          <span className="truncate max-w-[150px] uppercase tracking-[0.1em] text-[#8A8578]">
            {product.hairOrigin?.split(' ').slice(0, 4).join(' ')}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-[#9C7C43] text-[#9C7C43]" />
            <span className="font-medium text-[#3A382F]">{product.rating}</span>
            <span className="text-[#B0AA9C]">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-serif text-[17px] sm:text-lg font-medium text-[#16150F] group-hover:text-[#7E6436] transition-colors duration-300 leading-snug line-clamp-2 flex-1">
          {product.title}
        </h3>

        <p className="text-xs text-[#8A8578] font-light mt-1 line-clamp-1">{product.subtitle}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-base font-semibold text-[#16150F]">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-xs text-[#B0AA9C] line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <span className="text-[10px] font-light text-[#8A8578] tracking-tight">
            {product.isPreOrder ? '10–18d' : '2–4d'}
          </span>
        </div>
      </div>
    </div>
  );
};
