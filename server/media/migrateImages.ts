// Product image migration utility.
//
// Copies hotlinked supplier images into Supabase Storage, optimising them to
// WebP in the process, then repoints product_images.image_url at the new URL.
// Dead source URLs (deleted by suppliers) are reported and, with --prune,
// removed from the catalog. A JSON report maps every change for rollback.
//
// Usage:
//   npm run media:migrate -- --dry-run            # validate, no writes
//   npm run media:migrate                          # migrate everything
//   npm run media:migrate -- --limit=20 --dry-run  # sample
//   npm run media:migrate -- --product=tanelia-renee-water-wave
//   npm run media:migrate -- --prune               # also delete dead rows
//   npm run media:migrate -- --deactivate-empty     # hide products with no images left
//
// Flags: --dry-run --limit=N --product=slug --prune --deactivate-empty --width=N --quality=N --concurrency=N
import 'dotenv/config';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase.js';

const BUCKET = 'product-images';
const STORAGE_MARKER = `/storage/v1/object/public/${BUCKET}/`;
const REPORT_DIR = path.join(process.cwd(), 'server', 'media', 'reports');

interface Options {
  dryRun: boolean;
  limit: number;
  productSlug: string | null;
  prune: boolean;
  deactivateEmpty: boolean;
  width: number;
  quality: number;
  concurrency: number;
}

const parseOptions = (): Options => {
  const args = process.argv.slice(2);
  const has = (flag: string) => args.includes(flag);
  const valueOf = (prefix: string): string | null => {
    const match = args.find((a) => a.startsWith(prefix));
    return match ? match.slice(prefix.length) : null;
  };
  return {
    dryRun: has('--dry-run'),
    prune: has('--prune'),
    deactivateEmpty: has('--deactivate-empty'),
    limit: Number(valueOf('--limit=') || 0) || Infinity,
    productSlug: valueOf('--product='),
    width: Number(valueOf('--width=') || 0) || 1200,
    quality: Number(valueOf('--quality=') || 0) || 82,
    concurrency: Number(valueOf('--concurrency=') || 0) || 4,
  };
};

const sha = (value: string): string => createHash('sha1').update(value).digest('hex').slice(0, 16);

const fetchWithTimeout = async (url: string, ms: number, init?: RequestInit): Promise<globalThis.Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: 'follow' });
  } finally {
    clearTimeout(timer);
  }
};

const loadSharp = async (): Promise<any | null> => {
  try {
    const mod: any = await import('sharp');
    return mod.default || mod;
  } catch {
    return null;
  }
};

interface ImageRow {
  id: string;
  product_id: string;
  image_url: string;
  products?: { slug?: string; name?: string } | null;
}

type Result =
  | { kind: 'migrated'; url: string; newUrl?: string; bytesIn: number; bytesOut: number; optimized: boolean }
  | { kind: 'dead'; url: string; status: number }
  | { kind: 'skipped'; url: string }
  | { kind: 'error'; url: string; message: string };

const fetchRows = async (productSlug: string | null, limit: number): Promise<ImageRow[]> => {
  const rows: ImageRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (rows.length < limit) {
    let query = supabase
      .from('product_images')
      .select('id, product_id, image_url, products!inner(slug, name)')
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1);

    if (productSlug) query = query.eq('products.slug', productSlug);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to load product_images: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const row of data as unknown as ImageRow[]) {
      rows.push(row);
      if (rows.length >= limit) break;
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
};

const ensureBucket = async (): Promise<void> => {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (data) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw new Error(`Unable to create storage bucket "${BUCKET}": ${error.message}`);
  console.log(`[media] Created public storage bucket "${BUCKET}".`);
};

