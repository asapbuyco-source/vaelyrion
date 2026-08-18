import { supabase } from '../config/supabase';
import { round2, slugify } from './lib/normalize';
import { ScrapeCategory } from './types';
import { SOURCES } from './sources';

const CATEGORIES: Array<{ name: string; slug: ScrapeCategory }> = [
  { name: 'Wigs', slug: 'wigs' },
  { name: 'Bundles', slug: 'bundles' },
  { name: 'Closures', slug: 'closures' },
  { name: 'Frontals', slug: 'frontals' },
  { name: 'Extensions', slug: 'extensions' },
  { name: 'Accessories', slug: 'accessories' },
];

function parseArgs(argv: string[]) {
  const opts: Record<string, string | string[] | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    const key = eq >= 0 ? a.slice(2, eq) : a.slice(2);
    const value = eq >= 0 ? a.slice(eq + 1) : null;
    if (value !== null) { opts[key] = value; continue; }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      if (opts[key]) opts[key] = [...(opts[key] as string[]), next];
      else opts[key] = [next];
      i++;
    } else opts[key] = true;
  }
  return opts;
}

const listOpt = (opts: Record<string, any>, key: string): string[] => {
  const v = opts[key];
  if (!v) return [];
  return (Array.isArray(v) ? v : [String(v)]).flatMap(s => String(s).split(',').map(x => x.trim()).filter(Boolean));
};

const numOpt = (opts: Record<string, any>, key: string, fallback: number): number => {
  const v = parseFloat(String(opts[key] ?? fallback));
  return isNaN(v) ? fallback : v;
};

async function ensureCategories(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const c of CATEGORIES) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ name: c.name, slug: c.slug, active: true, sort_order: 0 }, { onConflict: 'slug' })
      .select('id, slug')
      .single();
    if (error) throw new Error(`Category upsert failed (${c.slug}): ${error.message}`);
    map.set(c.slug, data.id);
  }
  return map;
}

