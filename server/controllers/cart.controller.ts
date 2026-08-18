// server/src/controllers/cart.controller.ts
import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

const getOrCreateCart = async (userId: string) => {
  // Look for existing active cart
  const { data: existing } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (existing) return existing;

  // Create new cart
  const { data, error } = await supabase
    .from('carts')
    .insert({ user_id: userId, status: 'active' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export class CartController {
  static async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const cart = await getOrCreateCart(userId);

      const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(id, name, slug, selling_price, is_preorder, product_images(image_url, sort_order)),
          product_variants(id, attributes, sku)
        `)
        .eq('cart_id', cart.id);

      if (error) throw error;

      res.json({ cart, items: items || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async addItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { productId, variantId, quantity } = req.body;

      // NEVER trust client-side price. Always recalculate from DB.
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, selling_price, status')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (product.status !== 'active') {
        return res.status(400).json({ error: 'Product is not available' });
      }

      let unitPrice = product.selling_price;

      // If variant has a price adjustment
      if (variantId) {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('price_adjustment, active')
          .eq('id', variantId)
          .single();

        if (!variant?.active) {
          return res.status(400).json({ error: 'Variant is not available' });
        }
        unitPrice += (variant.price_adjustment || 0);
      }

      const cart = await getOrCreateCart(userId);

      // Check if same item already in cart
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .eq('variant_id', variantId || null)
        .single();

      if (existing) {
        const { data } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();
        return res.json(data);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
          unit_price: unitPrice,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { itemId } = req.params;
      const { quantity } = req.body;

      // Ownership check — only update items in the user's own cart
      const { data: item } = await supabase
        .from('cart_items')
        .select('id, cart_id')
        .eq('id', itemId)
        .single();

      if (!item) return res.status(404).json({ error: 'Item not found' });

      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('id', item.cart_id)
        .eq('user_id', userId)
        .single();

      if (!cart) return res.status(404).json({ error: 'Item not found' });

      if (quantity <= 0) {
        const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
        if (error) throw error;
        return res.json({ message: 'Item removed' });
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async removeItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { itemId } = req.params;

      // Ownership check — only delete items in the user's own cart
      const { data: item } = await supabase
        .from('cart_items')
        .select('id, cart_id')
        .eq('id', itemId)
        .single();

      if (!item) return res.status(404).json({ error: 'Item not found' });

      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('id', item.cart_id)
        .eq('user_id', userId)
        .single();

      if (!cart) return res.status(404).json({ error: 'Item not found' });

      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
      res.json({ message: 'Item removed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async clearCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      }
      res.json({ message: 'Cart cleared' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
