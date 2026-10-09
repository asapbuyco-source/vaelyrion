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

const SITE_ORIGIN = (process.env.SITE_URL || 'https://www.tanelia.shop').replace(/\/+$/, '');

app.disable('x-powered-by');

// CORS
const allowedOrigins = Array.from(new Set([
  process.env.FRONTEND_URL,
  process.env.SITE_URL,
  'https://www.tanelia.shop',
  'https://tanelia.shop',
  'http://localhost:3000',
].filter(Boolean))) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Same-origin/server-to-server requests have no Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
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
    const [products, articles, productImages] = await Promise.all([
      supabase.from('products').select('id, slug, updated_at, name').eq('status', 'active'),
      supabase.from('journal_articles').select('slug, published_at, title, cover_image_url, excerpt').eq('status', 'published'),
      supabase.from('product_images').select('product_id, image_url, sort_order').order('sort_order', { ascending: true })
    ]);
    if (products.error) throw products.error;
    if (articles.error) throw articles.error;
    if (productImages.error) throw productImages.error;

    const firstImageByProduct = new Map<string, string>();
    for (const img of (productImages.data || []) as any[]) {
      if (img.image_url && !firstImageByProduct.has(img.product_id)) {
        firstImageByProduct.set(img.product_id, img.image_url);
      }
    }

    const staticPages: Array<{ loc: string; priority: string; freq: string; lastmod?: string; image?: string; imageTitle?: string; imageCaption?: string }> = [
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
      lastmod: p.updated_at || undefined,
      image: firstImageByProduct.get(p.id),
      imageTitle: p.name,
      imageCaption: p.name ? `${p.name} — a Tanelia creation in single-donor hair.` : undefined
    }));
    const EDITORIAL_FALLBACK_IMAGE = 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320187267063808XAthZtraG4AWmex5_59fc5448-331b-4270-8cd2-8dfbc8c32be3.png?width=1200';

    const articleUrls = (articles.data || []).map((a: any) => ({
      loc: `${origin}/journal/${encodeURIComponent(a.slug)}`,
      priority: '0.6',
      freq: 'monthly',
      lastmod: a.published_at || undefined,
      image: a.cover_image_url
        ? (/^https?:\/\//i.test(a.cover_image_url) ? a.cover_image_url : `${origin}${a.cover_image_url}`)
        : EDITORIAL_FALLBACK_IMAGE,
      imageTitle: a.title,
      imageCaption: a.excerpt || undefined
    }));

    const urls = [...staticPages, ...productUrls, ...articleUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `\n    <image:image>
      <image:loc>${escapeHtml(u.image)}</image:loc>${u.imageTitle ? `\n      <image:title>${escapeHtml(u.imageTitle)}</image:title>` : ''}${u.imageCaption ? `\n      <image:caption>${escapeHtml(u.imageCaption)}</image:caption>` : ''}
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    res.send(xml);
  } catch (error: any) {
    console.error('Sitemap generation failed:', error?.message || error);
    res.status(500).json({ error: 'Unable to generate sitemap' });
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

// Journal locales are encoded in the slug suffix by the editorial generator
// (see server/lib/locale.ts). Used for <html lang> and hreflang.
import { languageFromSlug } from '../server/lib/locale.js';

const OG_LOCALE_BY_LANG: Record<string, string> = {
  en: 'en_US',
  no: 'nb_NO',
  it: 'it_IT',
  es: 'es_ES',
  de: 'de_DE',
  fr: 'fr_FR',
};

interface MetaInput {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  jsonLd?: object;
  lang?: string;
  alternates?: Array<{ hreflang: string; href: string }>;
}

const injectMeta = (html: string, meta: MetaInput) => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image || '/brand/tanelia-favicon.png');
  const canonical = escapeHtml(meta.canonical);
  const lang = meta.lang || 'en';
  const locale = OG_LOCALE_BY_LANG[lang] || 'en_US';
  const hreflang = (meta.alternates || [{ hreflang: lang, href: meta.canonical }])
    .map((alt) => `<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`)
    .join('\n');

  let output = html
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);

  // Replace the shell's Organization JSON-LD in place so the client (which looks
  // up #tanelia-structured-data) never ends up with two blocks.
  if (meta.jsonLd) {
    const jsonLd = `<script type="application/ld+json" id="tanelia-structured-data">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`;
    output = output.replace(
      /<script type="application\/ld\+json" id="tanelia-structured-data">[\s\S]*?<\/script>/,
      jsonLd,
    );
  }

  return output.replace(
    '</head>',
    `<link rel="canonical" href="${canonical}" />\n<meta property="og:url" content="${canonical}" />\n<meta property="og:locale" content="${locale}" />\n<link rel="alternate" hreflang="x-default" href="${canonical}" />\n${hreflang}\n</head>`,
  );
};

const serveSpa = async (res: Response, meta: MetaInput) => {
  const shell = getSpaShell();
  // If the built shell is unavailable in the function bundle, fall back to the
  // deployed SPA root rather than serving a script-less blank page.
  if (!shell) return res.redirect(302, '/');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.send(injectMeta(shell, meta));
};

// SEO: server-rendered meta for product pages
app.get('/products/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const origin = process.env.SITE_URL || 'https://www.tanelia.shop';
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(image_url, sort_order)')
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
        image: images.length > 0 ? images : image,
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
    const lang = data.language || languageFromSlug(data.slug);
    const canonical = `${origin}/journal/${encodeURIComponent(data.slug)}`;
    await serveSpa(res, {
      title,
      description,
      canonical,
      image: data.cover_image_url || '/brand/tanelia-favicon.png',
      lang,
      alternates: [
        { hreflang: lang, href: canonical },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        description: data.excerpt || description,
        image: data.cover_image_url || '/brand/tanelia-favicon.png',
        author: { '@type': 'Organization', name: data.author || 'Tanelia Editorial' },
        publisher: { '@type': 'Organization', name: 'Tanelia', url: origin },
        datePublished: data.published_at || undefined,
        inLanguage: lang,
        mainEntityOfPage: canonical,
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

// Bare catalog path — consolidate onto the canonical /shop URL.
app.get('/products', (_req: Request, res: Response) => {
  res.redirect(301, '/shop');
});

// Static SPA pages that deserve server-rendered meta. Without these, a direct
// request to /shop, /about, /faq, /contact or /journal would fall through to the
// JSON 404 (the /:path* rewrites route bare paths into this function).
const STATIC_PAGE_META: Record<string, { title: string; description: string }> = {
  '/shop': {
    title: 'Shop the Tanelia Collection | Wigs, Bundles & Fine Lace',
    description: 'Explore Tanelia single-donor wigs, raw bundles, fine Swiss lace frontals, closures, extensions, and silk care pieces.',
  },
  '/journal': {
    title: 'The Tanelia Journal | Hair Craft, Care & Sourcing',
    description: 'Read the Tanelia Journal for thoughtful guidance on hair craft, lace construction, sourcing, styling, and care.',
  },
  '/about': {
    title: 'About Tanelia | Hair, Considered',
    description: 'Learn how Tanelia selects single-donor hair, constructs fine Swiss lace, and prepares each piece in Oslo.',
  },
  '/faq': {
    title: 'Tanelia FAQ | Hair, Lace, Care & Delivery',
    description: 'Find answers about Tanelia hair origins, Swiss lace, care, release timing, delivery, and returns.',
  },
  '/contact': {
    title: 'Contact Tanelia | Client Services in Oslo',
    description: 'Contact Tanelia Client Services for help with textures, lace, sizing, delivery, and your order.',
  },
};

for (const [route, meta] of Object.entries(STATIC_PAGE_META)) {
  app.get(route, (_req: Request, res: Response) => {
    serveSpa(res, {
      ...meta,
      canonical: `${SITE_ORIGIN}${route}`,
      lang: 'en',
      alternates: [{ hreflang: 'en', href: `${SITE_ORIGIN}${route}` }],
    });
  });
}

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
