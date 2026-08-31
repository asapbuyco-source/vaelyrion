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
            Detailed information on made-to-order preparation and in-stock dispatch.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10 text-xs sm:text-sm text-stone-800 leading-relaxed font-light">
        
        {/* Method 1: Made to Order */}
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#141414]/8 pb-3">
            <Calendar className="w-5 h-5 text-[#8E7348]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              1. Made-to-Order Pieces
            </h3>
          </div>
          <p>
            To ensure every piece reaches you in its finest condition, made-to-order pieces are finished by hand in the atelier, then inspected in Oslo:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-600">
            <li><strong>Atelier Preparation:</strong> Days 1–6 — single-knot ventilation and considered finishing, without chemical treatment.</li>
            <li><strong>Journey to Oslo:</strong> Days 7–10 — temperature-monitored transit to the Tanelia house.</li>
            <li><strong>Oslo Inspection & Presentation:</strong> Days 11–13 — conditioning, hygiene seal, and our signature magnetic keepsake box.</li>
            <li><strong>Delivery:</strong> Days 14–18 — dispatched with full tracking.</li>
          </ul>
          <div className="p-3 bg-[#FAF5ED] rounded-xs border border-[#E8DFC8] text-xs text-[#7A5B28]">
            <strong>Total Timeline:</strong> 10 to 18 business days from order date.
          </div>
        </div>

        {/* Method 2: In-Stock */}
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#141414]/8 pb-3">
            <Truck className="w-5 h-5 text-[#8E7348]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              2. In-Stock Pieces
            </h3>
          </div>
          <p>
            Items designated as <em>"In Stock"</em> are held at our Oslo house and ship within 24 hours of order placement:
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
            <strong>Zero surprise fees at your doorstep:</strong> All applicable VAT, European customs, and import duties are prepaid and fully cleared by Tanelia at our Oslo transit hub. The price you see at checkout is the absolute final cost.
          </p>
        </div>

      </div>

    </div>
  );
};
