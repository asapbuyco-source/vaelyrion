import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const ALLOWED_EVENTS = new Set([
  'page_view', 'product_view', 'add_to_cart', 'begin_checkout',
  'payment_success', 'payment_failure', 'purchase', 'search', 'wishlist',
]);

export const analyticsRouter = Router();

analyticsRouter.post('/event', async (req: Request, res: Response) => {
  try {
    const { event, path, productId, orderId, value, currency } = req.body || {};
    if (!ALLOWED_EVENTS.has(event)) {
      return res.status(400).json({ error: 'Unknown event' });
    }

    let userId: string | null = null;
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (token) {
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          const { data: profile } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
          userId = profile?.id || null;
        }
      } catch { /* anonymous event */ }
    }

    await supabase.from('analytics_events').insert({
      event,
      path: typeof path === 'string' ? path.slice(0, 300) : null,
      product_id: productId || null,
      order_id: orderId || null,
      value: typeof value === 'number' ? value : null,
      currency: typeof currency === 'string' ? currency.slice(0, 3) : null,
      user_id: userId,
    });

    res.status(202).json({ received: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unable to record event' });
  }
});
