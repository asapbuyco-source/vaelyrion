import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  MapPin
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderTrackingPage: React.FC = () => {
  const { 
    selectedOrder, 
    orders, 
    setSelectedOrder, 
    setCurrentView
  } = useStore();

  const [trackingInput, setTrackingInput] = useState('');

  const order = selectedOrder || orders[0];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => 
      o.orderNumber.toLowerCase() === trackingInput.trim().toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === trackingInput.trim().toLowerCase())
    );
    if (found) {
      setSelectedOrder(found);
    }
  };

  if (!order) {
    return (
      <div className="p-12 text-center">
        <p>No orders available to track.</p>
        <button onClick={() => setCurrentView('shop')} className="mt-4 underline text-xs">Shop Collection</button>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F3EE] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#16150F] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#242424]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#9C7C43]">
            <Truck className="w-4 h-4" />
            <span>End-to-End Batch Pipeline Transparency</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
            LIVE ORDER TRACKING
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto leading-relaxed">
            Follow your raw virgin hair from single-knot hand ventilation in Qingdao to unboxing at our Oslo 3PL facility.
          </p>

          {/* Quick Tracking Search Form */}
          <form onSubmit={handleLookup} className="max-w-md mx-auto pt-4 flex gap-2">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Search Order (e.g. VA10245 or VAE-NO-99482103)"
              className="bg-[#222222] border border-stone-700 text-white text-xs px-4 py-3 rounded-xs flex-1 focus:outline-none focus:border-[#9C7C43] font-mono placeholder-stone-500 font-light"
            />
            <button
              type="submit"
              className="bg-[#9C7C43] hover:bg-[#C5A880] text-black text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xs transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
          {/* Order Details Header Card */}
          <div className="bg-white border border-[#16150F]/10 rounded-sm shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16150F]/8 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-semibold text-stone-900">
                    ORDER #{order.orderNumber}
                  </h2>
                  <span className="bg-[#F3ECDF] text-[#7E6436] text-xs font-mono font-semibold px-2.5 py-0.5 rounded-xs border border-[#E4D9C1]">
                    {order.batchId ? order.batchId.toUpperCase() : 'BATCH #003'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Placed on {order.date} · Destination: <strong>{order.customer.city}, {order.customer.country}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-stone-400 block font-light">Air & Courier Waybill</span>
                <span className="font-mono text-sm font-semibold text-stone-900">{order.trackingNumber || 'Pending allocation'}</span>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  Carrier: <strong>Air Freight + Posten Bring</strong>
                </p>
              </div>
            </div>

          {/* Visual Tracking Timeline (12 Stages) */}
          <div className="space-y-6 pt-4">
            <h3 className="font-serif text-lg font-medium text-stone-900 border-b border-[#16150F]/8 pb-2">
              Shipment Journey & Custody Log
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {order.trackingEvents.map((event, idx) => {
                const isDone = event.completed;
                const isCurrent = event.current;

                return (
                  <div key={idx} className="relative group">
                    
                    {/* Node Dot / Icon */}
                    <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      isDone
                        ? 'bg-[#16150F] text-[#9C7C43] ring-4 ring-[#F6F3EE]'
                        : isCurrent
                        ? 'bg-[#9C7C43] text-black ring-4 ring-[#F3ECDF] animate-pulse'
                        : 'bg-stone-200 text-stone-400 ring-4 ring-[#F6F3EE]'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9C7C43]" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-black"></span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`space-y-1 p-3 rounded-xs transition-all ${
                      isCurrent ? 'bg-[#F3ECDF] border border-[#E5DAC8]' : 'bg-transparent'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                          isDone || isCurrent ? 'text-stone-900' : 'text-stone-400'
                        }`}>
                          {event.title}
                        </h4>
                        <span className="font-mono text-[11px] text-stone-500">{event.timestamp}</span>
                      </div>

                      <p className={`text-xs font-light leading-relaxed ${
                        isDone || isCurrent ? 'text-stone-700' : 'text-stone-400'
                      }`}>
                        {event.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
                        <MapPin className="w-3 h-3 text-[#9C7C43]" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary & Actions */}
          <div className="pt-6 border-t border-[#16150F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentView('account')}
              className="text-xs uppercase tracking-widest font-semibold text-stone-700 hover:text-black transition-colors cursor-pointer"
            >
              ← Back to Client Account
            </button>

            <button
              onClick={() => setCurrentView('shop')}
              className="w-full sm:w-auto bg-[#16150F] hover:bg-[#26241A] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-xs transition-colors cursor-pointer"
            >
              Explore New Atelier Drops
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
