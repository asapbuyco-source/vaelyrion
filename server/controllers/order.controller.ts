// server/src/controllers/order.controller.ts
import { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const ORDER_SELECT = `
  *,
  order_items(*, products(name, product_images(image_url, sort_order))),
  shipments(*),
  tracking_events(*)
`;

const sortTrackingEvents = (order: any) => {
  if (order?.tracking_events && Array.isArray(order.tracking_events)) {
    order.tracking_events.sort((a: any, b: any) =>
      new Date(a.event_time || 0).getTime() - new Date(b.event_time || 0).getTime());
  }
  return order;
};

export class OrderController {
  static async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json((data || []).map(sortTrackingEvents));
    } catch (err: any) {
      console.error('getMyOrders failed:', err.message);
      res.status(500).json({ error: 'Unable to load orders' });
    }
  }

  static async getOrderById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      const { id } = req.params;

      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Order not found' });
      res.json(sortTrackingEvents(data));
    } catch (err: any) {
      console.error('getOrderById failed:', err.message);
      res.status(500).json({ error: 'Unable to load order' });
    }
  }
}
