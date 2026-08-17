import React from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ReturnsPolicyPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      <div className="bg-[#F4EFEA] border-b border-[#141414]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            Client Assurance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#141414]">
            RETURNS & 14-DAY HYGIENE POLICY
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto">
            Our luxury standard for returns, exchanges, and hygiene seal compliance.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8 text-xs sm:text-sm text-stone-800 leading-relaxed font-light">
        
        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-[#141414]/8 pb-2">
            14-Day Untouched Lace Return Guarantee
          </h3>
          <p>
            We take tremendous pride in the caliber of our raw temple hair and Swiss HD lace. If you are not entirely enamored with your selection, you may return or exchange your item within <strong>14 days of delivery receipt</strong>.
          </p>
        </div>

        <div className="bg-[#FAF5ED] border border-[#E5DAC8] rounded-sm p-6 sm:p-8 space-y-4 text-xs text-[#7A5B28]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8E7348]" />
            <h4 className="font-serif text-sm font-semibold text-stone-900">Hygiene & Safety Criteria</h4>
          </div>
          <p>
            Due to the sanitary nature of medical-grade Swiss HD lace and human hair goods:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-700">
            <li>The <strong>HD lace frontal must remain intact</strong> (uncut, un-bleached, and un-plucked).</li>
            <li>The unit must not have been washed, chemically tinted, colored, or heat styled.</li>
            <li>The tamper-evident security seal tag must remain affixed to the lace base.</li>
            <li>Original luxury packaging, magnetic keepsake box, and silk pouch must be returned complete.</li>
          </ul>
        </div>

        <div className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-[#141414]/8 pb-2">
            How to Initiate a Return
          </h3>
          <p>
            1. Email our Oslo Client Concierge at <strong>concierge@vaelyrion.com</strong> or submit an inquiry through your <button onClick={() => setCurrentView('account')} className="underline font-semibold text-black">Client Account Portal</button>.
          </p>
          <p>
            2. We will generate a prepaid return airway label for our Oslo 3PL inspection hub.
          </p>
          <p>
            3. Upon inspection clearance (typically 24–48 hours after receipt in Oslo), a full refund is credited to your original payment method.
          </p>
        </div>

      </div>

    </div>
  );
};
