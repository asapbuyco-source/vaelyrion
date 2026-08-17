import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Truck, 
  Users, 
  DollarSign, 
  Plus, 
  Check, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Building2, 
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Settings
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Supplier, WeeklyBatch } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    setProducts, 
    batches, 
    approveBatch, 
    generateSupplierPO, 
    suppliers, 
    updateSupplier, 
    orders, 
    formatPrice,
    setCurrentView,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'products' | 'suppliers'>('batches');
  
  // New Product Modal State
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    title: '',
    subtitle: '',
    category: 'wigs',
    price: 450,
    supplierCost: 170,
    isPreOrder: true,
    estimatedDelivery: '10–18 business days (Batch Delivery to Norway & Europe)',
    hairOrigin: '100% Raw Virgin Cambodian Temple Hair',
    description: '',
    lengths: ['18 inch', '22 inch', '26 inch'],
    densities: ['180%', '200%'],
    laceTypes: ['13x6 HD Lace', '13x4 HD Swiss Lace'],
    colors: ['Natural Black (#1B)', 'Jet Black (#1)'],
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85']
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 44010; // including historical
  const totalSupplierCost = 16250;
  const totalGrossProfit = totalRevenue - totalSupplierCost;
  const grossMarginPercent = ((totalGrossProfit / totalRevenue) * 100).toFixed(1);

  const activeBatch = batches.find(b => b.status === 'collecting') || batches[0];

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      title: newProd.title || 'Untitled Creation',
      slug: (newProd.title || 'product').toLowerCase().replace(/\s+/g, '-'),
      subtitle: newProd.subtitle || 'Raw Virgin Hair',
      category: newProd.category as any || 'wigs',
      price: Number(newProd.price) || 350,
      supplierCost: Number(newProd.supplierCost) || 120,
      rating: 5.0,
      reviewCount: 1,
      images: newProd.images || ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85'],
      isPreOrder: newProd.isPreOrder ?? true,
      estimatedDelivery: newProd.estimatedDelivery || '10–18 business days',
      stockCount: newProd.isPreOrder ? 0 : 15,
      textures: ['Straight', 'Body Wave'],
      lengths: newProd.lengths || ['20 inch', '24 inch'],
      densities: newProd.densities || ['180%'],
      laceTypes: newProd.laceTypes || ['13x6 HD Lace'],
      colors: newProd.colors || ['Natural Black (#1B)'],
      description: newProd.description || 'Artisan handcrafted luxury raw hair.',
      hairOrigin: newProd.hairOrigin || '100% Single Donor Temple Hair',
      details: ['Pre-plucked natural hairline', 'Single-knot ventilation'],
      careInstructions: ['Co-wash with sulfate-free shampoo'],
      supplierId: 'sup-01',
      isNew: true
    };

    setProducts(prev => [created, ...prev]);
    setShowNewProductModal(false);
    showToast('Product Created', `${created.title} added to live catalog.`, 'gold');
  };

  const toggleProductStock = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextPreOrder = !p.isPreOrder;
        return {
          ...p,
          isPreOrder: nextPreOrder,
          estimatedDelivery: nextPreOrder 
            ? '10–18 business days (Batch Delivery to Norway & Europe)'
            : '2–4 business days (In Stock — Direct Norway 3PL Dispatch)',
          stockCount: nextPreOrder ? 0 : 20
        };
      }
      return p;
    }));
    showToast('Stock State Updated', 'Fulfillment routing parameters modified.', 'gold');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Admin Suite Top Navigation Header */}
      <div className="bg-[#141414] text-white border-b border-[#2A2A2A] px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl tracking-[0.2em] font-semibold text-[#FAF8F5]">
              VAELYRION
            </span>
            <span className="text-[10px] bg-[#B5935A] text-black font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
              Operations & Supply Suite
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setCurrentView('home')}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Client Storefront
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#141414]/10 rounded-sm p-5 shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium flex items-center justify-between">
              Total Gross Revenue
              <DollarSign className="w-4 h-4 text-[#B5935A]" />
            </span>
            <h3 className="font-mono text-2xl font-semibold text-stone-900">{formatPrice(totalRevenue)}</h3>
            <p className="text-[11px] text-emerald-700 font-medium">↑ +24.8% vs last month</p>
          </div>

          <div className="bg-white border border-[#141414]/10 rounded-sm p-5 shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium flex items-center justify-between">
              Estimated Gross Margin
              <TrendingUp className="w-4 h-4 text-[#B5935A]" />
            </span>
            <h3 className="font-mono text-2xl font-semibold text-stone-900">{grossMarginPercent}%</h3>
            <p className="text-[11px] text-stone-500 font-light">Supplier Cost: {formatPrice(totalSupplierCost)}</p>
          </div>

          <div className="bg-white border border-[#141414]/10 rounded-sm p-5 shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium flex items-center justify-between">
              Batch #003 Pre-Orders
              <Calendar className="w-4 h-4 text-[#B5935A]" />
            </span>
            <h3 className="font-mono text-2xl font-semibold text-stone-900">{activeBatch.totalUnits} Units</h3>
            <p className="text-[11px] text-[#8E7348] font-medium">Closes Sunday 23:59 CET</p>
          </div>

          <div className="bg-white border border-[#141414]/10 rounded-sm p-5 shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium flex items-center justify-between">
              Active Suppliers (China)
              <Building2 className="w-4 h-4 text-[#B5935A]" />
            </span>
            <h3 className="font-mono text-2xl font-semibold text-stone-900">{suppliers.length} Ateliers</h3>
            <p className="text-[11px] text-emerald-700 font-medium">100% Quality Inspected</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#141414]/10 gap-8 overflow-x-auto">
          {[
            { id: 'batches', label: 'Weekly Batch Management (Consolidated POs)', icon: Layers },
            { id: 'products', label: 'Product Catalog & Pre-Order Rules', icon: Package },
            { id: 'suppliers', label: 'Supplier Atelier Registry (China)', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative cursor-pointer ${
                  activeTab === tab.id ? 'text-black' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B5935A]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: WEEKLY BATCH MANAGEMENT */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-medium text-stone-900">Weekly Pre-Order Batch Pipeline</h3>
                <p className="text-xs text-stone-500 font-light">
                  Orders collected weekly from customers → Grouped into consolidated factory POs → Flown to Oslo 3PL.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white border border-[#141414]/10 rounded-sm p-6 space-y-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-[#FAF5ED] px-2.5 py-1 rounded-xs border border-[#E8DFC8]">
                        {batch.batchNumber}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs ${
                        batch.status === 'collecting' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : batch.status === 'shipped_china'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {batch.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-stone-900">{batch.title}</h4>
                    <p className="text-xs text-stone-500 font-light">Cut-off: <strong>{batch.cutOffDate}</strong></p>

                    {/* Breakdown Summary */}
                    <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#141414]/6 space-y-1 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Total Units:</span>
                        <strong className="text-stone-900">{batch.totalUnits} items</strong>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Factory Cost:</span>
                        <span className="font-mono text-stone-900">{formatPrice(batch.totalSupplierCost)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Customer Revenue:</span>
                        <span className="font-mono font-semibold text-stone-900">{formatPrice(batch.totalCustomerRevenue)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600 pt-1 border-t border-[#141414]/6">
                        <span>Gross Margin:</span>
                        <strong className="text-emerald-700 font-mono font-bold">{batch.expectedMargin}%</strong>
                      </div>
                    </div>

                    {/* Category Units Breakdown */}
                    <div className="space-y-1 text-[11px] text-stone-600 font-light">
                      <span className="font-semibold text-stone-900 block text-xs">Item Allocations:</span>
                      {batch.productsSummary.map((p, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{p.category}:</span>
                          <span className="font-mono">{p.units} units ({formatPrice(p.revenue)})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#141414]/8 flex flex-col gap-2">
                    {batch.status === 'collecting' && (
                      <>
                        <button
                          onClick={() => generateSupplierPO(batch.id)}
                          className="w-full bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-wider font-semibold py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#B5935A]" />
                          <span>Generate Supplier PO ({batch.poDocumentNumber})</span>
                        </button>
                        <button
                          onClick={() => approveBatch(batch.id)}
                          className="w-full bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs uppercase tracking-wider font-bold py-2 rounded-xs transition-colors cursor-pointer"
                        >
                          Transmit PO to Qingdao Factory
                        </button>
                      </>
                    )}

                    {batch.status !== 'collecting' && (
                      <div className="text-xs text-stone-500 flex items-center justify-between">
                        <span>PO Document: <strong className="font-mono">{batch.poDocumentNumber}</strong></span>
                        <span className="text-emerald-700 font-medium">✓ Dispatched</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-medium text-stone-900">Atelier Product Catalog</h3>
                <p className="text-xs text-stone-500 font-light">
                  Manage retail prices, supplier raw costs, pre-order vs in-stock toggles, and delivery promises.
                </p>
              </div>

              <button
                onClick={() => setShowNewProductModal(true)}
                className="bg-[#141414] hover:bg-[#2A2A2A] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#B5935A]" />
                <span>Add New Creation</span>
              </button>
            </div>

            <div className="bg-white border border-[#141414]/10 rounded-sm overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFEA] border-b border-[#141414]/10 text-stone-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 font-semibold">Creation</th>
                      <th className="p-3.5 font-semibold">Category</th>
                      <th className="p-3.5 font-semibold">Retail Price</th>
                      <th className="p-3.5 font-semibold">Supplier Cost</th>
                      <th className="p-3.5 font-semibold">Gross Profit</th>
                      <th className="p-3.5 font-semibold">Fulfillment Mode</th>
                      <th className="p-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141414]/6 font-light text-stone-800">
                    {products.map((p) => {
                      const profit = p.price - p.supplierCost;
                      const margin = ((profit / p.price) * 100).toFixed(0);
                      return (
                        <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={p.images[0]} alt={p.title} className="w-10 h-12 object-cover rounded-xs" />
                            <div>
                              <strong className="font-serif font-medium text-stone-900 block text-xs sm:text-sm">{p.title}</strong>
                              <span className="text-[11px] text-stone-500 font-mono">{p.hairOrigin}</span>
                            </div>
                          </td>
                          <td className="p-3.5 uppercase text-[11px] font-medium text-stone-600">{p.category}</td>
                          <td className="p-3.5 font-mono font-semibold text-stone-900">{formatPrice(p.price)}</td>
                          <td className="p-3.5 font-mono text-stone-500">{formatPrice(p.supplierCost)}</td>
                          <td className="p-3.5 font-mono text-emerald-800 font-medium">
                            +{formatPrice(profit)} ({margin}%)
                          </td>
                          <td className="p-3.5">
                            {p.isPreOrder ? (
                              <span className="inline-block bg-[#FAF5ED] text-[#8E7348] text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-[#E8DFC8]">
                                Pre-Order (Batch)
                              </span>
                            ) : (
                              <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-emerald-200">
                                In Stock ({p.stockCount} in Oslo)
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => toggleProductStock(p.id)}
                              className="text-[11px] text-stone-600 hover:text-black underline cursor-pointer"
                            >
                              {p.isPreOrder ? 'Switch to In Stock' : 'Switch to Pre-Order'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Product Modal */}
            {showNewProductModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#FAF8F5] max-w-xl w-full rounded-sm p-6 sm:p-8 space-y-5 border border-[#141414]/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="font-serif text-2xl font-medium text-stone-900">Add New Atelier Creation</h3>
                  
                  <form onSubmit={handleSaveNewProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={newProd.title}
                        onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                        placeholder="e.g. Imperial Silk Straight HD Lace Wig"
                        className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Category</label>
                        <select
                          value={newProd.category}
                          onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs"
                        >
                          <option value="wigs">Wigs</option>
                          <option value="bundles">Bundles</option>
                          <option value="frontals">Frontals</option>
                          <option value="closures">Closures</option>
                          <option value="extensions">Extensions</option>
                          <option value="accessories">Accessories</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Hair Origin</label>
                        <input
                          type="text"
                          value={newProd.hairOrigin}
                          onChange={(e) => setNewProd({ ...newProd, hairOrigin: e.target.value })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Retail Price (EUR)</label>
                        <input
                          type="number"
                          required
                          value={newProd.price}
                          onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Factory Cost (EUR)</label>
                        <input
                          type="number"
                          required
                          value={newProd.supplierCost}
                          onChange={(e) => setNewProd({ ...newProd, supplierCost: Number(e.target.value) })}
                          className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-600 block mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={newProd.description}
                        onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                        className="w-full bg-white border border-[#141414]/15 px-3 py-2 rounded-xs font-light"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isPreOrder"
                        checked={newProd.isPreOrder}
                        onChange={(e) => setNewProd({ ...newProd, isPreOrder: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="isPreOrder" className="text-xs text-stone-800 font-medium">
                        Set as Pre-Order item (Consolidated into Weekly Batches)
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#141414]/10">
                      <button
                        type="button"
                        onClick={() => setShowNewProductModal(false)}
                        className="flex-1 py-2.5 text-stone-600 border border-[#141414]/20 rounded-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-[#141414] text-white rounded-xs font-semibold uppercase tracking-wider"
                      >
                        Publish to Store
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SUPPLIER REGISTRY */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-stone-900">Partner Factories & OEM Ateliers</h3>
              <p className="text-xs text-stone-500 font-light">
                Direct audited manufacturing partners in Qingdao, Guangzhou, and Xuchang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-white border border-[#141414]/10 rounded-sm p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-xs border border-emerald-200">
                      {sup.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-700">⭐ {sup.qualityRating}</span>
                  </div>

                  <h4 className="font-serif text-base font-semibold text-stone-900">{sup.name}</h4>
                  <p className="text-xs text-stone-500 font-light">{sup.location}</p>

                  <div className="space-y-1.5 text-xs text-stone-700 font-light bg-[#FAF8F5] p-3 rounded-xs border border-[#141414]/6">
                    <p><strong className="font-medium text-stone-900">Specialty:</strong> {sup.specialty}</p>
                    <p><strong className="font-medium text-stone-900">MOQ:</strong> {sup.moq} units</p>
                    <p><strong className="font-medium text-stone-900">Lead Time:</strong> {sup.leadTimeDays} business days</p>
                    <p><strong className="font-medium text-stone-900">Contact:</strong> {sup.contact}</p>
                  </div>

                  <p className="text-[11px] text-stone-500 font-light italic">
                    "{sup.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
