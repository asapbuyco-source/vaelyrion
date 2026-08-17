import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Sparkles, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#141414] text-[#FAF8F5] p-4 rounded-sm shadow-2xl border border-[#B5935A]/40 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-3"
        >
          <div className="text-[#B5935A] shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : toast.type === 'gold' ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]">
              {toast.title}
            </h5>
            <p className="text-xs text-stone-300 font-light mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
