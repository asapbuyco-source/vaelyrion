import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars first
dotenv.config();

// Route imports
import authRoutes from '../server/routes/auth.routes.js';
import productRoutes from '../server/routes/product.routes.js';
import cartRoutes from '../server/routes/cart.routes.js';
import checkoutRoutes from '../server/routes/checkout.routes.js';
import orderRoutes from '../server/routes/order.routes.js';
import contactRoutes from '../server/routes/contact.routes.js';
import adminRoutes from '../server/routes/admin.routes.js';
import contentRoutes from '../server/routes/content.routes.js';
import { AdminController } from '../server/controllers/admin.controller.js';
import { supabase } from '../server/config/supabase.js';

const app = express();
const port = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Stripe webhook needs RAW body for signature verification — register BEFORE express.json()
app.use('/api/v1/checkout/webhook', express.raw({ type: 'application/json' }), (req: any, _res, next) => {
  req.rawBody = req.body;
  next();
});

// Standard JSON body parser for all other routes
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.post('/api/cron/generate-content', AdminController.generateScheduledDraft);
app.get('/api/cron/generate-content', AdminController.generateScheduledDraft);

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  let database: 'ok' | 'error' = 'ok';
  let databaseError: string | undefined;

  try {
    const { error } = await supabase.from('products').select('id', { count: 'exact', head: true });
    if (error) throw error;
  } catch (error: any) {
    database = 'error';
    databaseError = process.env.NODE_ENV === 'production' ? 'Database unavailable' : error.message;
  }

  res.status(database === 'ok' ? 200 : 503).json({
    status: database === 'ok' ? 'ok' : 'degraded',
    service: 'Tanelia API',
    database,
    ...(databaseError ? { databaseError } : {}),
    timestamp: new Date().toISOString()
  });
});

// Sitemap (SEO) — dynamic, generated from the catalog and journal
app.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const origin = process.env.SITE_URL || 'https://www.tanelia.shop';
    const [products, articles] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('status', 'active'),
      supabase.from('journal_articles').select('slug, published_at').eq('status', 'published')
    ]);
    if (products.error) throw products.error;
    if (articles.error) throw articles.error;

    const staticPages: Array<{ loc: string; priority: string; freq: string; lastmod?: string }> = [
      { loc: `${origin}/`, priority: '1.0', freq: 'daily' },
      { loc: `${origin}/shop`, priority: '0.8', freq: 'daily' },
      { loc: `${origin}/journal`, priority: '0.7', freq: 'weekly' },
      { loc: `${origin}/find-hair`, priority: '0.6', freq: 'weekly' },
      { loc: `${origin}/about`, priority: '0.4', freq: 'monthly' },
      { loc: `${origin}/faq`, priority: '0.4', freq: 'monthly' },
      { loc: `${origin}/contact`, priority: '0.4', freq: 'monthly' },
      { loc: `${origin}/shipping-policy`, priority: '0.2', freq: 'monthly' },
      { loc: `${origin}/returns-policy`, priority: '0.2', freq: 'monthly' }
    ];
    const productUrls = (products.data || []).map((p: any) => ({
      loc: `${origin}/products/${encodeURIComponent(p.slug)}`,
      priority: '0.8',
      freq: 'weekly',
      lastmod: p.updated_at || undefined
    }));
    const articleUrls = (articles.data || []).map((a: any) => ({
      loc: `${origin}/journal/${encodeURIComponent(a.slug)}`,
      priority: '0.6',
      freq: 'monthly',
      lastmod: a.published_at || undefined
    }));

    const urls = [...staticPages, ...productUrls, ...articleUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unable to generate sitemap' });
  }
});

// 404 fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`\n🚀 Tanelia backend running on http://localhost:${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Supabase: ${process.env.SUPABASE_URL ? '✓ Connected' : '✗ Missing URL'}\n`);
  });
}

export default app;
