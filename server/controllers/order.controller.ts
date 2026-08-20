// server/src/controllers/order.controller.ts
import { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class OrderController {
  static async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*, products(name, product_images(image_url, sort_order))),
          shipments(*),
          tracking_events(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getOrderById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      const { id } = req.params;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*, products(name, product_images(image_url, sort_order))),
          shipments(*),
          tracking_events(* order by event_time asc)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Order not found' });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
