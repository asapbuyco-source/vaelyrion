import React, { useState } from 'react';
import { ArrowRight, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../lib/api';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      message: String(form.get('message') || '')
    };

    try {
      await api.contact.submit(payload);
      setSent(true);
      event.currentTarget.reset();
      showToast('Enquiry received', 'Thank you. Your note has been sent to the Tanelia client service team.', 'gold');
    } catch (submitError: any) {
      setError(submitError.message || 'We could not submit your enquiry. Please email info@tanelia.shop directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      <div className="bg-[#141414] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B5935A] font-semibold">Client Services</p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight">Speak with Tanelia.</h1>
          <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Questions about a texture, lace construction, sizing, or delivery? Our client service team is here to help you choose with confidence.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-5">
          <div className="luxury-box p-6 space-y-4">
            <div className="w-11 h-11 bg-[#F4EBDD] flex items-center justify-center"><Mail className="w-5 h-5 text-[#8E7348]" /></div>
            <h2 className="font-serif text-xl text-stone-900">Email the house</h2>
            <a className="text-sm text-[#8E7348] underline underline-offset-4" href="mailto:info@tanelia.shop">info@tanelia.shop</a>
            <p className="text-xs text-stone-500 leading-relaxed">For direct assistance, email us and include your order number where relevant.</p>
          </div>
          <div className="luxury-box p-6 space-y-4">
            <div className="w-11 h-11 bg-[#F4EBDD] flex items-center justify-center"><MapPin className="w-5 h-5 text-[#8E7348]" /></div>
            <h2 className="font-serif text-xl text-stone-900">Based in Oslo</h2>
            <p className="text-sm text-stone-600 leading-relaxed">Tanelia is based in Oslo, Norway. Orders are inspected and prepared here before dispatch.</p>
            <div className="flex items-center gap-2 text-xs text-stone-500"><Clock className="w-4 h-4 text-[#B5935A]" /> Monday–Friday · 09:00–17:00 CET</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white border border-[#141414]/10 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#141414]/10 pb-4"><MessageCircle className="w-5 h-5 text-[#B5935A]" /><h2 className="font-serif text-2xl text-stone-900">Send an enquiry</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-xs uppercase tracking-widest font-semibold text-stone-600">Name<input required name="name" className="w-full border border-[#141414]/15 px-3 py-3 text-sm normal-case tracking-normal font-normal focus:outline-none focus:border-[#B5935A]" /></label>
            <label className="space-y-1.5 text-xs uppercase tracking-widest font-semibold text-stone-600">Email<input required type="email" name="email" className="w-full border border-[#141414]/15 px-3 py-3 text-sm normal-case tracking-normal font-normal focus:outline-none focus:border-[#B5935A]" /></label>
          </div>
          <label className="block space-y-1.5 text-xs uppercase tracking-widest font-semibold text-stone-600">How can we help?<textarea required name="message" rows={6} className="w-full border border-[#141414]/15 px-3 py-3 text-sm normal-case tracking-normal font-normal resize-y focus:outline-none focus:border-[#B5935A]" placeholder="Tell us what you are looking for…" /></label>
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2" role="alert">{error} <a className="underline font-semibold" href="mailto:info@tanelia.shop">Email info@tanelia.shop</a></p>}
          {sent && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2" role="status">Your enquiry has been received by Tanelia.</p>}
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-[#141414] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#302a23] transition-colors disabled:opacity-60 disabled:cursor-wait">{submitting ? 'Sending…' : sent ? 'Send another enquiry' : 'Send enquiry'}<ArrowRight className="w-4 h-4 text-[#B5935A]" /></button>
        </form>
      </div>
    </div>
  );
};
