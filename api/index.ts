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
import settingsRoutes from '../server/routes/settings.routes.js';
import { analyticsRouter } from '../server/routes/analytics.routes.js';
import { AdminController } from '../server/controllers/admin.controller.js';
import { CheckoutController } from '../server/controllers/checkout.controller.js';
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
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/analytics', analyticsRouter);
app.post('/api/cron/generate-content', AdminController.generateScheduledDraft);
app.get('/api/cron/generate-content', AdminController.generateScheduledDraft);
app.post('/api/cron/cleanup-stale-orders', CheckoutController.cleanupStaleOrders as any);
app.get('/api/cron/cleanup-stale-orders', CheckoutController.cleanupStaleOrders as any);

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

// SPA shell with server-side SEO meta injection (for crawlers that don't execute JS)
import fs from 'fs';
import path from 'path';

let spaShellCache: string | null = null;

const getSpaShell = (): string | null => {
  if (spaShellCache !== null) return spaShellCache;
  const candidates = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), '..', 'dist', 'index.html'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        spaShellCache = fs.readFileSync(candidate, 'utf-8');
        return spaShellCache;
      }
    } catch { /* try next */ }
  }
  return null;
};

const escapeHtml = (value: any): string =>
  String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const injectMeta = (html: string, meta: { title: string; description: string; canonical: string; image?: string; jsonLd?: object }) => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image || '/brand/tanelia-favicon.png');
  const jsonLd = meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : '';
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace('</head>', `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />\n<meta property="og:url" content="${escapeHtml(meta.canonical)}" />\n<meta property="og:image" content="${image}" />\n${jsonLd}\n</head>`);
};

const serveSpa = async (res: Response, meta: { title: string; description: string; canonical: string; image?: string; jsonLd?: object }) => {
  const shell = getSpaShell();
  if (!shell) return res.status(200).send('<!doctype html><html><head><meta charset="utf-8"><title>Tanelia</title></head><body><div id="root"></div></body></html>');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(injectMeta(shell, meta));
};

// SEO: server-rendered meta for product pages
app.get('/products/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const origin = process.env.SITE_URL || 'https://www.tanelia.shop';
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error || !data) {
      return serveSpa(res, {
        title: 'Tanelia | Single-Donor Hair, Fine Swiss Lace & Care',
        description: 'Discover Tanelia hair: single-donor wigs, fine Swiss lace, raw bundles, extensions, and considered care prepared in Oslo.',
        canonical: `${origin}/products/${encodeURIComponent(slug)}`,
      });
    }
    const images = Array.isArray(data.product_images) ? data.product_images.map((img: any) => img.image_url).filter(Boolean) : [];
    const image = images[0] || '/brand/tanelia-favicon.png';
    const title = data.seo_title || `${data.name} | Tanelia`;
    const description = data.seo_description || data.description || `${data.name} — a considered Tanelia creation in single-donor hair.`;
    await serveSpa(res, {
      title,
      description,
      canonical: `${origin}/products/${encodeURIComponent(data.slug)}`,
      image,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description || description,
        image,
        brand: { '@type': 'Brand', name: 'Tanelia' },
        sku: data.slug,
        offers: {
          '@type': 'Offer',
          url: `${origin}/products/${encodeURIComponent(data.slug)}`,
          priceCurrency: 'EUR',
          price: data.selling_price,
          availability: data.is_preorder ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
        },
      },
    });
  } catch (error: any) {
    return serveSpa(res, {
      title: 'Tanelia | Single-Donor Hair, Fine Swiss Lace & Care',
      description: 'Discover Tanelia hair: single-donor wigs, fine Swiss lace, raw bundles, extensions, and considered care prepared in Oslo.',
      canonical: `${origin}/products/${encodeURIComponent(slug)}`,
    });
  }
});

// SEO: server-rendered meta for journal articles
app.get('/journal/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const origin = process.env.SITE_URL || 'https://www.tanelia.shop';
  try {
    const { data, error } = await supabase
      .from('journal_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error || !data) {
      return serveSpa(res, {
        title: 'The Tanelia Journal | Hair Craft, Care & Sourcing',
        description: 'Read the Tanelia Journal for thoughtful guidance on hair craft, lace construction, sourcing, styling, and care.',
        canonical: `${origin}/journal/${encodeURIComponent(slug)}`,
      });
    }
    const title = data.seo_title || `${data.title} | Tanelia`;
    const description = data.seo_description || data.excerpt || 'A Tanelia Journal story on hair craft, care, and sourcing.';
    await serveSpa(res, {
      title,
      description,
      canonical: `${origin}/journal/${encodeURIComponent(data.slug)}`,
      image: data.cover_image_url || '/brand/tanelia-favicon.png',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        description: data.excerpt || description,
        image: data.cover_image_url || '/brand/tanelia-favicon.png',
        author: { '@type': 'Organization', name: data.author || 'Tanelia Editorial' },
        publisher: { '@type': 'Organization', name: 'Tanelia', url: origin },
        datePublished: data.published_at || undefined,
        mainEntityOfPage: `${origin}/journal/${encodeURIComponent(data.slug)}`,
      },
    });
  } catch (error: any) {
    return serveSpa(res, {
      title: 'The Tanelia Journal | Hair Craft, Care & Sourcing',
      description: 'Read the Tanelia Journal for thoughtful guidance on hair craft, lace construction, sourcing, styling, and care.',
      canonical: `${origin}/journal/${encodeURIComponent(slug)}`,
    });
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
