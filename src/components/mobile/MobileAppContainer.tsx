import React, { useState } from 'react';
import { 
  Home, 
  Sparkles, 
  Camera, 
  Truck, 
  User, 
  ShoppingBag, 
  Heart, 
  Plane, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  Star, 
  ChevronRight, 
  ArrowLeft, 
  QrCode, 
  Smartphone, 
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MOCK_PRODUCTS } from '../../data/mockData';

export const MobileAppContainer: React.FC = () => {
  const { 
    setIsAppMode, 
    products, 
    cartCount, 
    wishlist, 
    formatPrice, 
    addToCart, 
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    setSelectedProductId,
    showToast,
    orders
  } = useStore();

  const [activeTab, setActiveTab] = useState<'feed' | 'shop' | 'vision' | 'radar' | 'concierge'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wigs' | 'bundles'>('all');
  const [conciergeMessages, setConciergeMessages] = useState<Array<{ sender: 'user' | 'stylist'; text: string; time: string }>>([
    { sender: 'stylist', text: 'Hello! I am Emma from the Oslo Atelier. How may I assist you with your raw hair texture or HD lace selection today?', time: '10:04' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [nfcVerified, setNfcVerified] = useState(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Just now' };
    setConciergeMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Stylist automatic reply simulation
    setTimeout(() => {
      let reply = "For red carpet density without weighing down your natural hairline, I recommend our 180% density with the 0.03mm Swiss HD lace. It melts invisibly on all skin undertones.";
      if (userText.toLowerCase().includes('batch') || userText.toLowerCase().includes('delivery') || userText.toLowerCase().includes('shipping')) {
        reply = "Batch #003 orders are consolidated this Sunday at 23:59 CET. After artisan single-knot ventilation in Qingdao, your piece will arrive at our Oslo center in approx. 12-14 business days.";
      } else if (userText.toLowerCase().includes('bleach') || userText.toLowerCase().includes('dye') || userText.toLowerCase().includes('color')) {
        reply = "Because our hair is 100% single-donor raw temple hair with intact cuticles (never acid stripped), you can safely lift it to #613 Platinum or dye it to any fashion shade.";
      }
      setConciergeMessages(prev => [...prev, { sender: 'stylist', text: reply, time: 'Just now' }]);
    }, 1000);
  };

  const handleSimulateNfc = () => {
    setIsNfcScanning(true);
    setNfcVerified(false);
    setTimeout(() => {
      setIsNfcScanning(false);
      setNfcVerified(true);
      showToast('NFC Tag Verified', 'Certificate of Origin: Cambodian Single Donor #VAE-8849-B3', 'gold');
    }, 1800);
  };

  const filtered = products.filter(p => {
    if (selectedCategory === 'wigs') return p.category === 'wigs';
    if (selectedCategory === 'bundles') return p.category === 'bundles';
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-0 sm:p-6 lg:p-8">
      
      {/* Top Controls Bar on Desktop Screen */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-4 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-medium">Native Android Simulator (Pixel 9 Pro)</span>
        </div>
        <button
          onClick={() => setIsAppMode(false)}
          className="bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit App View</span>
        </button>
      </div>

      {/* Main Smartphone Shell */}
      <div className="w-full sm:max-w-md bg-[#FAF8F5] text-stone-900 min-h-screen sm:min-h-[840px] sm:h-[840px] sm:rounded-[48px] sm:border-8 sm:border-stone-800 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative ring-1 ring-white/10">
        
        {/* Status Bar */}
        <div className="bg-[#141414] text-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
          <span>09:41</span>
          {/* Speaker / Dynamic Island */}
          <div className="w-20 h-4 bg-black rounded-full border border-stone-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-900"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>98%</span>
          </div>
        </div>

        {/* App Bar */}
        <div className="bg-[#141414] text-white px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAppMode(false)}
              className="sm:hidden p-1 text-stone-400 hover:text-white"
              title="Close App"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-bold text-sm tracking-[0.2em] text-[#FAF8F5]">VAELYRION</span>
          </div>

          {/* Quick Oslo Batch Pill */}
          <div className="flex items-center gap-2">
            <div className="bg-[#242424] border border-[#B5935A]/40 px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] text-[#B5935A] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5935A] animate-pulse"></span>
              <span>BATCH #003 RADAR</span>
            </div>

            <button
              onClick={() => {
                setIsAppMode(false);
                setCurrentView('wishlist');
              }}
              className="relative p-1.5 text-stone-300 hover:text-white"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#B5935A] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          
          {/* TAB 1: App Feed */}
          {activeTab === 'feed' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              {/* Batch Consolidation Banner */}
              <div className="bg-[#141414] text-white p-4 rounded-xl border border-[#B5935A]/30 space-y-2 relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between text-[10px] text-[#B5935A] font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Weekly Batch #003
                  </span>
                  <span>Closes Sun 23:59 CET</span>
                </div>
                <h3 className="font-serif text-lg text-white font-medium leading-snug">
                  Raw Temple Hair Pre-Orders Open
                </h3>
                <p className="text-[11px] text-stone-300 font-light leading-relaxed">
                  Consolidated on Sunday for immediate artisan ventilation in China. Dispatched to Oslo under sterile white-glove inspection.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="bg-[#B5935A] hover:bg-[#C5A880] text-black text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md transition-colors"
                  >
                    Explore Drops
                  </button>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-wider font-medium px-3 py-1.5 rounded-md transition-colors"
                  >
                    View Radar Map
                  </button>
                </div>
              </div>

              {/* Quick AI Vision Scanner Widget */}
              <div 
                onClick={() => setActiveTab('vision')}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#B5935A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#8E7348]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-stone-900">"Find This Hair" Camera</h4>
                    <p className="text-[10px] text-stone-500 font-light">Scan any screenshot to match exact lace & wave</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              {/* Trending Atelier Curations */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-semibold text-stone-900">Featured Atelier Pieces</h4>
                  <button 
                    onClick={() => setActiveTab('shop')} 
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#8E7348]"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setIsAppMode(false);
                        setCurrentView('product');
                      }}
                      className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs group cursor-pointer"
                    >
                      <div className="aspect-4/5 overflow-hidden bg-stone-100 relative">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                        <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded-xs font-mono font-medium">
                          {p.lengths[0]}
                        </span>
                      </div>
                      <div className="p-2.5 space-y-1">
                        <h5 className="font-serif text-xs font-medium text-stone-900 truncate">{p.title}</h5>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-stone-900">{formatPrice(p.price)}</span>
                          <span className="text-[9px] text-[#8E7348] font-medium">{p.isPreOrder ? 'Pre-Order' : 'In Stock'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NFC Box Authenticator Widget */}
              <div className="bg-[#FAF5ED] p-4 rounded-xl border border-[#E5DAC8] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#8E7348]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">NFC Box Authenticator</span>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Hold your phone near your physical Vaelyrion keepsake box to verify single-donor origin.
                </p>
                <button
                  onClick={handleSimulateNfc}
                  disabled={isNfcScanning}
                  className="w-full bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-wider font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#B5935A]" />
                  <span>{isNfcScanning ? 'Scanning NFC Chip...' : 'Simulate Box Tap'}</span>
                </button>
                {nfcVerified && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-md text-[10px] space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Authentic Single-Donor Hair Verified
                    </p>
                    <p className="text-stone-600">Origin: Siem Reap Temple · Inspection: Oslo Hub #003</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: Shop Catalog */}
          {activeTab === 'shop' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              {/* Category Pills */}
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Hair' },
                  { id: 'wigs', label: 'HD Swiss Wigs' },
                  { id: 'bundles', label: 'Temple Bundles' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-[#141414] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {filtered.map((prod) => (
                  <div 
                    key={prod.id}
                    className="bg-white p-3 rounded-xl border border-stone-200 flex gap-3 shadow-2xs"
                  >
                    <div className="w-20 h-24 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-stone-500">
                          <span className="text-[#8E7348] font-medium uppercase">{prod.hairOrigin}</span>
                          <span className="font-mono">{prod.rating} ★</span>
                        </div>
                        <h4 className="font-serif text-xs font-semibold text-stone-900 leading-snug">{prod.title}</h4>
                        <p className="text-[10px] text-stone-500 font-light truncate">{prod.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="font-mono font-bold text-xs text-stone-900">{formatPrice(prod.price)}</span>
                        <button
                          onClick={() => {
                            addToCart(prod, {
                              length: prod.lengths[0],
                              density: prod.densities[0],
                              lace: prod.laceTypes[0],
                              color: prod.colors[0]
                            });
                          }}
                          className="bg-[#141414] text-white text-[10px] uppercase font-semibold px-3 py-1 rounded-md active:scale-95 transition-transform"
                        >
                          + Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Vision Camera */}
          {activeTab === 'vision' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              <div className="bg-[#141414] text-white p-4 rounded-xl space-y-2 text-center">
                <h3 className="font-serif text-base text-[#FAF8F5]">"Find This Hair" AI Camera</h3>
                <p className="text-[11px] text-stone-300 font-light">
                  Align camera with any photo to extract cuticle direction, wave frequency & lace gauge.
                </p>
              </div>

              {/* Viewfinder Mockup */}
              <div className="aspect-4/3 bg-stone-900 rounded-xl overflow-hidden relative border-2 border-stone-700 shadow-inner flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
                  alt="Camera Vision Feed"
                  className="w-full h-full object-cover opacity-60"
                />
                
                {/* HUD Scan Reticle */}
                <div className="absolute inset-6 border border-[#B5935A]/70 rounded-lg flex flex-col justify-between p-2 pointer-events-none">
                  <div className="flex justify-between text-[9px] text-[#B5935A] font-mono">
                    <span>[98% CONFIDENCE]</span>
                    <span>LACE: 0.03mm HD</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-black/80 text-[#B5935A] text-[9px] px-2 py-0.5 rounded-full font-mono">
                      MATCH: THE SOVEREIGN HD WIG (26")
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>TEXTURE: BODY WAVE</span>
                    <span>ORIGIN: CAMBODIAN RAW</span>
                  </div>
                </div>
              </div>

              {/* Matched Product Action */}
              <div className="bg-white p-3 rounded-xl border border-[#B5935A] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-stone-900">{products[0]?.title}</span>
                  <span className="font-mono font-bold text-[#8E7348]">{formatPrice(products[0]?.price || 420)}</span>
                </div>
                <p className="text-[10px] text-stone-500 font-light">
                  Exact match detected for cuticle flow curvature and HD undetectable Swiss lace.
                </p>
                <button
                  onClick={() => {
                    addToCart(products[0], {
                      length: '26 inch',
                      density: '180%',
                      lace: '13x6 HD Swiss Lace',
                      color: 'Natural Black (#1B)'
                    });
                  }}
                  className="w-full bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold py-2 rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Add Matched Style to Bag
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Cargo Flight Radar */}
          {activeTab === 'radar' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              <div className="bg-[#141414] text-white p-4 rounded-xl border border-[#B5935A]/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#B5935A] font-semibold">
                  <span className="flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5" />
                    Flight EN-882 (Air Corridor)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">ACTIVE TRANSIT</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-white">Oslo Air Cargo Live Radar</h3>
                <p className="text-[10px] text-stone-400 font-light">
                  Consolidated Weekly Batch #003 en route to Oslo Gardermoen Bonded Logistics Hub.
                </p>
              </div>

              {/* Flight Telemetry Milestones */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-xs text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-900">Qingdao Atelier (TAO)</span>
                  <span className="font-mono text-[#8E7348]">➔</span>
                  <span className="font-semibold text-stone-900">Oslo Airport (OSL)</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>Altitude: 36,000 ft</span>
                    <span>Est. Arrival: 16:45 CET</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B5935A] rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Batch PO Generated & Cleared</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Single-Knot Handcrafting Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8E7348] font-medium">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8E7348] border-t-transparent animate-spin inline-block"></span>
                    <span>Air Freight in Progress to Norway</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-200 inline-block"></span>
                    <span>Oslo 3PL White-Glove Argan Oil Conditioning</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Concierge Chat */}
          {activeTab === 'concierge' && (
            <div className="p-4 flex flex-col h-full space-y-3 animate-in fade-in duration-200">
              <div className="bg-[#FAF5ED] p-3 rounded-xl border border-[#E5DAC8] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#141414] text-[#B5935A] flex items-center justify-center font-serif font-bold text-xs">
                  OE
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-stone-900">Oslo Atelier Stylist Concierge</h4>
                  <p className="text-[10px] text-stone-500">Live with Emma · Average reply &lt; 2 min</p>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="space-y-2.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
                {conciergeMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#141414] text-white rounded-br-none' 
                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-stone-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-stone-200">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about lace tint, density, or batch dates..."
                  className="flex-1 bg-white border border-stone-300 text-xs px-3 py-2 rounded-full focus:outline-none focus:border-[#B5935A]"
                />
                <button
                  type="submit"
                  className="bg-[#141414] hover:bg-black text-white p-2.5 rounded-full shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-[#B5935A]" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Native App Bottom Tab Bar */}
        <div className="bg-[#141414] text-stone-400 border-t border-[#2A2A2A] px-2 py-2 flex items-center justify-around shrink-0 select-none">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center justify-center py-1 px-2 transition-colors cursor-pointer ${
              activeTab === 'feed' ? 'text-[#FAF8F5]' : 'hover:text-stone-300'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'feed' ? 'stroke-[2.5] text-[#B5935A]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] mt-0.5 font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center py-1 px-2 transition-colors cursor-pointer ${
              activeTab === 'shop' ? 'text-[#FAF8F5]' : 'hover:text-stone-300'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'shop' ? 'stroke-[2.5] text-[#B5935A]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] mt-0.5 font-medium">Shop</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className="flex flex-col items-center justify-center -mt-3 relative cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
              activeTab === 'vision' 
                ? 'bg-[#B5935A] text-black border-white ring-2 ring-[#B5935A]/50' 
                : 'bg-stone-800 text-white border-stone-600'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-[9px] mt-0.5 font-bold text-[#B5935A]">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex flex-col items-center justify-center py-1 px-2 transition-colors cursor-pointer ${
              activeTab === 'radar' ? 'text-[#FAF8F5]' : 'hover:text-stone-300'
            }`}
          >
            <Plane className={`w-4 h-4 ${activeTab === 'radar' ? 'stroke-[2.5] text-[#B5935A]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] mt-0.5 font-medium">Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`flex flex-col items-center justify-center py-1 px-2 transition-colors cursor-pointer ${
              activeTab === 'concierge' ? 'text-[#FAF8F5]' : 'hover:text-stone-300'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === 'concierge' ? 'stroke-[2.5] text-[#B5935A]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] mt-0.5 font-medium">Stylist</span>
          </button>
        </div>

      </div>

    </div>
  );
};
