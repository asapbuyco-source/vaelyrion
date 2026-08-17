import React from 'react';
import { Calendar, Truck, ShieldCheck, MapPin, Package, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      <div className="bg-[#F4EFEA] border-b border-[#141414]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            Logistics Transparency
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#141414]">
            SHIPPING & WEEKLY BATCH FULFILLMENT
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto">
            Detailed breakdown of our Weekly Pre-Order consolidation model and In-Stock domestic dispatch.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10 text-xs sm:text-sm text-stone-800 leading-relaxed font-light">
        
        {/* Method 1: Pre-Order Batch */}
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#141414]/8 pb-3">
            <Calendar className="w-5 h-5 text-[#8E7348]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              1. Weekly Batch Pre-Order System (Made-to-Order)
            </h3>
          </div>
          <p>
            To deliver non-processed single-donor virgin hair without warehouse aging or chemical preservatives, our primary collection is produced through a synchronized weekly schedule:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-600">
            <li><strong>Batch Cut-off:</strong> Every Sunday at 23:59 CET, all orders from the past 7 days are consolidated into factory purchase orders.</li>
            <li><strong>Crafting & Ventilation:</strong> Days 1–6 (Qingdao atelier single-knot ventilation and silicone-free preparation).</li>
            <li><strong>Air Express Freight:</strong> Days 7–10 (Dispatched via temperature-monitored air cargo to Oslo Gardermoen OSL).</li>
            <li><strong>Norway 3PL Inspection & Unboxing:</strong> Days 11–13 (Conditioning with pure organic argan oil, hygiene seal attachment, and packing into our signature magnetic keepsake box).</li>
            <li><strong>Customer Delivery:</strong> Days 14–18 via Posten / Bring / DHL Express with full SMS tracking.</li>
          </ul>
          <div className="p-3 bg-[#FAF5ED] rounded-xs border border-[#E8DFC8] text-xs text-[#7A5B28]">
            <strong>Total Timeline:</strong> 10 to 18 business days from order date.
          </div>
        </div>

        {/* Method 2: In-Stock 3PL */}
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#141414]/8 pb-3">
            <Truck className="w-5 h-5 text-[#8E7348]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              2. In-Stock Items (Oslo 3PL Warehouse)
            </h3>
          </div>
          <p>
            Items designated as <em>"In Stock"</em> are pre-stocked at our Oslo fulfillment partner and ship within 24 hours of order placement:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-600">
            <li><strong>Norway & Sweden:</strong> 2–3 business days (Posten Bring).</li>
            <li><strong>Denmark & Finland:</strong> 3–4 business days.</li>
            <li><strong>United Kingdom & EU:</strong> 3–5 business days via DHL Express.</li>
            <li><strong>United States & International:</strong> 4–7 business days via FedEx International Priority.</li>
          </ul>
        </div>

        {/* Customs & Taxes */}
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#141414]/8 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#8E7348]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Customs, Duties & Import VAT Guarantee
            </h3>
          </div>
          <p>
            <strong>Zero surprise fees at your doorstep:</strong> All applicable VAT, European customs, and import duties are prepaid and fully cleared by Vaelyrion at our Oslo transit hub. The price you see at checkout is the absolute final cost.
          </p>
        </div>

      </div>

    </div>
  );
};
