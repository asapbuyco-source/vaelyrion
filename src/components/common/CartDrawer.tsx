import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Calendar,
  Sparkles,
  Heart
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    formatPrice,
    setCurrentView,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 250;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const hasPreOrder = cart.some(item => item.isPreOrder);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VAELUXE' || promoCode.trim().toUpperCase() === 'OSLO') {
      setPromoApplied(true);
    }
  };

  const discountAmount = promoApplied ? cartSubtotal * 0.1 : 0;
  const finalTotal = cartSubtotal - discountAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] text-[#141414] shadow-2xl flex flex-col rounded-l-3xl overflow-hidden border-l border-[#141414]/8">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#141414]/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#B5935A]" />
              <h3 className="font-serif text-xl font-medium">Shopping Bag</h3>
              <span className="text-xs font-semibold text-stone-400 bg-[#EFEAE4] px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-stone-500 hover:text-black rounded-xl hover:bg-[#EFEAE4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress Bar */}
          <div className="bg-[#F4EFEA] px-6 py-3 border-b border-[#141414]/6 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-700 font-light mb-1.5">
                Add <span className="font-semibold text-black">{formatPrice(remainingForFreeShipping)}</span> more for <span className="font-semibold text-[#8E7348]">Free Insured Priority Delivery</span>
              </p>
            ) : (
              <p className="text-stone-800 font-medium flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B5935A]" />
                <span>You have unlocked <strong className="text-[#8E7348]">Free Insured Priority Delivery</strong>!</span>
              </p>
            )}
            <div className="w-full bg-[#E5DDD2] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#B5935A] h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Pre-order Batch Alert (if applicable) */}
          {hasPreOrder && (
            <div className="bg-[#FAF4EB] border-b border-[#E8DFC8] px-6 py-2.5 text-[11px] text-[#7A5B28] flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Weekly Batch #003:</strong> Items marked <em>Pre-Order</em> will be crafted in this week's artisan batch and dispatched via Oslo 3PL. Estimated delivery: <strong>10–18 business days</strong>.
              </span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFEAE4] flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg text-stone-800">Your bag is currently empty</h4>
                <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
                  Explore our single-donor raw hair collections, HD lace frontals, and custom wigs.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('shop');
                  }}
                  className="mt-4 inline-block bg-[#141414] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Explore The Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-[#141414]/8">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded-sm bg-[#EFEAE4] shrink-0 border border-[#141414]/6"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold leading-snug text-[#141414]">
                          {item.product.title}
                        </h4>
                        <span className="font-mono text-xs font-semibold text-[#141414]">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Variant Specs */}
                      <div className="text-[11px] text-stone-600 space-y-0.5 mt-1 font-light">
                        <p>Length: <span className="font-medium text-stone-800">{item.selectedLength}</span> · Density: <span className="font-medium text-stone-800">{item.selectedDensity}</span></p>
                        <p>Lace: <span className="font-medium text-stone-800">{item.selectedLace}</span></p>
                        <p className="text-stone-500">Color: {item.selectedColor}</p>
                      </div>

                      {/* Stock / Pre-Order Tag */}
                      <div className="mt-1.5">
                        {item.isPreOrder ? (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#8E7348] bg-[#FAF4EB] px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                            Pre-Order (Batch #003)
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                            In Stock · Ready to Ship
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls & Remove */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-[#141414]/15 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#EFEAE4] text-stone-600 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#EFEAE4] text-stone-600 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleWishlist(item.product.id)}
                          className="text-[11px] text-stone-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Heart className={`w-3 h-3 ${isInWishlist(item.product.id) ? 'fill-[#B5935A] text-[#B5935A]' : ''}`} />
                          <span className="hidden sm:inline">Save</span>
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-stone-400 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Sticky at bottom for mobile CRO) */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#141414]/10 bg-[#FAF8F5] space-y-4 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:pb-6">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (e.g. VAELUXE)"
                  className="bg-white border border-[#141414]/15 px-3 py-2 text-[16px] sm:text-xs rounded-sm focus:outline-none focus:border-[#B5935A] flex-1 uppercase tracking-wider font-light"
                />
                <button
                  type="submit"
                  className="bg-[#EFEAE4] text-[#141414] hover:bg-[#E2D9CE] px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xs border border-emerald-200 flex justify-between items-center">
                  <span>VIP 'VAELUXE' Applied</span>
                  <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-black font-medium">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-black font-medium">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE' : formatPrice(15)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-semibold text-black pt-2 border-t border-[#141414]/8">
                  <span>Total</span>
                  <span className="font-mono text-base sm:text-lg text-[#141414]">
                    {formatPrice(finalTotal + (cartSubtotal >= freeShippingThreshold ? 0 : 15))}
                  </span>
                </div>
              </div>

              {/* Checkout CTA - Large tap target */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('checkout');
                }}
                className="w-full bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF8F5] py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>Checkout Securely</span>
                <ArrowRight className="w-4 h-4 text-[#E8DFC8]" />
              </button>

              <div className="flex items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-stone-500 font-light pb-2 sm:pb-0">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B5935A]" />
                  Stripe Encrypted
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Norway 3PL Assured</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
