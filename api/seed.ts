import { supabase } from './config/supabase';
import { MOCK_PRODUCTS } from '../src/data/mockData';

const seedData = async () => {
  console.log('Starting full product seed...');

  try {
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: sups } = await supabase.from('suppliers').select('*');

    for (const p of MOCK_PRODUCTS) {
      // Find category and supplier
      const catId = cats?.find(c => c.slug === p.category)?.id;
      // using first supplier if matching fails for now
      const supId = sups?.find(s => s.id === p.supplierId)?.id || sups?.[0]?.id;
      
      const { data: insertedProduct, error } = await supabase.from('products').upsert({
        name: p.title,
        slug: p.slug,
        description: p.description,
        category_id: catId,
        supplier_id: supId,
        supplier_cost: p.supplierCost,
        selling_price: p.price,
        compare_at_price: p.originalPrice,
        currency: 'EUR',
        status: 'active',
        is_preorder: p.isPreOrder,
        hair_origin: p.hairOrigin,
        details: p.details,
        care_instructions: p.careInstructions,
        estimated_min_days: 10,
        estimated_max_days: 18,
      }, { onConflict: 'slug' }).select().single();

      if (error) {
        console.error(`Error seeding product ${p.slug}:`, error.message);
        continue;
      }

      if (insertedProduct) {
        // Seed images
        if (p.images && p.images.length > 0) {
          // Clear existing images first
          await supabase.from('product_images').delete().eq('product_id', insertedProduct.id);
          
          const imagesToInsert = p.images.map((url, idx) => ({
            product_id: insertedProduct.id,
            image_url: url,
            sort_order: idx
          }));
          await supabase.from('product_images').insert(imagesToInsert);
        }

        // Seed variants
        // To simplify, we will store the arrays in a single variant as attributes for now, 
        // since the frontend expects them as arrays on the product object.
        await supabase.from('product_variants').delete().eq('product_id', insertedProduct.id);
        
        await supabase.from('product_variants').insert({
          product_id: insertedProduct.id,
          name: 'Default',
          sku: `SKU-${p.id}`,
          price_adjustment: 0,
          stock_quantity: p.stockCount || 100,
          attributes: {
            textures: p.textures,
            lengths: p.lengths,
            densities: p.densities,
            laceTypes: p.laceTypes,
            colors: p.colors
          }
        });
      }
    }
    
    console.log('Full products seeded.');

  } catch (error) {
    console.error('Seed error:', error);
  }
};

seedData();
