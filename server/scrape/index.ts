import { scrapeShopify } from './adapters/shopify';
import { scrapeHtml } from './adapters/html';
import { checkRobots, isDisallowed } from './lib/http';
import { getOrCreateSupplier, upsertListing } from './lib/db';
import { selectSources } from './sources';
import { ScrapedProduct, ScrapeResult, SourceConfig } from './types';
import { supabase } from '../config/supabase';

function parseArgs(argv: string[]) {
  const opts: Record<string, string | string[] | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    const key = eq >= 0 ? a.slice(2, eq) : a.slice(2);
    const value = eq >= 0 ? a.slice(eq + 1) : null;

    if (value !== null) {
      opts[key] = value;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      if (opts[key]) {
        opts[key] = [...(opts[key] as string[]), next];
      } else {
        opts[key] = [next];
      }
      i++;
    } else {
      opts[key] = true;
    }
  }
  return opts;
}

const intOpt = (opts: Record<string, any>, key: string, fallback: number): number => {
  const v = parseInt(String(opts[key] ?? fallback));
  return isNaN(v) ? fallback : v;
};

const listOpt = (opts: Record<string, any>, key: string): string[] => {
  const v = opts[key];
  if (!v) return [];
  return (Array.isArray(v) ? v : [String(v)]).flatMap(s => String(s).split(',').map(x => x.trim()).filter(Boolean));
};

async function runSource(source: SourceConfig, maxProducts: number, maxPages: number, dryRun: boolean): Promise<ScrapeResult> {
  const errors: string[] = [];
  let products: ScrapedProduct[] = [];

  console.log(`\n=== ${source.name} (${source.baseUrl}) ===`);

  const origin = new URL(source.baseUrl).origin;
  await checkRobots(origin);
  const probe = new URL(source.type === 'shopify' ? '/products.json?limit=1' : '/collections', source.baseUrl).pathname;
  if (isDisallowed(probe)) {
    console.log(`  [!] robots.txt disallows ${probe} — skipping ${source.key}`);
    return { source, products: [], errors: [`robots.txt disallows ${probe}`] };
  }

  try {
    products = source.type === 'shopify'
      ? await scrapeShopify(source, maxProducts, maxPages)
      : await scrapeHtml(source, maxProducts, maxPages);
  } catch (err: any) {
    errors.push(err.message);
    console.log(`  [x] Scrape failed: ${err.message}`);
    return { source, products: [], errors };
  }

  console.log(`  [✓] Found ${products.length} products`);

  if (dryRun) {
    for (const p of products.slice(0, 5)) {
      console.log(`    - ${p.title.slice(0, 70)} | €${p.priceEur} | ${p.category} | ${p.textures.join('/')}`);
    }
    return { source, products, errors };
  }

  const supplier = await getOrCreateSupplier(source);
  let written = 0;
  for (const p of products) {
    try {
      await upsertListing(supplier.id, p);
      written++;
    } catch (err: any) {
      errors.push(`${p.title.slice(0, 50)}: ${err.message}`);
      if (errors.length > 10) break;
    }
  }
  console.log(`  [✓] Stored ${written} listings in scraped_listings (supplier: ${supplier.name})`);

  return { source, products, errors };
}

async function preflight(dryRun: boolean) {
  if (dryRun) return;
  const { error } = await supabase.from('scraped_listings').select('id').limit(1);
  if (error?.code === 'PGRST205') {
    console.error('Table "scraped_listings" is missing. Apply the migration first:');
    console.error('  Supabase Dashboard -> SQL Editor -> paste contents of supabase/migrations/00002_scraped_listings.sql -> Run');
    process.exit(1);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);

  const siteFilter = listOpt(opts, 'site');
  const maxProducts = intOpt(opts, 'limit', 500);
  const maxPages = intOpt(opts, 'pages', 3);
  const dryRun = !!opts['dry-run'];

  const sources = selectSources(siteFilter);
  if (sources.length === 0) {
    console.log('No matching sources. Known keys: luvmehair, curlyme, truegloryhair, hairvivi, mayvenn, unice, beautyforever');
    return;
  }

  console.log(`Tanelia catalog scraper — ${sources.length} source(s), limit=${maxProducts}/site, pages=${maxPages}${dryRun ? ', DRY RUN (no DB writes)' : ''}`);

  await preflight(dryRun);

  for (const source of sources) {
    const result = await runSource(source, maxProducts, maxPages, dryRun);
    if (result.errors.length > 0) {
      console.log(`  Errors (${result.errors.length}):`);
      for (const e of result.errors.slice(0, 10)) console.log(`    - ${e}`);
    }
  }

  console.log('\nDone. Next step: npm run promote -- --markup 2.5');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
