import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';

const ALLOWED_EVENTS = new Set([
  'page_view', 'product_view', 'add_to_cart', 'begin_checkout',
  'payment_success', 'payment_failure', 'purchase', 'search', 'wishlist',
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const asUuid = (value: unknown): string | null =>
  typeof value === 'string' && UUID_RE.test(value) ? value : null;

export const analyticsRouter = Router();

const analyticsLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, keyPrefix: 'analytics' });

analyticsRouter.post('/event', analyticsLimiter, async (req: Request, res: Response) => {
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

    const { error } = await supabase.from('analytics_events').insert({
      event,
      path: typeof path === 'string' ? path.slice(0, 300) : null,
      product_id: asUuid(productId),
      order_id: asUuid(orderId),
      value: typeof value === 'number' && Number.isFinite(value) ? value : null,
      currency: typeof currency === 'string' ? currency.slice(0, 3).toUpperCase() : null,
      user_id: userId,
    });

    if (error) {
      // Analytics must never break the storefront: log and still acknowledge.
      if (error.code === 'PGRST205') {
        console.warn('[analytics] analytics_events table is missing — apply migration 00006.');
      } else {
        console.error('[analytics] insert failed:', error.message);
      }
    }

    res.status(202).json({ received: true });
  } catch (error: any) {
    console.error('[analytics] error:', error?.message || error);
    res.status(202).json({ received: true });
  }
});
