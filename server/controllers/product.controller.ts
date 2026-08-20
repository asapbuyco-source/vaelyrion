import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const DEFAULT_PRODUCT_IMAGES = {
  wigs: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065153v1aY413AR8x3UMJ1_9579f0ac-9a49-4d31-a5d7-1c0927f72b21.png?width=1200',
  bundles: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=82',
  accessories: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2x_1_55d74548-0357-4f47-8390-65501ff65e04.png?width=1200'
};

const formatProduct = (p: any) => {
  const variants = Array.isArray(p.product_variants) ? p.product_variants : [];
  const images = Array.isArray(p.product_images) ? [...p.product_images] : [];
  const defaultVariant = variants[0] || {};
  const attrs = defaultVariant.attributes || {};
  const createdMs = p.created_at ? new Date(p.created_at).getTime() : 0;
  const isRecent = createdMs > Date.now() - 21 * 24 * 60 * 60 * 1000;
  const description = p.description || '';
  const category = p.categories?.slug || 'wigs';
  const productImages = images.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)).map((img: any) => img.image_url).filter(Boolean);

  return {
    id: p.id,
    title: p.name,
    slug: p.slug,
    subtitle: description ? `${description.substring(0, 80)}${description.length > 80 ? '…' : ''}` : 'A considered Tanelia creation.',
    category,
    price: p.selling_price,
    originalPrice: p.compare_at_price,
    supplierCost: 0,
    rating: 5.0, // Mock rating
    reviewCount: 10,
    images: productImages.length > 0 ? productImages : [DEFAULT_PRODUCT_IMAGES[category as keyof typeof DEFAULT_PRODUCT_IMAGES] || DEFAULT_PRODUCT_IMAGES.wigs],
    isPreOrder: p.is_preorder,
    estimatedDelivery: '10–18 business days',
    stockCount: defaultVariant.stock_quantity || 0,
    textures: attrs.textures || [],
    lengths: attrs.lengths || [],
    densities: attrs.densities || [],
    laceTypes: attrs.laceTypes || [],
    colors: attrs.colors || [],
    description,
    hairOrigin: p.hair_origin || '',
    details: p.details || [],
    careInstructions: p.care_instructions || [],
    isNew: isRecent,
    isBestSeller: p.selling_price >= 200,
    supplierId: p.supplier_id
  };
};

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const { category, search } = req.query;
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories!inner(name, slug),
          product_variants(*),
          product_images(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        // filter by category slug
        query = query.eq('categories.slug', category);
      }
      
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match the frontend Product interface
      const formattedProducts = (data || []).map((p: any) => formatProduct(p));

      res.json(formattedProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          product_variants(*),
          product_images(*)
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Product not found' });

      res.json(formatProduct(data));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async seedProducts(req: Request, res: Response) {
    res.status(501).json({
      error: 'Catalog seeding is an operator task. Run `npm run seed` from the server environment.'
    });
  }
}
