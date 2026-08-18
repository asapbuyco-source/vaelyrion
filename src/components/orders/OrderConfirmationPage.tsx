import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { selectedOrder, setCurrentView, formatPrice, showToast } = useStore();

  const order = selectedOrder;

  if (!order) {
    return (
      <div className="p-12 text-center">
        <p>No active order found.</p>
        <button onClick={() => setCurrentView('home')} className="mt-4 underline text-xs">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Confirmation Hero Banner */}
      <div className="bg-[#141414] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#242424] border border-[#B5935A]/50 flex items-center justify-center mx-auto text-[#B5935A] shadow-xl">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#B5935A] font-semibold block">
          Order Allocation Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
          THANK YOU, {(order.customer.name || 'Valued Client').split(' ')[0].toUpperCase()}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto leading-relaxed">
          Your order <strong>#{order.orderNumber}</strong> has been secured and registered into this week's batch allocation pool.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('tracking')}
            className="bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Batch Timeline</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-semibold py-3 px-5 rounded-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white border border-[#141414]/10 rounded-sm shadow-xl p-6 sm:p-10 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] rounded-xs border border-[#141414]/8 text-xs">
            <div>
              <span className="text-stone-400 text-[11px] block">Order Number</span>
              <strong className="font-mono text-stone-900 font-semibold">#{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Weekly Batch</span>
              <strong className="text-[#8E7348] font-medium">Batch #003</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Estimated Delivery</span>
              <strong className="text-stone-900 font-medium">{order.estimatedDeliveryRange}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Total Paid</span>
              <strong className="font-mono text-stone-900 font-semibold">{formatPrice(order.total)}</strong>
            </div>
          </div>

          {/* Delivery & Unboxing Highlights */}
          <div className="bg-[#FAF5ED] p-5 rounded-xs border border-[#E5DAC8] flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-[#8E7348] shrink-0 mt-0.5" />
            <div className="text-xs text-[#7A5B28] space-y-1">
              <h4 className="font-serif text-sm font-semibold text-stone-900">What Happens Next in the Batch Pipeline:</h4>
              <p className="font-light leading-relaxed">
                1. On Sunday at 23:59 CET, all customer orders are locked into purchase order <strong>PO-VAE-2026-0834</strong> transmitted directly to our Qingdao atelier.
              </p>
              <p className="font-light leading-relaxed">
                2. After single-knot ventilation and quality inspection, units fly to Oslo Gardermoen for customs clearance.
              </p>
              <p className="font-light leading-relaxed">
                3. At our Oslo 3PL facility, your hair is conditioned with organic argan oil, packaged in our signature magnetic black box with silk pouch, and delivered to your doorstep.
              </p>
            </div>
          </div>

          {/* Ordered Products Itemized */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-stone-900 border-b border-[#141414]/10 pb-3">
              Allocated Creations ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#141414]/6 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded-xs shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-stone-900">{item.product.title}</h4>
                        <span className="font-mono font-semibold text-stone-900">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                      <p className="text-stone-500 font-light mt-1">
                        Length: <strong className="text-stone-700">{item.selectedLength}</strong> · Density: <strong className="text-stone-700">{item.selectedDensity}</strong>
                      </p>
                      <p className="text-stone-500 font-light">
                        Lace: {item.selectedLace} · Shade: {item.selectedColor}
                      </p>
                    </div>

                    <span className="text-[10px] text-[#8E7348] font-mono">
                      Tracking Barcode: {order.trackingNumber || 'Allocated on dispatch'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs text-stone-700 font-light border-t border-[#141414]/8">
            <div className="space-y-1">
              <h5 className="font-semibold uppercase tracking-wider text-stone-900">Destination Address</h5>
              <p className="font-medium text-stone-800">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.postalCode} {order.customer.city}, {order.customer.country}</p>
              <p className="text-stone-500">{order.customer.phone}</p>
            </div>

            <div className="space-y-1">
              <h5 className="font-semibold uppercase tracking-wider text-stone-900">Payment & Security</h5>
              <p className="flex items-center gap-1.5 text-stone-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B5935A]" />
                <span>Encrypted Credit Card Transaction (Paid)</span>
              </p>
              <p className="text-stone-500">14-Day Untouched Lace Return Policy</p>
              <p className="text-stone-500">Tanelia Concierge: concierge@tanelia.shop</p>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="pt-6 border-t border-[#141414]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs uppercase tracking-widest font-semibold text-stone-700 hover:text-black transition-colors cursor-pointer"
            >
              Continue Shopping →
            </button>

            <button
              onClick={() => setCurrentView('tracking')}
              className="w-full sm:w-auto bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-xs transition-colors text-center cursor-pointer shadow-md"
            >
              View Visual Tracking Timeline
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
