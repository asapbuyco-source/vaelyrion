import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Headset, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const VISITOR_STORAGE_KEY = 'tanelia_chat_visitor';

interface ChatVisitor {
  name: string;
  email: string;
}

const readStoredVisitor = (): ChatVisitor | null => {
  try {
    const raw = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && parsed.email.trim()) {
      return { name: typeof parsed.name === 'string' ? parsed.name : '', email: parsed.email };
    }
  } catch {
    /* storage unavailable */
  }
  return null;
};

export const LiveChat: React.FC = () => {
  const { authUser } = useAuth();
  const { currentView } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitor, setVisitor] = useState<ChatVisitor | null>(readStoredVisitor);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Prefill from the signed-in profile when available.
  useEffect(() => {
    if (!authUser) return;
    setForm((prev) => ({
      name: prev.name || [authUser.profile?.first_name, authUser.profile?.last_name].filter(Boolean).join(' '),
      email: prev.email || authUser.email || '',
    }));
  }, [authUser]);

  // Identify a returning visitor with Tawk as early as possible.
  useEffect(() => {
    if (!visitor) return;
    const identify = () => {
      if (window.Tawk_API) window.Tawk_API.visitor = { name: visitor.name, email: visitor.email };
    };
    identify();
    const retry = setTimeout(identify, 3000);
    return () => clearTimeout(retry);
  }, [visitor]);

  // Keep checkout focused: minimize the chat when entering it.
  useEffect(() => {
    if (currentView === 'checkout' && typeof window.Tawk_API?.minimize === 'function') {
      window.Tawk_API.minimize();
    }
  }, [currentView]);

  // Escape closes the modal.
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const openWidget = (visitorData: ChatVisitor) => {
    const tawk = window.Tawk_API;
    if (!tawk) return;
    tawk.visitor = { name: visitorData.name, email: visitorData.email };
    if (typeof tawk.setAttributes === 'function') {
      tawk.setAttributes({ name: visitorData.name, email: visitorData.email }, () => {});
    }
    if (typeof tawk.showWidget === 'function') tawk.showWidget();
    if (typeof tawk.maximize === 'function') tawk.maximize();
  };

  const handleLauncherClick = () => {
    if (visitor) {
      openWidget(visitor);
      return;
    }
    setError(null);
    setIsModalOpen(true);
    setTimeout(() => emailInputRef.current?.focus(), 60);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const name = form.name.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address so we can reach you.');
      return;
    }
    const visitorData: ChatVisitor = { name: name || 'Guest', email };
    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(visitorData));
    } catch {
      /* storage unavailable */
    }
    setVisitor(visitorData);
    setIsModalOpen(false);
    openWidget(visitorData);
  };

  if (currentView === 'checkout') return null;

  return (
    <>
      {/* Custom launcher — replaces the default Tawk bubble */}
      <button
        type="button"
        onClick={handleLauncherClick}
        aria-label="Chat with Tanelia Client Services"
        className="fixed z-40 right-4 bottom-24 lg:right-6 lg:bottom-6 flex items-center gap-2.5 bg-[#141414] text-[#FAF8F5] border border-[#B5935A]/30 shadow-xl rounded-full pl-3.5 pr-5 py-3 hover:bg-[#2A2A2A] active:scale-95 transition-all cursor-pointer"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#E8DFC8]" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#B5935A] animate-pulse" />
        </span>
        <span className="hidden sm:inline text-[11px] uppercase tracking-widest font-semibold">Chat</span>
      </button>

      {/* Email capture before the conversation starts */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="live-chat-title"
        >
          <div
            className="absolute inset-0 bg-[#141414]/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full sm:max-w-md bg-[#FAF8F5] border border-[#141414]/10 sm:rounded-sm shadow-2xl p-6 sm:p-8 space-y-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close chat form"
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
                <Headset className="w-5 h-5 text-[#E8DFC8]" />
              </div>
              <div>
                <h3 id="live-chat-title" className="font-serif text-xl font-medium text-stone-900">
                  Client Services
                </h3>
                <p className="text-[11px] text-stone-500 font-light">
                  Styling, sizing, orders & aftercare — typically replies within a few hours.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Share your email and we will continue with you here. If you leave the chat, our reply
              will still reach your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="chat-name" className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                  Your Name
                </label>
                <div className="flex items-center gap-2 bg-white border border-[#141414]/15 px-3.5 rounded-xs focus-within:border-[#B5935A] transition-colors">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <input
                    id="chat-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Optional"
                    className="w-full bg-transparent py-2.5 text-[16px] sm:text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="chat-email" className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                  Email Address *
                </label>
                <div className="flex items-center gap-2 bg-white border border-[#141414]/15 px-3.5 rounded-xs focus-within:border-[#B5935A] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <input
                    id="chat-email"
                    ref={emailInputRef}
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-2.5 text-[16px] sm:text-xs focus:outline-none"
                  />
                </div>
                {error && <p className="text-[11px] text-red-600 mt-1.5" role="alert">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#141414] hover:bg-[#2A2A2A] text-white py-3.5 px-6 rounded-xs text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#E8DFC8]" />
                Start Chat
              </button>
            </form>

            <p className="text-[10px] text-stone-400 font-light leading-relaxed">
              By starting a chat you agree to be contacted at this email about your enquiry.
              We only use it to support your Tanelia experience.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
