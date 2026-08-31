// server/controllers/checkout.controller.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { lengthSurchargeEuros, shippingCostEuros } from '../lib/pricing.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey);

const generateOrderNumber = () => `VA${Math.floor(10000 + Math.random() * 90000)}`;

interface CouponEvaluation {
  valid: boolean;
  discount: number;
  couponId?: string;
  message?: string;
}

const evaluateCoupon = async (code: string, subtotal: number): Promise<CouponEvaluation> => {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) return { valid: false, discount: 0, message: 'Enter a code to apply.' };
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', cleanCode)
    .eq('active', true)
    .single();

  if (!coupon) return { valid: false, discount: 0, message: 'This code is not recognised.' };

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return { valid: false, discount: 0, message: 'This code is not active yet.' };
  if (coupon.expires_at && new Date(coupon.expires_at) <= now) return { valid: false, discount: 0, message: 'This code has expired.' };
  if (coupon.minimum_order && subtotal < coupon.minimum_order) return { valid: false, discount: 0, message: `This code requires a minimum order of €${coupon.minimum_order}.` };

  let discount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : Number(coupon.value || 0);
  if (coupon.maximum_discount) discount = Math.min(discount, Number(coupon.maximum_discount));
  discount = Math.min(discount, subtotal);
  return { valid: true, discount, couponId: coupon.id };
};

export class CheckoutController {
  static async createPaymentIntent(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { addressSnapshot, shippingMethod = 'standard', couponCode } = req.body;

      if (!addressSnapshot) {
        return res.status(400).json({ error: 'Shipping address is required' });
      }
      if (!['standard', 'express'].includes(shippingMethod)) {
        return res.status(400).json({ error: 'A valid shipping method is required' });
      }
      if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_...')) {
        return res.status(503).json({ error: 'Payments are temporarily unavailable. Please contact Client Services.' });
      }