const processRow = async (row: ImageRow, options: Options, sharp: any): Promise<Result> => {
  const sourceUrl = String(row.image_url || '').trim();

  if (!sourceUrl || sourceUrl.includes(STORAGE_MARKER)) {
    return { kind: 'skipped', url: sourceUrl };
  }

  // Dry runs only probe liveness — no downloads or writes.
  if (options.dryRun) {
    try {
      const probe = await fetchWithTimeout(sourceUrl, 20000, { method: 'HEAD' });
      if (!probe.ok) return { kind: 'dead', url: sourceUrl, status: probe.status };
      const length = Number(probe.headers.get('content-length') || 0);
      return { kind: 'migrated', url: sourceUrl, bytesIn: length, bytesOut: 0, optimized: false };
    } catch (error: any) {
      return { kind: 'error', url: sourceUrl, message: error?.message || 'probe failed' };
    }
  }

  let response: globalThis.Response;
  try {
    response = await fetchWithTimeout(sourceUrl, 25000);
  } catch (error: any) {
    return { kind: 'error', url: sourceUrl, message: error?.message || 'fetch failed' };
  }

  if (!response.ok) {
    return { kind: 'dead', url: sourceUrl, status: response.status };
  }

  const sourceBuffer = Buffer.from(await response.arrayBuffer());
  if (sourceBuffer.length < 512) {
    return { kind: 'dead', url: sourceUrl, status: response.status };
  }

  let outputBuffer = sourceBuffer;
  let contentType = response.headers.get('content-type')?.split(';')[0] || 'image/png';
  let extension = contentType.split('/')[1] || 'png';
  let optimized = false;

  const isHeic = /\.(heic|heif)(\?|$)/i.test(sourceUrl) || /heic|heif/i.test(contentType);
  if (sharp && !isHeic) {
    try {
      outputBuffer = await sharp(sourceBuffer, { failOn: 'none' })
        .rotate()
        .resize({ width: options.width, withoutEnlargement: true })
        .webp({ quality: options.quality, effort: 4 })
        .toBuffer();
      contentType = 'image/webp';
      extension = 'webp';
      optimized = true;
    } catch {
      // Keep the original bytes when the source cannot be decoded.
      outputBuffer = sourceBuffer;
    }
  }

  const slug = row.products?.slug || row.product_id;
  const storagePath = `products/${slug}/${sha(sourceUrl)}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, outputBuffer, { contentType, upsert: true, cacheControl: '31536000' });

  if (uploadError) {
    return { kind: 'error', url: sourceUrl, message: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const { error: updateError } = await supabase
    .from('product_images')
    .update({ image_url: publicUrlData.publicUrl })
    .eq('id', row.id);

  if (updateError) {
    return { kind: 'error', url: sourceUrl, message: updateError.message };
  }

  return {
    kind: 'migrated',
    url: sourceUrl,
    newUrl: publicUrlData.publicUrl,
    bytesIn: sourceBuffer.length,
    bytesOut: outputBuffer.length,
    optimized,
  };
};

const runPool = async <T>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<void>) => {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
};

interface ProductStat {
  slug: string;
  total: number;
  migrated: number;
  dead: number;
  skipped: number;
}

const main = async () => {
  const options = parseOptions();
  const sharp = await loadSharp();
  if (!sharp && !options.dryRun) {
    console.warn('[media] sharp is unavailable — originals will be uploaded without conversion.');
  }

  console.log(`[media] Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'} · width=${options.width} · quality=${options.quality} · concurrency=${options.concurrency}`);

  const rows = await fetchRows(options.productSlug, options.limit);
  console.log(`[media] ${rows.length} image rows to inspect.`);

  let migrated = 0;
  let dead = 0;
  let skipped = 0;
  let errors = 0;
  let bytesIn = 0;
  let bytesOut = 0;
  const deadIds: string[] = [];
  const report: Array<{ id: string; product: string | null; oldUrl: string; newUrl: string | null; status: string }> = [];
  const productStats = new Map<string, ProductStat>();

  if (!options.dryRun && rows.length > 0) await ensureBucket();

  await runPool(rows, options.concurrency, async (row, index) => {
    const slug = row.products?.slug || row.product_id;
    const stat = productStats.get(slug) || { slug, total: 0, migrated: 0, dead: 0, skipped: 0 };
    stat.total += 1;

    const result = await processRow(row, options, sharp);
    switch (result.kind) {
      case 'migrated':
        migrated++;
        stat.migrated += 1;
        bytesIn += result.bytesIn;
        bytesOut += result.bytesOut;
        if (!options.dryRun) {
          report.push({ id: row.id, product: row.products?.slug || null, oldUrl: result.url, newUrl: result.newUrl || null, status: 'migrated' });
        }
        break;
      case 'dead':
        dead++;
        stat.dead += 1;
        deadIds.push(row.id);
        if (!options.dryRun) {
          report.push({ id: row.id, product: row.products?.slug || null, oldUrl: result.url, newUrl: null, status: `dead:${result.status}` });
        }
        console.warn(`[media] DEAD ${result.status} ${result.url}`);
        break;
      case 'skipped':
        skipped++;
        stat.skipped += 1;
        break;
      case 'error':
        errors++;
        stat.dead += 0;
        if (!options.dryRun) {
          report.push({ id: row.id, product: row.products?.slug || null, oldUrl: result.url, newUrl: null, status: `error:${result.message}` });
        }
        console.warn(`[media] ERROR ${result.url} — ${result.message}`);
        break;
    }

    productStats.set(slug, stat);
    if ((index + 1) % 100 === 0) {
      console.log(`[media] ${index + 1}/${rows.length} processed… (migrated=${migrated} dead=${dead} errors=${errors})`);
    }
  });

  let prunedCount = 0;
  if (options.prune && deadIds.length > 0 && !options.dryRun) {
    // PostgREST rejects oversized `in` filters — delete in chunks.
    for (let i = 0; i < deadIds.length; i += 100) {
      const chunk = deadIds.slice(i, i + 100);
      const { error } = await supabase.from('product_images').delete().in('id', chunk);
      if (error) console.error(`[media] Failed to prune rows ${i}–${i + chunk.length - 1}: ${error.message}`);
      else prunedCount += chunk.length;
    }
    console.log(`[media] Pruned ${prunedCount}/${deadIds.length} dead image rows.`);
  }

  // Products with no usable image left are hidden from the storefront (and the
  // sitemap) until photography is replaced.
  const emptyProducts = [...productStats.values()].filter((p) => p.total > 0 && p.migrated + p.skipped === 0);
  if (options.deactivateEmpty && emptyProducts.length > 0 && !options.dryRun) {
    const slugs = emptyProducts.map((p) => p.slug);
    let deactivated = 0;
    for (let i = 0; i < slugs.length; i += 100) {
      const chunk = slugs.slice(i, i + 100);
      const { error } = await supabase.from('products').update({ status: 'inactive' }).in('slug', chunk);
      if (error) console.error(`[media] Failed to deactivate products ${i}–${i + chunk.length - 1}: ${error.message}`);
      else deactivated += chunk.length;
    }
    console.log(`[media] Deactivated ${deactivated}/${slugs.length} product(s) with no remaining images.`);
  }

  if (!options.dryRun && report.length > 0) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(REPORT_DIR, `migration-${stamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), options: { ...options, limit: options.limit === Infinity ? null : options.limit }, report }, null, 2));
    console.log(`[media] Rollback report written to ${reportPath}`);
  }

  const pct = (a: number, b: number) => (b > 0 ? ` (${Math.round((a / b) * 100)}%)` : '');
  console.log('\n[media] Summary');
  console.log(`  ${options.dryRun ? 'Alive sources' : 'Migrated'}: ${migrated}${pct(migrated, rows.length)}`);
  console.log(`  Dead sources:  ${dead}${pct(dead, rows.length)}${prunedCount > 0 ? ` (${prunedCount} pruned)` : ''}`);
  console.log(`  Already local: ${skipped}`);
  console.log(`  Errors:        ${errors}`);
  if (bytesIn > 0) {
    console.log(`  Source bytes: ${(bytesIn / 1024 / 1024).toFixed(1)} MB`);
    if (!options.dryRun) console.log(`  WebP bytes:   ${(bytesOut / 1024 / 1024).toFixed(1)} MB`);
  }

  const allDead = [...productStats.values()].filter((p) => p.total > 1 && p.dead === p.total);
  if (allDead.length > 0) {
    console.log(`\n[media] ${allDead.length} product(s) have EVERY image dead — replace or remove these products:`);
    for (const p of allDead.slice(0, 30)) {
      console.log(`  - ${p.slug} (${p.total} images)`);
    }
    if (allDead.length > 30) console.log(`  … and ${allDead.length - 30} more`);
  }
};

main().catch((error) => {
  console.error('[media] Fatal:', error?.message || error);
  process.exit(1);
});
