import React, { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Boxes, Headphones, LayoutDashboard, LogOut, Package, Search, ShieldAlert, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../lib/api';

type Tab = 'overview' | 'products' | 'orders' | 'customers' | 'contacts' | 'journal';

const cardClass = 'bg-white border border-[#141414]/10 rounded-sm p-5 shadow-sm';

export const AdminPage: React.FC = () => {
  const { isAdmin, isAuthLoading, logout } = useAuth();
  const { setCurrentView, showToast } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({ title: '', excerpt: '', content: '', seo_title: '', seo_description: '', focus_keyword: '', status: 'draft' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const load = async (nextTab = tab) => {
    setLoading(true);
    try {
      if (nextTab === 'overview') setOverview(await api.admin.overview());
      if (nextTab === 'products') setRows(await api.admin.products(search));
      if (nextTab === 'orders') setRows(await api.admin.orders());
      if (nextTab === 'customers') setRows(await api.admin.customers());
      if (nextTab === 'contacts') setRows(await api.admin.contacts());
      if (nextTab === 'journal') setRows(await api.admin.articles());
    } catch (error: any) {
      showToast('Dashboard unavailable', error.message || 'Unable to load admin data.', 'info');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, tab]);

  if (isAuthLoading) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs uppercase tracking-widest text-stone-500">Checking access</div>;
  if (!isAdmin) return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
      <div className={cardClass + ' max-w-md'}><ShieldAlert className="w-8 h-8 mx-auto mb-4 text-[#B5935A]" /><h1 className="font-serif text-2xl mb-2">Private studio area</h1><p className="text-sm text-stone-500 mb-5">This dashboard is available to Tanelia staff only.</p><button onClick={() => setCurrentView('account')} className="bg-[#141414] text-white px-5 py-3 text-xs uppercase tracking-widest">Return to account</button></div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'contacts', label: 'Enquiries', icon: Headphones },
    { id: 'journal', label: 'Journal & SEO', icon: BookOpen },
  ];

  const updateProductStatus = async (product: any) => {
    try { await api.admin.updateProduct(product.id, { status: product.status === 'active' ? 'draft' : 'active' }); await load('products'); showToast('Product updated', 'Catalog status saved.', 'gold'); } catch (error: any) { showToast('Update failed', error.message, 'info'); }
  };

  return <div className="min-h-screen bg-[#F5F1EC] text-[#141414]">
    <div className="bg-[#141414] text-white px-4 sm:px-8 py-5 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.25em] text-[#B5935A]">Tanelia / Studio</p><h1 className="font-serif text-2xl">Commerce & Editorial</h1></div><button onClick={async () => { await logout(); setCurrentView('home'); }} className="flex items-center gap-2 text-xs text-stone-300 hover:text-white"><LogOut className="w-4 h-4" /> Sign out</button></div>
    <div className="max-w-[1500px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-3 text-left text-xs uppercase tracking-wider ${tab === id ? 'bg-[#141414] text-white' : 'text-stone-600 hover:bg-white'}`}><Icon className="w-4 h-4" />{label}</button>)}</aside>
      <main className="min-w-0">
        {tab === 'overview' && <><div className="flex items-end justify-between mb-6"><div><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Good morning</p><h2 className="font-serif text-3xl">Studio overview</h2></div><BarChart3 className="w-7 h-7 text-[#B5935A]" /></div><div className="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-8">{[['Active products', overview?.counts.products], ['Customers', overview?.counts.customers], ['Paid orders', overview?.counts.paidOrders], ['New enquiries', overview?.counts.newContacts], ['Drafts', overview?.counts.drafts]].map(([label, value]) => <div className={cardClass} key={String(label)}><p className="text-[10px] uppercase tracking-wider text-stone-500">{label}</p><p className="font-serif text-3xl mt-2">{loading ? '—' : value ?? 0}</p></div>)}</div><div className={cardClass}><h3 className="font-serif text-xl mb-4">Recent orders</h3>{(overview?.recentOrders || []).length === 0 ? <p className="text-sm text-stone-500">No recent orders yet.</p> : <div className="overflow-x-auto"><table className="w-full text-xs"><tbody>{overview.recentOrders.map((order: any) => <tr key={order.id} className="border-t border-stone-100"><td className="py-3 font-mono">{order.id.slice(0, 8)}</td><td>{order.status}</td><td>{order.payment_status}</td><td className="text-right">€{Number(order.total || 0).toFixed(0)}</td></tr>)}</tbody></table></div>}</div></>}
        {tab === 'products' && <><Toolbar title="Products" search={search} setSearch={setSearch} onSearch={() => load('products')} /><div className={cardClass + ' overflow-x-auto'}><table className="w-full text-xs"><thead><tr className="text-left text-stone-500 uppercase tracking-wider"><th className="py-3">Product</th><th>Price</th><th>Status</th><th>Pre-order</th><th></th></tr></thead><tbody>{rows.map(product => <tr key={product.id} className="border-t border-stone-100"><td className="py-3 font-medium">{product.name}</td><td>€{Number(product.selling_price || 0).toFixed(0)}</td><td>{product.status}</td><td>{product.is_preorder ? 'Yes' : 'No'}</td><td className="text-right"><button onClick={() => updateProductStatus(product)} className="underline">{product.status === 'active' ? 'Unpublish' : 'Publish'}</button></td></tr>)}</tbody></table></div></>}
        {tab === 'orders' && <DataTable title="Orders" columns={['Order', 'Customer', 'Status', 'Payment', 'Total']} rows={rows} render={(row) => <><td className="py-3 font-mono">{row.order_number || row.id.slice(0, 8)}</td><td>{row.users?.email || '—'}</td><td><select value={row.status} onChange={async e => { await api.admin.updateOrder(row.id, e.target.value); await load('orders'); }} className="bg-transparent border-b border-stone-200 py-1"><option>{row.status}</option><option>CONFIRMED</option><option>IN_WEEKLY_BATCH</option><option>SHIPPED_FROM_CHINA</option><option>ARRIVED_IN_NORWAY</option><option>DELIVERED</option><option>CANCELLED</option></select></td><td>{row.payment_status}</td><td>€{Number(row.total || 0).toFixed(0)}</td></>} />}
        {tab === 'customers' && <DataTable title="Customers" columns={['Name', 'Email', 'Role', 'Status', 'Joined']} rows={rows} render={(row) => <><td className="py-3">{`${row.first_name || ''} ${row.last_name || ''}`.trim() || '—'}</td><td>{row.email}</td><td>{row.role}</td><td>{row.status}</td><td>{new Date(row.created_at).toLocaleDateString()}</td></>} />}
        {tab === 'contacts' && <DataTable title="Client enquiries" columns={['Client', 'Email', 'Message', 'Status', 'Received']} rows={rows} render={(row) => <><td className="py-3">{row.name}</td><td>{row.email}</td><td className="max-w-sm truncate">{row.message}</td><td><select value={row.status} onChange={async e => { await api.admin.updateContact(row.id, e.target.value); await load('contacts'); }} className="bg-transparent border-b border-stone-200 py-1"><option>new</option><option>in_progress</option><option>resolved</option></select></td><td>{new Date(row.created_at).toLocaleDateString()}</td></>} />}
        {tab === 'journal' && <><div className="flex items-end justify-between mb-6"><div><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Content studio</p><h2 className="font-serif text-3xl">Journal & SEO</h2></div><span className="text-xs text-stone-500">AI output stays in draft until approved.</span></div><div className="grid xl:grid-cols-[1fr_1.2fr] gap-6"><div className={cardClass + ' space-y-3'}><div className="bg-[#FAF5ED] border border-[#E8DFC8] p-4 space-y-3"><p className="text-xs font-semibold uppercase tracking-wider text-[#7A5B2A]">Editorial assistant</p><input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="Topic, e.g. how to care for raw hair bundles" className="w-full bg-white border border-stone-200 px-3 py-2 outline-none text-sm" /><button disabled={!aiTopic.trim() || isGenerating} onClick={async () => { setIsGenerating(true); try { const draft = await api.admin.generateArticle(aiTopic, article.focus_keyword); setArticle({ ...article, ...draft }); showToast('Draft generated', 'Review the copy before saving or publishing.', 'gold'); } catch (error: any) { showToast('AI draft unavailable', error.message, 'info'); } finally { setIsGenerating(false); } }} className="bg-[#141414] text-white px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50">{isGenerating ? 'Writing draft…' : 'Generate draft'}</button></div><input value={article.title} onChange={e => setArticle({ ...article, title: e.target.value })} placeholder="Article title" className="w-full border-b border-stone-200 py-3 outline-none font-serif text-xl" /><input value={article.focus_keyword} onChange={e => setArticle({ ...article, focus_keyword: e.target.value })} placeholder="Focus keyword" className="w-full border-b border-stone-200 py-3 outline-none" /><input value={article.seo_title} onChange={e => setArticle({ ...article, seo_title: e.target.value })} placeholder="SEO title" className="w-full border-b border-stone-200 py-3 outline-none" /><textarea value={article.seo_description} onChange={e => setArticle({ ...article, seo_description: e.target.value })} placeholder="SEO description" className="w-full border-b border-stone-200 py-3 outline-none min-h-20" /><textarea value={article.content} onChange={e => setArticle({ ...article, content: e.target.value })} placeholder="Draft content" className="w-full border border-stone-200 p-3 outline-none min-h-64" /><button onClick={async () => { try { await api.admin.saveArticle(article); setArticle({ title: '', excerpt: '', content: '', seo_title: '', seo_description: '', focus_keyword: '', status: 'draft' }); await load('journal'); showToast('Draft saved', 'The article is ready for editorial review.', 'gold'); } catch (error: any) { showToast('Could not save draft', error.message, 'info'); } }} className="bg-[#141414] text-white px-5 py-3 text-xs uppercase tracking-widest">Save draft</button></div><div className={cardClass}><h3 className="font-serif text-xl mb-4">Existing drafts</h3>{rows.map(row => <div key={row.id} className="border-t border-stone-100 py-4"><div className="flex justify-between gap-4"><strong>{row.title}</strong><span className="text-[10px] uppercase tracking-wider text-[#8E7348]">{row.status}</span></div><p className="text-xs text-stone-500 mt-1">{row.seo_title || 'No SEO title yet'}</p><button onClick={async () => { try { await api.admin.saveArticle({ ...row, status: row.status === 'published' ? 'draft' : 'published' }); await load('journal'); showToast(row.status === 'published' ? 'Article moved to draft' : 'Article published', row.status === 'published' ? 'It is no longer visible publicly.' : 'The article is now live in the Journal.', 'gold'); } catch (error: any) { showToast('Could not update article', error.message, 'info'); } }} className="mt-3 text-[10px] uppercase tracking-widest underline underline-offset-4">{row.status === 'published' ? 'Unpublish' : 'Review & publish'}</button></div>)}</div></div></>}
      </main>
    </div>
  </div>;
};

const Toolbar: React.FC<{ title: string; search: string; setSearch: (value: string) => void; onSearch: () => void }> = ({ title, search, setSearch, onSearch }) => <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Catalog control</p><h2 className="font-serif text-3xl">{title}</h2></div><div className="flex border-b border-stone-300"><Search className="w-4 h-4 text-stone-400 my-2 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch()} placeholder="Search products" className="bg-transparent py-2 outline-none text-sm" /></div></div>;

const DataTable: React.FC<{ title: string; columns: string[]; rows: any[]; render: (row: any) => React.ReactNode }> = ({ title, columns, rows, render }) => <><div className="mb-6"><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Studio records</p><h2 className="font-serif text-3xl">{title}</h2></div><div className={cardClass + ' overflow-x-auto'}><table className="w-full text-xs"><thead><tr className="text-left text-stone-500 uppercase tracking-wider">{columns.map(column => <th key={column} className="py-3 pr-4 whitespace-nowrap">{column}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t border-stone-100">{render(row)}</tr>)}</tbody></table>{rows.length === 0 && <p className="py-8 text-sm text-stone-500">No records found.</p>}</div></>;
