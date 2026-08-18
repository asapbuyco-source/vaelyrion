import { fetchJson } from '../lib/http';
import { CURRENCY_TO_EUR, detectCategory, detectColors, detectDensities, detectHairOrigin, detectLaceTypes, detectLengths, detectTextures, htmlToText, isNoiseTitle, round2 } from '../lib/normalize';
import { ScrapedProduct, SourceConfig } from '../types';

interface ShopifyImage { src: string }
interface ShopifyOption { name: string; values: string[] }
interface ShopifyVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  price: string;
  compare_at_price: string | null;
  available: boolean;
  sku: string;
}
interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  images: ShopifyImage[];
  options: ShopifyOption[];
  variants: ShopifyVariant[];
  tags: string;
}

const PAGE_SIZE = 250;

export async function scrapeShopify(source: SourceConfig, maxProducts: number, maxPages: number): Promise<ScrapedProduct[]> {
  const out: ScrapedProduct[] = [];
  const rate = CURRENCY_TO_EUR[source.currency] ?? 1;

  for (let page = 1; page <= maxPages; page++) {
    const url = `${source.baseUrl}/products.json?limit=${PAGE_SIZE}&page=${page}`;
    const data = await fetchJson<{ products: ShopifyProduct[] }>(url);
    const batch = data.products || [];
    if (batch.length === 0) break;

    for (const p of batch) {
      if (out.length >= maxProducts) return out;

      const extraPatterns = (source.excludeTitlePatterns || []).map(s => new RegExp(s, 'i'));
      if (isNoiseTitle(p.title, extraPatterns)) continue;

      const textBlob = [p.title, p.tags, p.body_html || '', ...(p.options || []).flatMap(o => o.values || [])].join(' | ');

      const prices = (p.variants || []).map(v => parseFloat(v.price)).filter(n => !isNaN(n) && n > 0);
      const compareAt = (p.variants || []).map(v => v.compare_at_price ? parseFloat(v.compare_at_price) : NaN).filter(n => !isNaN(n) && n > 0);

      if (prices.length === 0) continue;

      const priceEur = round2(Math.min(...prices) * rate);
      const compareAtEur = compareAt.length > 0 ? round2(Math.min(...compareAt) * rate) : null;

      const images = (p.images || []).map(i => i.src).filter(Boolean);

      const firstVariant = p.variants?.[0];

      out.push({
        sourceKey: source.key,
        externalId: String(p.id),
        url: `${source.baseUrl}/products/${p.handle}`,
        title: p.title,
        description: p.body_html ? htmlToText(p.body_html).slice(0, 4000) : '',
        images,
        category: detectCategory(textBlob),
        priceEur,
        compareAtEur: compareAtEur && compareAtEur > priceEur ? compareAtEur : null,
        originalCurrency: source.currency,
        textures: detectTextures(textBlob),
        lengths: detectLengths(textBlob),
        densities: detectDensities(textBlob),
        laceTypes: detectLaceTypes(textBlob),
        colors: detectColors(textBlob),
        hairOrigin: detectHairOrigin(textBlob),
        isPreOrder: true,
        sku: firstVariant?.sku || null,
        variantCount: (p.variants || []).length,
      });
    }

    if (batch.length < PAGE_SIZE) break;
  }

  return out;
}
