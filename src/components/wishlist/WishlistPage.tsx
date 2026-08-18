import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';

export const WishlistPage: React.FC = () => {
  const { 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart, 
    setCurrentView, 
    formatPrice,
    setSelectedProductId 
  } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#F6F3EE] min-h-screen pb-24">
      
      {/* Header */}
      <div className="bg-[#EFEAE2] border-b border-[#16150F]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7E6436] font-semibold">
            Personal Atelier Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#16150F]">
            YOUR SAVED WISHLIST
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto">
            Review your shortlisted raw hair bundles, HD lace wigs, and silk accessories before batch lock-in.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {savedProducts.length === 0 ? (
          <div className="bg-white border border-[#16150F]/10 rounded-sm p-16 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#F3ECDF] flex items-center justify-center mx-auto text-[#9C7C43]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 font-medium">Your Wishlist is Empty</h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
              Explore our single-donor temple wigs, HD closures, and silk kits. Tap the heart icon to save creations for upcoming batch allocations.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="mt-4 bg-[#16150F] hover:bg-[#26241A] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-xs transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#16150F]/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-stone-600 font-light">
                <strong className="text-black font-semibold">{savedProducts.length}</strong> Saved Items
              </span>

              <button
                onClick={() => {
                  savedProducts.forEach(p => {
                    addToCart(p, {
                      length: p.lengths[0] || '20 inch',
                      density: p.densities[0] || '180%',
                      lace: p.laceTypes[0] || '13x4 HD Swiss Lace',
                      color: p.colors[0] || 'Natural Black (#1B)',
                      quantity: 1
                    });
                  });
                }}
                className="text-xs uppercase tracking-widest font-semibold text-[#7E6436] hover:text-black transition-colors cursor-pointer"
              >
                Move All to Bag →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
