// server/controllers/checkout.controller.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { lengthSurchargeEuros, shippingCostEuros } from '../lib/pricing.js';
import { getStripe, isStripeConfigured } from '../lib/stripe.js';
import { createCryptomusInvoice, isCryptomusConfigured, verifyCryptomusWebhook } from '../lib/cryptomus.js';
import type { CryptomusInvoice } from '../lib/cryptomus.js';
import { sendEmail, sendAdminNotification, getAdminEmail } from '../lib/email.js';
import { renderOrderConfirmation } from '../lib/emailTemplates.js';

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || 'taneliashop17@gmail.com';
const SITE_URL = (process.env.SITE_URL || 'https://www.tanelia.shop').replace(/\/+$/, '');
const API_BASE_URL = (process.env.API_URL || process.env.API_BASE_URL || SITE_URL).replace(/\/+$/, '');

const generateOrderNumber = () =>
  `VA${Date.now().toString(36).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

class CheckoutError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

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

interface PendingOrder {
  id: string;
  orderNumber: string;
  itemsSnapshot: Array<{ product_name_snapshot: string; variant_snapshot: any; quantity: number; unit_price: number; total: number }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

const formatVariantLabel = (options: any): string => {
  if (!options || typeof options !== 'object') return '';
  return Object.entries(options)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => `${key}: ${(value as any)?.length ? (value as any).length : value}`)
    .join(' · ');
};

// Builds the order from the server-side cart. Client prices and totals are never trusted.
const createPendingOrder = async (
  userId: string,
  addressSnapshot: any,
  shippingMethod: 'standard' | 'express',
  couponCode?: string,
): Promise<PendingOrder> => {
  if (!addressSnapshot || typeof addressSnapshot !== 'object') {
    throw new CheckoutError('Shipping address is required');
  }
  if (!['standard', 'express'].includes(shippingMethod)) {
    throw new CheckoutError('A valid shipping method is required');
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!cart) throw new CheckoutError('No active cart found');

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(`
      id, quantity, unit_price, options,
      products(id, name, slug, selling_price, supplier_cost, is_preorder, estimated_min_days, estimated_max_days),
      product_variants(id, sku, price_adjustment, attributes)
    `)
    .eq('cart_id', cart.id);

  if (itemsError) throw itemsError;
  if (!items || items.length === 0) throw new CheckoutError('Cart is empty');

  let subtotal = 0;
  const orderItems: any[] = [];

  for (const item of items) {
    const product: any = item.products;
    const variant: any = item.product_variants;
    const options: any = item.options || {};

    if (!product || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new CheckoutError('Your cart contains an unavailable item. Please refresh and try again.');
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

  if (orderItems.length === 0) throw new CheckoutError('Your cart is empty or unavailable.');

  let discount = 0;
  if (couponCode) {
    const evaluation = await evaluateCoupon(couponCode, subtotal);
    discount = evaluation.valid ? evaluation.discount : 0;
  }

  const shippingCost = shippingCostEuros(subtotal, shippingMethod);
  const total = Math.round((subtotal - discount + shippingCost) * 100) / 100;

  const { data: activeBatch } = await supabase
    .from('weekly_batches')
    .select('id')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let orderNumber = generateOrderNumber();
  let order: any = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
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

    if (!error) {
      order = data;
      break;
    }
    // Retry once if the random order number collided.
    if (error.code === '23505' && attempt < 2) {
      orderNumber = generateOrderNumber();
      continue;
    }
    throw error;
  }

  if (!order) throw new CheckoutError('Unable to create order', 500);

  const itemsWithOrderId = orderItems.map((i) => ({ ...i, order_id: order.id }));
  const { error: itemsInsertError } = await supabase.from('order_items').insert(itemsWithOrderId);
  if (itemsInsertError) throw itemsInsertError;

  return {
    id: order.id,
    orderNumber,
    itemsSnapshot: orderItems,
    subtotal,
    discount,
    shippingCost,
    total,
  };
};

const markOrderPaid = async (orderId: string, providerPaymentId: string): Promise<boolean> => {
  // Idempotency: only act on the state transition.
  const { data: current } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (!current) return false;
  if (current.status === 'PAID') return false;

  await supabase
    .from('orders')
    .update({ status: 'PAID', payment_status: 'paid', updated_at: new Date().toISOString() })
    .eq('id', orderId);

  await supabase
    .from('payments')
    .update({ status: 'succeeded', paid_at: new Date().toISOString() })
    .eq('provider_payment_id', providerPaymentId);

  const { data: order } = await supabase
    .from('orders')
    .select('user_id, order_number')
    .eq('id', orderId)
    .single();

  if (order?.user_id) {
    await supabase
      .from('carts')
      .update({ status: 'completed' })
      .eq('user_id', order.user_id)
      .eq('status', 'active');

    await supabase.from('notifications').insert({
      user_id: order.user_id,
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being processed.',
      data: { orderId },
    });
  }

  await sendOrderConfirmationEmail(orderId);
  console.log(`Order ${orderId} marked as PAID (${providerPaymentId}).`);
  return true;
};

const markOrderCancelled = async (orderId: string, providerPaymentId: string, paymentStatus: 'cancelled' | 'failed') => {
  const { data: current } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();
  if (!current || current.status === 'PAID') return;

  await supabase
    .from('orders')
    .update({ status: 'CANCELLED', payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .neq('status', 'PAID');

  await supabase
    .from('payments')
    .update({ status: paymentStatus })
    .eq('provider_payment_id', providerPaymentId);
};

export class CheckoutController {
  static async createPaymentIntent(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!isStripeConfigured()) {
        return res.status(503).json({ error: 'Card payments are temporarily unavailable. Please contact Client Services.' });
      }

      const { addressSnapshot, shippingMethod = 'standard', couponCode } = req.body;
      const order = await createPendingOrder(userId, addressSnapshot, shippingMethod, couponCode);

      const stripe = getStripe()!;

      // Create Stripe PaymentIntent (idempotency key prevents double charges)
      let paymentIntent: Stripe.PaymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.total * 100),
          currency: 'eur',
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId,
          },
        }, {
          idempotencyKey: order.id,
        });
      } catch (stripeError) {
        await supabase.from('orders').update({ status: 'CANCELLED', payment_status: 'failed' }).eq('id', order.id);
        throw stripeError;
      }

      const { error: paymentInsertError } = await supabase.from('payments').insert({
        order_id: order.id,
        provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        amount: order.total,
        currency: 'EUR',
        status: 'pending',
      });
      if (paymentInsertError) {
        console.error('Failed to record Stripe payment row:', paymentInsertError.message);
      }

      res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCost: order.shippingCost,
      });
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (err instanceof CheckoutError) return res.status(err.status).json({ error: err.message });
      res.status(500).json({ error: 'We could not start your payment. Please try again.' });
    }
  }

  static async createCryptomusPayment(req: AuthRequest, res: Response) {
    try {
      const userId = req.userProfile?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!isCryptomusConfigured()) {
        return res.status(503).json({ error: 'Cryptomus payments are temporarily unavailable. Please contact Client Services.' });
      }

      const { addressSnapshot, shippingMethod = 'standard', couponCode } = req.body;
      const order = await createPendingOrder(userId, addressSnapshot, shippingMethod, couponCode);

      let invoice: CryptomusInvoice;
      try {
        invoice = await createCryptomusInvoice({
          amount: order.total.toFixed(2),
          currency: 'EUR',
          order_id: order.id,
          url_callback: `${API_BASE_URL}/api/v1/checkout/cryptomus/webhook`,
          url_return: `${SITE_URL}/checkout?payment=cancel&order=${order.id}`,
          url_success: `${SITE_URL}/checkout?payment=success&order=${order.id}`,
          lifetime: 3600,
          is_payment_multiple: true,
          additional_data: order.orderNumber,
        });
      } catch (cryptomusError: any) {
        await supabase.from('orders').update({ status: 'CANCELLED', payment_status: 'failed' }).eq('id', order.id);
        console.error('Cryptomus invoice creation failed:', cryptomusError.message);
        throw new CheckoutError('Unable to start Cryptomus payment. Please try again.', 502);
      }

      const { error: paymentInsertError } = await supabase.from('payments').insert({
        order_id: order.id,
        provider: 'cryptomus',
        provider_payment_id: invoice.uuid,
        amount: order.total,
        currency: 'EUR',
        status: 'pending',
      });
      if (paymentInsertError) {
        console.error('Failed to record Cryptomus payment row:', paymentInsertError.message);
      }

      res.json({
        paymentUrl: invoice.url,
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCost: order.shippingCost,
      });
    } catch (err: any) {
      console.error('Cryptomus checkout error:', err);
      if (err instanceof CheckoutError) return res.status(err.status).json({ error: err.message });
      res.status(500).json({ error: 'We could not start your payment. Please try again.' });
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

  static async handleCryptomusWebhook(req: Request, res: Response) {
    try {
      const body: any = req.body;

      if (!verifyCryptomusWebhook(body)) {
        console.error('Cryptomus webhook signature verification failed');
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const orderId = String(body.order_id || '');
      const invoiceUuid = String(body.uuid || '');
      const status = String(body.status || body.payment_status || '');

      if (!orderId) return res.status(400).json({ error: 'Missing order_id' });

      const { data: order } = await supabase
        .from('orders')
        .select('id, order_number, total, status')
        .eq('id', orderId)
        .single();

      if (!order) {
        console.warn(`Cryptomus webhook for unknown order ${orderId}`);
        return res.status(200).json({ received: true });
      }

      switch (status) {
        case 'paid':
        case 'paid_over': {
          const paidAmount = Number(body.payment_amount || body.amount || 0);
          if (paidAmount + 0.01 < Number(order.total)) {
            console.warn(`Cryptomus order ${order.order_number} marked ${status} but amount ${paidAmount} < total ${order.total}`);
          }
          await markOrderPaid(order.id, invoiceUuid);
          break;
        }
        case 'cancel':
        case 'fail':
        case 'system_fail':
          await markOrderCancelled(order.id, invoiceUuid, 'cancelled');
          break;
        case 'wrong_amount':
          console.warn(`Cryptomus order ${order.order_number} underpaid — awaiting remaining amount.`);
          break;
        case 'refund_paid':
          await supabase.from('orders').update({ status: 'REFUNDED', payment_status: 'refunded' }).eq('id', order.id);
          await supabase.from('payments').update({ status: 'refunded' }).eq('provider_payment_id', invoiceUuid);
          break;
        case 'refund_process':
        case 'refund_fail':
          await supabase.from('payments').update({ status: 'refunded' }).eq('provider_payment_id', invoiceUuid);
          break;
        case 'check':
        case 'confirm_check':
        case 'process':
        default:
          // Not yet final — nothing to do.
          break;
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Cryptomus webhook error:', error);
      // Return 200 so Cryptomus does not hammer retries on our internal errors;
      // failures are logged and can be replayed from the dashboard.
      return res.status(200).json({ received: true });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    const stripe = getStripe();
    if (!stripe) {
      return (res as any).status(503).json({ error: 'Stripe is not configured' });
    }

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
      return (res as any).status(400).json({ error: 'Webhook signature verification failed' });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (orderId) {
          const { data: order } = await supabase
            .from('orders')
            .select('total')
            .eq('id', orderId)
            .single();

          if (order && Math.round(Number(order.total) * 100) !== pi.amount_received) {
            console.error(`Stripe amount mismatch for order ${orderId}: expected ${order.total}, received ${pi.amount_received / 100}`);
          }

          await markOrderPaid(orderId, pi.id);
        }
        break;
      }

      case 'payment_intent.canceled': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;
        if (orderId) await markOrderCancelled(orderId, pi.id, 'cancelled');
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;
        if (orderId) await markOrderCancelled(orderId, pi.id, 'failed');
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
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('order_number, subtotal, shipping_cost, discount, total, currency, shipping_address_snapshot, users(email, first_name, last_name)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) return;

    const customer: any = (order as any).users || {};
    if (!customer.email) {
      console.warn(`[email] No customer email for order ${order.order_number} — confirmation skipped.`);
      return;
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('product_name_snapshot, variant_snapshot, quantity, total, products(is_preorder)')
      .eq('order_id', orderId);

    const name = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Valued Client';
    const snapshot: any = order.shipping_address_snapshot || {};

    const { subject, html, text } = renderOrderConfirmation({
      orderNumber: order.order_number,
      customerName: name,
      paymentMethodLabel: 'secure payment',
      items: (items || []).map((i: any) => ({
        name: i.product_name_snapshot || 'Tanelia creation',
        variant: formatVariantLabel(i.variant_snapshot),
        quantity: i.quantity,
        total: Number(i.total || 0),
      })),
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      shipping: Number(order.shipping_cost || 0),
      total: Number(order.total || 0),
      currencySymbol: order.currency === 'EUR' || !order.currency ? '€' : `${order.currency} `,
      shippingAddress: {
        name: snapshot.name,
        address: snapshot.address,
        city: snapshot.city,
        postalCode: snapshot.postalCode,
        country: snapshot.country,
        phone: snapshot.phone,
      },
      isPreOrder: (items || []).some((i: any) => i.products?.is_preorder),
      supportEmail: SUPPORT_EMAIL,
      trackingUrl: `${SITE_URL}/tracking`,
    });

    // The Client Services inbox (taneliashop17@gmail.com by default) receives a
    // copy of every confirmation email via BCC.
    const result = await sendEmail({ to: customer.email, bcc: getAdminEmail(), subject, html, text });
    if (result.sent) console.log(`[email] Order confirmation sent for ${order.order_number}`);

    await sendAdminNotification({
      subject: `New paid order ${order.order_number}`,
      html: `<p>Order <strong>${order.order_number}</strong> was paid.</p><p>Total: €${Number(order.total).toFixed(2)}</p>`,
      text: `Order ${order.order_number} paid. Total €${Number(order.total).toFixed(2)}`,
      replyTo: customer.email,
    });
  } catch (err: any) {
    console.error('[email] Order confirmation error:', err.message);
  }
};
