import { supabase } from '../../config/supabase';
import { ScrapedProduct, SourceConfig } from '../types';

export interface SupplierRow {
  id: string;
  name: string;
}

export async function getOrCreateSupplier(source: SourceConfig): Promise<SupplierRow> {
  const { data: existing } = await supabase
    .from('suppliers')
    .select('id, name')
    .eq('name', source.name)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      name: source.name,
      platform: source.type === 'shopify' ? 'shopify' : 'web',
      supplier_url: source.baseUrl,
      status: 'active',
      notes: `Auto-discovered via catalog scraper (${source.key})`,
    })
    .select('id, name')
    .single();

  if (error) throw new Error(`Failed to create supplier ${source.name}: ${error.message}`);
  return data;
}

export async function upsertListing(supplierId: string, product: ScrapedProduct): Promise<void> {
  const { data: existing } = await supabase
    .from('scraped_listings')
    .select('id')
    .eq('supplier_id', supplierId)
    .eq('external_id', product.externalId)
    .single();

  const payload = {
    supplier_id: supplierId,
    external_id: product.externalId,
    url: product.url,
    title: product.title,
    description: product.description,
    images: product.images,
    attributes: {
      category: product.category,
      textures: product.textures,
      lengths: product.lengths,
      densities: product.densities,
      laceTypes: product.laceTypes,
      colors: product.colors,
      hairOrigin: product.hairOrigin,
      isPreOrder: product.isPreOrder,
      sku: product.sku,
      variantCount: product.variantCount,
    },
    price_eur: product.priceEur,
    compare_at_eur: product.compareAtEur,
    original_currency: product.originalCurrency,
    category: product.category,
    is_preorder: product.isPreOrder,
  };

  if (existing) {
    const { error } = await supabase
      .from('scraped_listings')
      .update(payload)
      .eq('id', existing.id);
    if (error) throw new Error(`Update listing failed: ${error.message}`);
  } else {
    const { error } = await supabase
      .from('scraped_listings')
      .insert(payload);
    if (error) throw new Error(`Insert listing failed: ${error.message}`);
  }
}

export async function countListings(supplierId: string): Promise<number> {
  const { count, error } = await supabase
    .from('scraped_listings')
    .select('id', { count: 'exact', head: true })
    .eq('supplier_id', supplierId);
  if (error) return 0;
  return count || 0;
}