async function promoteListing(listing: any, supplier: { id: string; name: string }, categoryIds: Map<string, string>, markup: number) {
  const attrs = listing.attributes || {};
  const category: ScrapeCategory = CATEGORIES.some(c => c.slug === attrs.category) ? attrs.category : 'wigs';
  const supplierCost = listing.price_eur;
  const sellingPrice = round2(supplierCost * markup);
  const compareAt = listing.compare_at_eur ? round2(listing.compare_at_eur * markup) : null;
  const slug = `${slugify(listing.title)}-${slugify(supplier.name)}`.slice(0, 240);
  const sku = `SCR-${slugify(supplier.name)}-${String(listing.external_id).slice(-40)}`.slice(0, 100);

  const { data: product, error } = await supabase
    .from('products')
    .upsert({
      name: listing.title,
      slug,
      description: listing.description || '',
      category_id: categoryIds.get(category),
      supplier_id: supplier.id,
      supplier_cost: supplierCost,
      selling_price: sellingPrice,
      compare_at_price: compareAt,
      currency: 'EUR',
      status: 'active',
      fulfillment_type: listing.is_preorder ? 'preorder' : 'in_stock',
      is_preorder: !!listing.is_preorder,
      estimated_min_days: listing.is_preorder ? 10 : 3,
      estimated_max_days: listing.is_preorder ? 18 : 6,
      sku,
      hair_origin: attrs.hairOrigin || '100% Raw Virgin Human Hair',
      details: [],
      care_instructions: [],
    }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (error) throw new Error(`Product upsert failed: ${error.message}`);
  const productId = product.id;

  await supabase.from('product_variants').delete().eq('product_id', productId);
  await supabase.from('product_variants').insert({
    product_id: productId,
    name: 'Default',
    sku: `SKU-${slug}`.slice(0, 100),
    price_adjustment: 0,
    stock_quantity: 100,
    attributes: {
      textures: attrs.textures || ['Body Wave'],
      lengths: attrs.lengths || ['20 inch'],
      densities: attrs.densities || ['180%'],
      laceTypes: attrs.laceTypes || ['13x4 HD Swiss Lace'],
      colors: attrs.colors || ['Natural Black (#1B)'],
    },
  });

  await supabase.from('product_images').delete().eq('product_id', productId);
  const images = (listing.images || []).slice(0, 8);
  if (images.length > 0) {
    await supabase.from('product_images').insert(
      images.map((url: string, idx: number) => ({ product_id: productId, image_url: url, sort_order: idx }))
    );
  }

  await supabase
    .from('scraped_listings')
    .update({ product_id: productId })
    .eq('id', listing.id);

  const { data: sp } = await supabase
    .from('supplier_products')
    .select('id')
    .eq('supplier_id', supplier.id)
    .eq('product_id', productId)
    .single();

  if (sp) {
    await supabase
      .from('supplier_products')
      .update({ supplier_product_url: listing.url, supplier_cost: supplierCost, active: true })
      .eq('id', sp.id);
  } else {
    await supabase.from('supplier_products').insert({
      supplier_id: supplier.id,
      product_id: productId,
      supplier_product_url: listing.url,
      supplier_sku: attrs.sku || null,
      supplier_cost: supplierCost,
      processing_days: listing.is_preorder ? 7 : 2,
      active: true,
    });
  }

  return { productId, slug, sellingPrice, title: listing.title };
}

async function preflight() {
  const { error } = await supabase.from('scraped_listings').select('id').limit(1);
  if (error?.code === 'PGRST205') {
    console.error('Table "scraped_listings" is missing. Apply the migration first:');
    console.error('  Supabase Dashboard -> SQL Editor -> paste contents of supabase/migrations/00002_scraped_listings.sql -> Run');
    process.exit(1);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const markup = numOpt(opts, 'markup', 2.5);
  const limit = Math.floor(numOpt(opts, 'limit', 25));
  const siteFilter = listOpt(opts, 'site');
  const dryRun = !!opts['dry-run'];
  const includePromoted = !!opts['all'];

  console.log(`Promote listings -> catalog (markup ${markup}x, limit ${limit}${siteFilter.length ? `, sites: ${siteFilter.join(',')}` : ''}${dryRun ? ', DRY RUN' : ''})`);

  if (!dryRun) await preflight();

  const categoryIds = await ensureCategories();

  let query = supabase
    .from('scraped_listings')
    .select('*, suppliers(id, name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!includePromoted) query = query.is('product_id', null);
  if (siteFilter.length > 0) {
    const names = SOURCES.filter(s => siteFilter.includes(s.key)).map(s => s.name);
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('id, name')
      .in('name', names);
    const supplierIds = (suppliers || []).map(s => s.id);
    if (supplierIds.length === 0) {
      console.log('No suppliers matched the site filter.');
      return;
    }
    query = query.in('supplier_id', supplierIds);
  }

  const { data: listings, error } = await query;
  if (error) throw new Error(`Listing query failed: ${error.message}`);
  if (!listings || listings.length === 0) {
    console.log('No listings to promote. Run the scraper first: npm run scrape');
    return;
  }

  let promoted = 0;
  for (const listing of listings) {
    const supplier = listing.suppliers;
    if (!supplier) continue;
    if (dryRun) {
      console.log(`  [dry] ${listing.title.slice(0, 60)} | cost €${listing.price_eur} -> retail €${round2(listing.price_eur * markup)}`);
      promoted++;
      continue;
    }
    try {
      const res = await promoteListing(listing, supplier, categoryIds, markup);
      console.log(`  [✓] ${res.title.slice(0, 60)} | €${res.sellingPrice} (${res.slug})`);
      promoted++;
    } catch (err: any) {
      console.log(`  [x] ${listing.title.slice(0, 60)}: ${err.message}`);
    }
  }

  console.log(`\nPromoted ${promoted}/${listings.length} listings.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
