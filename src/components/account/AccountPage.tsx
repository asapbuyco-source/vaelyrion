import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Bell, 
  Headphones, 
  Plus, 
  Truck, 
  Sparkles,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AccountPage: React.FC = () => {
  const { 
    orders, 
    savedAddresses, 
    addSavedAddress, 
    notifications, 
    markNotificationRead,
    setSelectedOrder, 
    setCurrentView,
    setIsCartDrawerOpen,
    formatPrice,
    addToCart,
    sendMockPushNotification,
    showToast
  } = useStore();

  const { authUser, isAuthenticated, login, register, logout, authError } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'notifications' | 'support'>('orders');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Norway',
    phone: '',
    isDefault: false
  });

  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
        showToast('Login Successful', 'Welcome back to Tanelia.', 'gold');
      } else {
        await register({
          email: authForm.email,
          password: authForm.password,
          firstName: authForm.firstName,
          lastName: authForm.lastName
        });
        showToast('Account Created', 'Welcome to the Tanelia Society.', 'gold');
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddr.name && newAddr.street && newAddr.city) {
      addSavedAddress(newAddr);
      setShowAddAddressModal(false);
      setNewAddr({ ...newAddr, name: '', street: '', city: '', postalCode: '' });
    }
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (supportMessage) {
      setSupportSent(true);
      showToast('Concierge Inquiry Logged', 'A dedicated hair specialist will contact you within 2 hours.', 'gold');
      setSupportMessage('');
    }
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach(item => {
      addToCart(item.product, {
        length: item.selectedLength,
        density: item.selectedDensity,
        lace: item.selectedLace,
        color: item.selectedColor,
        quantity: item.quantity
      });
    });
    showToast('Items Added to Bag', 'All creations from your previous order added.', 'gold');
    setIsCartDrawerOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pb-24 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white border border-[#141414]/10 rounded-sm shadow-xs mt-12">
          <h2 className="font-serif text-3xl font-medium text-center mb-6">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={authForm.firstName}
                  onChange={e => setAuthForm({ ...authForm, firstName: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-4 py-3 rounded-xs text-[16px] sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={authForm.lastName}
                  onChange={e => setAuthForm({ ...authForm, lastName: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-4 py-3 rounded-xs text-[16px] sm:text-sm"
                />
              </div>
            )}
            <input
              type="email"
              placeholder="Email Address"
              required
              value={authForm.email}
              onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-4 py-3 rounded-xs text-[16px] sm:text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={authForm.password}
              onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#141414]/15 px-4 py-3 rounded-xs text-[16px] sm:text-sm"
            />
            <button
              type="submit"
              className="w-full bg-[#141414] text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-xs"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = authUser?.profile?.first_name ? `${authUser.profile.first_name} ${authUser.profile.last_name}` : authUser?.email;

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Account Header */}
      <div className="bg-[#F4EFEA] border-b border-[#141414]/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#141414] text-[#B5935A] font-serif text-2xl flex items-center justify-center font-semibold shadow-md">
              {fullName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">{fullName}</h1>
                <span className="bg-[#FAF5ED] text-[#8E7348] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                  Society Member
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => logout()}
              className="bg-white hover:bg-stone-50 border border-[#141414]/15 px-3.5 py-2 rounded-xs text-stone-700 font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#141414]/10 gap-8 overflow-x-auto">
          {[
            { id: 'orders', label: 'Order History & Batch Tracking', icon: Package, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length },
            { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => !n.read).length },
            { id: 'support', label: 'Stylist Concierge Support', icon: Headphones }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative cursor-pointer ${
                  activeTab === tab.id ? 'text-[#141414]' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id ? 'bg-[#141414] text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B5935A]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="py-8">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white border border-[#141414]/10 rounded-sm p-12 text-center space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="font-serif text-lg text-stone-900">No previous orders</h3>
                  <p className="text-xs text-stone-500 font-light">Explore our raw hair collections to make your first batch reservation.</p>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="bg-[#141414] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded-xs"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141414]/8 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-xl font-semibold text-stone-900">
                            ORDER #{ord.orderNumber}
                          </h3>
                          <span className="bg-[#FAF5ED] text-[#8E7348] text-xs font-semibold px-2.5 py-0.5 rounded-xs border border-[#E8DFC8]">
                            {ord.batchId.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-1">
                          Placed on {ord.date} · Total: <strong className="font-mono text-stone-900">{formatPrice(ord.total)}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setCurrentView('tracking');
                          }}
                          className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#B5935A]" />
                          <span>Track Live Timeline</span>
                        </button>

                        <button
                          onClick={() => handleReorder(ord)}
                          className="bg-white hover:bg-stone-50 border border-[#141414]/15 text-stone-800 text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-xs p-3 bg-[#FAF8F5] rounded-xs border border-[#141414]/6">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-20 object-cover rounded-xs shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-serif font-semibold text-stone-900 leading-snug">{item.product.title}</h5>
                              <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                {item.selectedLength} · {item.selectedDensity} · {item.selectedLace}
                              </p>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-stone-500">Qty: {item.quantity}</span>
                              <span className="font-mono font-semibold text-stone-900">{formatPrice(item.unitPrice * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Current Step preview */}
                    <div className="p-3 bg-[#FAF5ED] rounded-xs border border-[#E5DAC8] text-xs text-[#7A5B28] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#8E7348]" />
                        <span>Status: <strong className="capitalize">{ord.orderStatus.replace(/_/g, ' ')}</strong></span>
                      </div>
                      <span className="font-mono text-[11px] truncate ml-2">Waybill: {ord.trackingNumber}</span>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600 font-light">
                  Manage your saved international and domestic delivery destinations.
                </p>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white border border-[#141414]/10 rounded-sm p-6 space-y-3 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-semibold text-stone-900">{addr.name}</h4>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#8E7348] bg-[#FAF5ED] px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {addr.street}<br />
                      {addr.postalCode} {addr.city}, {addr.country}<br />
                      Phone: {addr.phone}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[#FAF8F5] max-w-md w-full rounded-sm p-6 sm:p-8 space-y-5 border border-[#141414]/10 shadow-2xl">
                    <h3 className="font-serif text-xl font-medium text-stone-900">Add New Shipping Address</h3>
                    <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Label (e.g. Oslo Penthouse)</label>
                        <input
                          type="text"
                          required
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-3 rounded-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-3 rounded-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full bg-white border border-[#141414]/15 px-3 py-3 rounded-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Postal Code</label>
                          <input
                            type="text"
                            required
                            value={newAddr.postalCode}
                            onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                            className="w-full bg-white border border-[#141414]/15 px-3 py-3 rounded-xs"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="flex-1 py-2.5 text-stone-600 border border-[#141414]/20 rounded-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-[#141414] text-white rounded-xs font-semibold uppercase tracking-wider"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-5 rounded-sm border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white border-[#141414]/10 text-stone-600'
                      : 'bg-[#FAF5ED] border-[#B5935A]/50 text-stone-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[#8E7348]">{notif.title}</span>
                    <span className="text-stone-400 text-[11px]">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs font-light leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <div className="max-w-2xl bg-white border border-[#141414]/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium text-stone-900">Bespoke Hair Stylist Concierge</h3>
                <p className="text-xs text-stone-500 font-light">
                  Direct liaison with our master wigmakers and Scandinavian logistics specialists.
                </p>
              </div>

              <form onSubmit={handleSendSupport} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">
                    How can we assist your curation today?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Ask about lace custom tinting, batch dispatch dates, hair density advice, or custom order inquiries..."
                    className="w-full bg-[#FAF8F5] border border-[#141414]/15 p-3 rounded-xs focus:outline-none focus:border-[#B5935A] font-light"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-xs transition-colors cursor-pointer"
                >
                  Transmit Message to Concierge
                </button>
              </form>

              {supportSent && (
                <p className="text-xs text-[#8E7348] font-medium bg-[#FAF5ED] p-3 rounded-xs border border-[#E8DFC8]">
                  ✓ Message received by Oslo Concierge team. We will reply to {authUser?.email}.
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
