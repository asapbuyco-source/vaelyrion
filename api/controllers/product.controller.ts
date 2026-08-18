import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const formatProduct = (p: any) => {
  const defaultVariant = p.product_variants?.[0] || {};
  const attrs = defaultVariant.attributes || {};

  return {
    id: p.id,
    title: p.name,
    slug: p.slug,
    subtitle: p.description?.substring(0, 50) + '...',
    category: p.categories?.slug || 'wigs',
    price: p.selling_price,
    originalPrice: p.compare_at_price,
    supplierCost: 0,
    rating: 5.0, // Mock rating
    reviewCount: 10,
    images: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
    isPreOrder: p.is_preorder,
    estimatedDelivery: '10–18 business days',
    stockCount: defaultVariant.stock_quantity || 0,
    textures: attrs.textures || [],
    lengths: attrs.lengths || [],
    densities: attrs.densities || [],
    laceTypes: attrs.laceTypes || [],
    colors: attrs.colors || [],
    description: p.description,
    hairOrigin: p.hair_origin || '',
    details: p.details || [],
    careInstructions: p.care_instructions || [],
    isNew: false,
    isBestSeller: false,
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
          categories(name, slug),
          product_variants(*),
          product_images(*)
        `);

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
      const formattedProducts = data.map((p: any) => formatProduct(p));

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
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Product not found' });

      res.json(formatProduct(data));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async seedProducts(req: Request, res: Response) {
    // This will be called once to populate the DB with mock data
    try {
      // For now, return success
      res.json({ message: 'Seed functionality to be implemented' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