      // Fetch active cart with items — backend always calculates the total
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!cart) return res.status(400).json({ error: 'No active cart found' });

      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id, quantity, unit_price, options,
          products(id, name, slug, selling_price, supplier_cost, is_preorder, estimated_min_days, estimated_max_days),
          product_variants(id, sku, price_adjustment, attributes)
        `)
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Recalculate total from DB prices + pricing rules (NEVER trust client)
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product: any = item.products;
        const variant: any = item.product_variants;
        const options: any = item.options || {};

        if (!product || !Number.isInteger(item.quantity) || item.quantity <= 0) {
          return res.status(400).json({ error: 'Your cart contains an unavailable item. Please refresh and try again.' });
        }

        const unitPrice = product.selling_price + (variant?.price_adjustment || 0) + lengthSurchargeEuros(options.length);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: product.id,
          variant_id: variant?.id || null,
          product_name_snapshot: product.name,
          variant_snapshot: variant?.attributes || options,
          sku: variant?.sku || null,
          quantity: item.quantity,
          unit_price: unitPrice,
          supplier_cost_snapshot: product.supplier_cost,
          total: itemTotal,
        });
      }

      if (orderItems.length === 0) {
        return res.status(400).json({ error: 'Your cart is empty or unavailable.' });
      }

      // Apply coupon if provided — validated server-side
      let discount = 0;
      if (couponCode) {
        const evaluation = await evaluateCoupon(couponCode, subtotal);
        discount = evaluation.valid ? evaluation.discount : 0;
      }

      const shippingCost = shippingCostEuros(subtotal, shippingMethod);
      const total = subtotal - discount + shippingCost;
      const totalInCents = Math.round(total * 100);

      // Find current open batch
      const { data: activeBatch } = await supabase
        .from('weekly_batches')
        .select('id')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Create the order in PENDING_PAYMENT state
      const orderNumber = generateOrderNumber();
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId,
          batch_id: activeBatch?.id || null,
          status: 'PENDING_PAYMENT',
          payment_status: 'pending',
          currency: 'EUR',
          subtotal,
          shipping_cost: shippingCost,
          discount,
          tax: 0,
          total,
          shipping_address_snapshot: addressSnapshot,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const itemsWithOrderId = orderItems.map(i => ({ ...i, order_id: order.id }));
      await supabase.from('order_items').insert(itemsWithOrderId);

      // Create Stripe PaymentIntent (idempotency key prevents double charges)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalInCents,
        currency: 'eur',
        metadata: {
          orderId: order.id,
          orderNumber,
          userId,
        },
      }, {
        idempotencyKey: order.id,
      });

      // Record payment record
      await supabase.from('payments').insert({
        order_id: order.id,
        provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        amount: total,
        currency: 'EUR',
        status: 'pending',
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        orderNumber,
        total,
        subtotal,
        discount,
        shippingCost,
      });
    } catch (err: any) {
      console.error('Checkout error:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async validateCoupon(req: AuthRequest, res: Response) {
    try {
      const code = String(req.body?.code || '').trim();
      const subtotal = Number(req.body?.subtotal || 0);
      if (!code) return res.status(400).json({ error: 'Enter a code to apply.' });
      const evaluation = await evaluateCoupon(code, Math.max(0, subtotal));
      res.json(evaluation);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to validate code' });
    }
  }

  static async pricingPreview(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { shippingMethod = 'standard', couponCode } = req.body;

      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      let subtotal = 0;
      if (cart) {
        const { data: items, error } = await supabase
          .from('cart_items')
          .select('id, quantity, options, products(selling_price), product_variants(price_adjustment)')
          .eq('cart_id', cart.id);
        if (error) throw error;
        for (const itemRaw of items || []) {
          const item: any = itemRaw;
          const unit = (item.products?.selling_price || 0) + (item.product_variants?.price_adjustment || 0) + lengthSurchargeEuros(item.options?.length);
          subtotal += unit * item.quantity;
        }
      }

      let discount = 0;
      let couponValid = false;
      if (couponCode) {
        const evaluation = await evaluateCoupon(couponCode, subtotal);
        if (evaluation.valid) { discount = evaluation.discount; couponValid = true; }
      }

      const shippingCost = shippingCostEuros(subtotal, shippingMethod);
      res.json({ subtotal, discount, couponValid, shippingCost, total: subtotal - discount + shippingCost });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to calculate pricing' });
    }
  }

  static async cleanupStaleOrders(req: Request, res: Response) {
    try {
      const configuredSecret = process.env.CRON_SECRET;
      const suppliedSecret = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.headers['x-cron-secret'];
      if (!configuredSecret || suppliedSecret !== configuredSecret) {
        return res.status(401).json({ error: 'Unauthorized cron request' });
      }
      const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const { data: stale, error } = await supabase
        .from('orders')
        .update({ status: 'CANCELLED', payment_status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('status', 'PENDING_PAYMENT')
        .lt('created_at', cutoff)
        .select('id');
      if (error) throw error;
      res.json({ cancelled: stale?.length || 0 });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to clean up stale orders' });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    const sig = (req as any).headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return (res as any).status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (orderId) {
          // Idempotency: Stripe may redeliver. Only act on the state transition.
          const { data: current } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();

          if (current?.status === 'PAID') break;

          // Mark order as PAID
          await supabase
            .from('orders')
            .update({ status: 'PAID', payment_status: 'paid', updated_at: new Date().toISOString() })
            .eq('id', orderId);

          // Mark payment as paid
          await supabase
            .from('payments')
            .update({ status: 'succeeded', paid_at: new Date().toISOString() })
            .eq('provider_payment_id', pi.id);

          // Mark cart as completed
          const { data: order } = await supabase
            .from('orders')
            .select('user_id, order_number, subtotal, shipping_cost, discount, total')
            .eq('id', orderId)
            .single();

          if (order?.user_id) {
            await supabase
              .from('carts')
              .update({ status: 'completed' })
              .eq('user_id', order.user_id)
              .eq('status', 'active');
          }

          // Create order confirmation notification
          if (order?.user_id) {
            await supabase.from('notifications').insert({
              user_id: order.user_id,
              type: 'order',
              title: `Order Confirmed`,
              message: `Your order has been confirmed and is being processed.`,
              data: { orderId },
            });
          }

          // Order confirmation email (deduped by the state-transition guard above)
          await sendOrderConfirmationEmail(orderId);

          console.log(`Order ${orderId} marked as PAID.`);
        }
        break;
      }

      case 'payment_intent.canceled': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'CANCELLED', payment_status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .eq('status', 'PENDING_PAYMENT');

          await supabase
            .from('payments')
            .update({ status: 'cancelled' })
            .eq('provider_payment_id', pi.id);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (orderId) {
          // Only mark failed if the order hasn't already been paid (prevents
          // a stale failure event from cancelling a completed order).
          const { data: current } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();
          if (current?.status !== 'PAID') {
            await supabase
              .from('orders')
              .update({ status: 'CANCELLED', payment_status: 'failed' })
              .eq('id', orderId);

            await supabase
              .from('payments')
              .update({ status: 'failed' })
              .eq('provider_payment_id', pi.id);
          }
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const pi = charge.payment_intent as string;

        if (pi) {
          const { data: payment } = await supabase
            .from('payments')
            .select('order_id')
            .eq('provider_payment_id', pi)
            .single();

          if (payment?.order_id) {
            await supabase
              .from('orders')
              .update({ status: 'REFUNDED', payment_status: 'refunded' })
              .eq('id', payment.order_id);

            await supabase
              .from('payments')
              .update({ status: 'refunded' })
              .eq('provider_payment_id', pi);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    (res as any).json({ received: true });
  }
}

const sendOrderConfirmationEmail = async (orderId: string) => {
  try {
    const templateId = process.env.EMAILJS_ORDER_TEMPLATE_ID;
    if (!templateId) {
      console.log('[email] EMAILJS_ORDER_TEMPLATE_ID not configured — order email skipped.');
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('order_number, subtotal, shipping_cost, discount, total, currency, shipping_address_snapshot, users(email, first_name, last_name)')
      .eq('id', orderId)
      .single();
    if (orderError || !order) return;

    const { data: items } = await supabase
      .from('order_items')
      .select('product_name_snapshot, variant_snapshot, quantity, unit_price, total')
      .eq('order_id', orderId);

    const itemsSummary = (items || [])
      .map((i: any) => {
        const attrs = i.variant_snapshot && typeof i.variant_snapshot === 'object'
          ? Object.entries(i.variant_snapshot).map(([k, v]) => `${k}: ${(v as any)?.length ? (v as any).length : v}`).join(' · ')
          : '';
        return `${i.product_name_snapshot} — ${attrs ? attrs + ' · ' : ''}Qty ${i.quantity} — €${Number(i.total).toFixed(2)}`;
      })
      .join('\n');

    const customer: any = (order as any).users || {};
    const name = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Valued Client';

    const payload: any = {
      service_id: 'service_6spz37t',
      template_id: templateId,
      user_id: 'VwG3UpqiiqDYbjQuO',
      ...(process.env.EMAILJS_PRIVATE_KEY ? { accessToken: process.env.EMAILJS_PRIVATE_KEY } : {}),
      template_params: {
        to_email: customer.email || '',
        customer_name: name,
        order_number: order.order_number,
        items_summary: itemsSummary || 'Your Tanelia pieces',
        subtotal: `€${Number(order.subtotal).toFixed(2)}`,
        discount: order.discount ? `−€${Number(order.discount).toFixed(2)}` : '—',
        shipping: order.shipping_cost > 0 ? `€${Number(order.shipping_cost).toFixed(2)}` : 'Complimentary',
        total: `€${Number(order.total).toFixed(2)}`,
        delivery_note: 'Made-to-order pieces are finished by hand and dispatched from Oslo. Estimated delivery: 10–18 business days.',
        support_email: 'taneliashop17@gmail.com',
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('[email] Order confirmation failed:', text);
    } else {
      console.log(`[email] Order confirmation sent for ${order.order_number}`);
    }
  } catch (err: any) {
    console.error('[email] Order confirmation error:', err.message);
  }
};
