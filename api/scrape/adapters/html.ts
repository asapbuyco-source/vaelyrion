import { load } from 'cheerio';
import { fetchWithRetry } from '../lib/http';
import { CURRENCY_TO_EUR, detectCategory, detectColors, detectDensities, detectHairOrigin, detectLaceTypes, detectLengths, detectTextures, isNoiseTitle, round2 } from '../lib/normalize';
import { ScrapedProduct, SourceConfig } from '../types';

interface Candidate { url: string; title: string; image: string | null }

const absoluteUrl = (base: string, href: string): string => {
  try { return new URL(href, base).href; } catch { return href; }
};

function extractJsonLd(html: string): any[] {
  const $ = load(html);
  const out: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text());
      out.push(parsed);
    } catch {
      // skip malformed JSON-LD
    }
  });
  return out;
}

async function collectCandidates(source: SourceConfig, pageUrl: string, maxPages: number): Promise<Candidate[]> {
  const seen = new Set<string>();
  const candidates: Candidate[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? pageUrl : `${pageUrl}${pageUrl.includes('?') ? '&' : '?'}page=${page}`;
    const { status, text } = await fetchWithRetry(url);
    if (status !== 200) break;

    const jsonLd = extractJsonLd(text);
    let found = 0;

    for (const node of jsonLd) {
      const list = node?.['@graph'] || node;
      const items = Array.isArray(list) ? list : [list];
      for (const item of items) {
        if (item?.itemListElement && Array.isArray(item.itemListElement)) {
          for (const el of item.itemListElement) {
            const productUrl = el?.item?.url || el?.url;
            if (productUrl && !seen.has(productUrl)) {
              seen.add(productUrl);
              candidates.push({ url: productUrl, title: el?.item?.name || '', image: null });
              found++;
            }
          }
        }
      }
    }

    if (found === 0) {
      const $ = load(text);
      $('a[href*="/products/"], a[href*="/product/"], a[href*="/products"], a[href*="/collections/"]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        const abs = absoluteUrl(source.baseUrl, href);
        const match = abs.match(/^https?:\/\/[^/]+\/(?:products?|product)\/([^?#]+)/i);
        if (!match || match[1].length < 3) return;
        const clean = `${new URL(abs).origin}/products/${match[1]}`;
        if (seen.has(clean)) return;
        seen.add(clean);
        const img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src') || null;
        const title = $(el).find('img').first().attr('alt') || $(el).text().replace(/\s+/g, ' ').trim().slice(0, 120);
        candidates.push({ url: clean, title, image: img ? absoluteUrl(source.baseUrl, img) : null });
        found++;
      });
    }

    if (found === 0) break;
  }

  return candidates;
}

interface JsonLdProduct {
  title: string;
  description: string;
  images: string[];
  priceRaw: number | null;
  currency: string;
}

function parseProductJsonLd(nodes: any[], fallback: { title: string; image: string | null }): JsonLdProduct | null {
  for (const node of nodes) {
    const list = node?.['@graph'] || node;
    const items = Array.isArray(list) ? list : [list];
    for (const item of items) {
      if (item?.['@type'] !== 'Product') continue;
      const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
      const price = parseFloat(offers?.price);
      const images = [item.image].flat().filter(Boolean) as string[];
      return {
        title: item.name || fallback.title,
        description: typeof item.description === 'string' ? item.description.slice(0, 4000) : '',
        images: images.length > 0 ? images : (fallback.image ? [fallback.image] : []),
        priceRaw: isNaN(price) ? null : price,
        currency: offers?.priceCurrency || 'USD',
      };
    }
  }
  return null;
}

export async function scrapeHtml(source: SourceConfig, maxProducts: number, maxPages: number): Promise<ScrapedProduct[]> {
  const out: ScrapedProduct[] = [];
  const collections = source.collectionPaths && source.collectionPaths.length > 0
    ? source.collectionPaths
    : [`${source.baseUrl}/collections/all`];

  for (const collection of collections) {
    const candidates = await collectCandidates(source, collection, maxPages);

    for (const cand of candidates) {
      if (out.length >= maxProducts) return out;

      try {
        const { status, text } = await fetchWithRetry(cand.url);
        if (status !== 200) continue;

        const jsonLd = extractJsonLd(text);
        const details = parseProductJsonLd(jsonLd, { title: cand.title, image: cand.image });
        if (!details?.title) continue;

        const extraPatterns = (source.excludeTitlePatterns || []).map(s => new RegExp(s, 'i'));
        if (isNoiseTitle(details.title, extraPatterns)) continue;

        const rate = CURRENCY_TO_EUR[details.currency] ?? 1;
        const priceEur = details.priceRaw != null ? round2(details.priceRaw * rate) : null;
        if (priceEur == null || priceEur <= 0) continue;

        const textBlob = [details.title, details.description || '', cand.title].join(' | ');

        out.push({
          sourceKey: source.key,
          externalId: new URL(cand.url).pathname.split('/').filter(Boolean).pop() || cand.url,
          url: cand.url,
          title: details.title,
          description: details.description || '',
          images: details.images || [],
          category: detectCategory(textBlob),
          priceEur,
          compareAtEur: null,
          originalCurrency: details.currency || source.currency,
          textures: detectTextures(textBlob),
          lengths: detectLengths(textBlob),
          densities: detectDensities(textBlob),
          laceTypes: detectLaceTypes(textBlob),
          colors: detectColors(textBlob),
          hairOrigin: detectHairOrigin(textBlob),
          isPreOrder: true,
          sku: null,
          variantCount: 1,
        });
      } catch (err: any) {
        // skip product, keep going
      }
    }
  }

  return out;
}
