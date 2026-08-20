import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  Calendar, 
  Check, 
  ArrowLeft, 
  Sparkles,
  ShoppingBag,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStore, buildOrderFromServer } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutContent: React.FC = () => {
  const { isAuthenticated, isAuthLoading, authUser } = useAuth();
  const { 
    cart, 
    cartSubtotal, 
    setCurrentView, 
    clearCart,
    setSelectedOrder,
    savedAddresses,
    showToast
  } = useStore();

  const stripe = useStripe();
  const elements = useElements();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || '');
  
  // Shipping Form State
  const [formData, setFormData] = useState({
    name: authUser?.profile?.first_name ? `${authUser.profile.first_name} ${authUser.profile.last_name || ''}`.trim() : '',
    email: authUser?.email || '',
    phone: authUser?.profile?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Norway',
    notes: ''
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'klarna'>('card');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Address preset selector handler
  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find(a => a.id === addrId);
    if (addr) {
      setFormData(prev => ({
        ...prev,
        name: addr.name,
        address: addr.street,
        city: addr.city,
        postalCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone
      }));
    }
  };

  const freeShipping = cartSubtotal >= 250;
  const shippingCost = freeShipping ? 0 : (shippingMethod === 'express' ? 25 : 15);
  const totalAmount = cartSubtotal + shippingCost;
  const hasPreOrder = cart.some(i => i.isPreOrder);
  // The payment API charges EUR. Keep checkout totals in the charged currency
  // even when the storefront currency selector is set to another display currency.
  const formatCheckoutPrice = (amount: number) => `€${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!stripe || !elements) {
      setPaymentError('Secure card payments are still loading. Please wait a moment and try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Please enter your card details before continuing.');
      return;
    }

    setPaymentError(null);
    setIsSubmitting(true);
    try {
      // 1. Sync cart to backend
      await api.cart.clear(); // Clear existing
      for (const item of cart) {
        await api.cart.addItem({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          options: {
            length: item.selectedLength,
            density: item.selectedDensity,
            lace: item.selectedLace,
            color: item.selectedColor
          }
        });
      }

      // 2. Create Payment Intent
      const res = await api.checkout.createPaymentIntent('current', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      }, shippingMethod);

      // 3. Confirm the card payment with Stripe
      const result = await stripe.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country === 'United States' ? 'US' : 'NO'
            }
          }
        }
      });

      if (result.error) {
        setPaymentError(result.error.message || 'Payment failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (result.paymentIntent?.status !== 'succeeded') {
        setPaymentError('Payment is still processing. Please check your order in a moment.');
        setIsSubmitting(false);
        return;
      }

      // 4. Load the confirmed order from the server (poll briefly for webhook confirmation)
      let serverOrder: any = null;
      for (let attempt = 0; attempt < 4; attempt++) {
        serverOrder = await api.orders.getById(res.orderId);
        if (serverOrder.payment_status === 'paid') break;
        await new Promise(r => setTimeout(r, 1200));
      }
      setSelectedOrder(buildOrderFromServer(serverOrder));
      clearCart();
      setCurrentView('order-confirmation');
      
    } catch (err: any) {
      console.error('Checkout failed', err);
      setPaymentError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6" role="status" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#B5935A]/30 border-t-[#B5935A] animate-spin" />
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Preparing secure checkout</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-stone-300" />
        <h2 className="font-serif text-2xl text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 font-light max-w-xs">
          Select items from our collection before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="bg-[#141414] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Lock className="w-12 h-12 text-[#B5935A]" />
        <h2 className="font-serif text-2xl text-stone-900">Sign in to Checkout</h2>
        <p className="text-xs text-stone-500 font-light max-w-xs mb-4">
          Sign in to securely complete your order and follow its journey from preparation to arrival.
        </p>
        <button
          onClick={() => setCurrentView('account')}
          className="bg-[#141414] text-white text-xs uppercase tracking-widest px-8 py-3.5 rounded-xs font-semibold"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Checkout Minimal Top Bar */}
      <div className="bg-white border-b border-[#141414]/10 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Collection</span>
          </button>

                  <img src="/brand/tanelia-logo.png" alt="Tanelia" className="brand-logo w-[130px] h-auto object-contain" />

          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-light">
            <Lock className="w-3.5 h-3.5 text-[#B5935A]" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Checkout Information Form (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer & Shipping Address */}
            <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#141414]/8 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs font-mono font-semibold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    Contact & Shipping Destination
                  </h3>
                </div>

                <span className="text-[11px] text-[#8E7348] font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  VIP Member Profile
                </span>
              </div>

              {/* Saved Address Quick Selector */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-700 block">
                    Use Saved Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr.id)}
                        className={`text-left p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                          selectedAddressId === addr.id
                            ? 'border-[#B5935A] bg-[#FAF5ED] font-medium text-stone-900'
                            : 'border-stone-200 hover:border-stone-400 bg-white text-stone-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">{addr.name}</span>
                          {selectedAddressId === addr.id && <Check className="w-3.5 h-3.5 text-[#B5935A]" />}
                        </div>
                        <p className="text-stone-500 font-light truncate mt-0.5">{addr.street}, {addr.city}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Bygdøy Allé 14B, Apt 301"
                  className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    Country *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-[16px] sm:text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                  >
                    <option value="Norway">Norway (Norge)</option>
                    <option value="Sweden">Sweden (Sverige)</option>
                    <option value="Denmark">Denmark (Danmark)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                  Mobile Phone (for courier SMS updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#B5935A]"
                />
              </div>

            </div>

            {/* Step 2: Shipping Method & Batch Schedule Notice */}
            <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-[#141414]/8 pb-4">
                <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs font-mono font-semibold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Fulfillment & Batch Method
                </h3>
              </div>

              {hasPreOrder && (
                <div className="p-3.5 bg-[#FAF5ED] rounded-xs border border-[#E5DAC8] text-xs text-[#7A5B28] flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#8E7348] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">The Atelier Release:</span>
                    <span>Orders close Sunday 23:59 CET. Your piece is then finished, inspected in Oslo, and prepared in its magnetic keepsake box.</span>
                  </div>
                </div>
              )}

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`w-full p-4 rounded-xs border text-left flex items-start justify-between text-xs transition-all cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'border-[#B5935A] bg-[#FAF5ED] font-medium text-stone-900'
                      : 'border-stone-200 hover:border-stone-400 bg-white text-stone-600'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-stone-900 block">
                      Insured Delivery + Oslo Preparation
                    </span>
                    <span className="text-stone-500 font-light">
                      Estimated delivery: {hasPreOrder ? '10–18 business days' : '2–4 business days'}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-stone-900">
                    {freeShipping ? 'FREE' : formatCheckoutPrice(15)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`w-full p-4 rounded-xs border text-left flex items-start justify-between text-xs transition-all cursor-pointer ${
                    shippingMethod === 'express'
                      ? 'border-[#B5935A] bg-[#FAF5ED] font-medium text-stone-900'
                      : 'border-stone-200 hover:border-stone-400 bg-white text-stone-600'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-stone-900 block">
                      Priority Express VIP Freight (DHL Express Direct Line)
                    </span>
                    <span className="text-stone-500 font-light">
                      Expedited freight slot directly from atelier
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-stone-900">
                    {freeShipping ? 'FREE' : formatCheckoutPrice(25)}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 3: Payment (Stripe) */}
            <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#141414]/8 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs font-mono font-semibold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    Payment Architecture
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe PCI-DSS Level 1</span>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'apple_pay', label: 'Apple Pay / Digital' },
                  { id: 'klarna', label: 'Klarna Pay Later' }
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => {
                      if (pm.id !== 'card') {
                        showToast('Payment Method', `${pm.label} will be available soon. Please use a credit or debit card.`, 'info');
                        return;
                      }
                      setPaymentMethod(pm.id as any);
                    }}
                    className={`py-3 px-2 text-center rounded-xs border transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-[#141414] text-white border-black font-medium'
                        : pm.id !== 'card'
                          ? 'bg-[#FAF8F5] text-stone-400 border-stone-200 cursor-not-allowed'
                          : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Stripe Card Element */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#FAF8F5] border border-[#141414]/10 rounded-xs space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                      Card Details
                    </label>
                    <div className="bg-white border border-[#141414]/15 px-3.5 py-3.5 rounded-xs focus-within:border-[#B5935A] transition-colors">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '14px',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              color: '#141414',
                              '::placeholder': { color: '#A8A29E' },
                            },
                            invalid: { color: '#B91C1C' },
                          },
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 font-light mt-2 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      256-bit encrypted by Stripe. Card details never touch our servers.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && null}

              {paymentMethod === 'klarna' && null}

              {paymentError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xs text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !stripe}
                className="w-full bg-[#141414] hover:bg-[#2A2A2A] text-white py-4 sm:py-5 px-6 rounded-xs text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl active:scale-98 disabled:opacity-75 sticky bottom-4 z-20 border border-[#B5935A]/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#B5935A] border-t-transparent rounded-full animate-spin"></div>
                    <span>Securing Batch Allocation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-mono text-[#E8DFC8]">{formatCheckoutPrice(totalAmount)}</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* RIGHT: Order Summary (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-6 sticky top-24 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-stone-900 border-b border-[#141414]/8 pb-3">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs pb-4 border-b border-[#141414]/6">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-20 object-cover rounded-xs shrink-0 bg-stone-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-medium text-stone-900 leading-snug">{item.product.title}</h4>
                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                          {item.selectedLength} · {item.selectedDensity} · Qty: {item.quantity}
                        </p>
                        <span className="text-[10px] text-[#8E7348] font-mono">
                          {item.isPreOrder ? 'Pre-Order (Batch #003)' : 'In Stock Oslo'}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-stone-900">
                        {formatCheckoutPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-stone-600 font-light pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-stone-900">{formatCheckoutPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment & Air Cargo</span>
                  <span className="font-mono font-medium text-stone-900">
                    {shippingCost === 0 ? 'FREE' : formatCheckoutPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Import VAT / Customs (Norway & EU)</span>
                  <span className="text-emerald-700 font-medium">Included ($0)</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-stone-900 pt-3 border-t border-[#141414]/8">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg">{formatCheckoutPrice(totalAmount)}</span>
                </div>
                <p className="text-[11px] text-stone-400">Your card will be charged in EUR.</p>
              </div>

              {/* Trust Box */}
              <div className="pt-4 border-t border-[#141414]/8 space-y-2.5 text-[11px] text-stone-500 font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B5935A] shrink-0" />
                  <span>14-Day Untouched Lace Return Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B5935A] shrink-0" />
                  <span>Includes Tanelia Magnetic Box & Silk Pouch</span>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>

    </div>
  );
};

export const CheckoutPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <CheckoutContent />
  </Elements>
);
