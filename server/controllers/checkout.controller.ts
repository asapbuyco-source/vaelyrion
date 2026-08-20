// server/controllers/checkout.controller.ts
import { Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey);

const generateOrderNumber = () => `VA${Math.floor(10000 + Math.random() * 90000)}`;

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
          id, quantity, unit_price,
          products(id, name, slug, selling_price, supplier_cost, is_preorder, estimated_min_days, estimated_max_days),
          product_variants(id, sku, price_adjustment, attributes)
        `)
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Recalculate total from DB prices (NEVER trust client)
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product: any = item.products;
        const variant: any = item.product_variants;

        if (!product || !Number.isInteger(item.quantity) || item.quantity <= 0) {
          return res.status(400).json({ error: 'Your cart contains an unavailable item. Please refresh and try again.' });
        }

        const unitPrice = product.selling_price + (variant?.price_adjustment || 0);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: product.id,
          variant_id: variant?.id || null,
          product_name_snapshot: product.name,
          variant_snapshot: variant?.attributes || null,
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

      // Apply coupon if provided
      let discount = 0;
      if (couponCode) {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .eq('active', true)
          .single();

        if (coupon) {
          const now = new Date();
          const isValid =
            (!coupon.starts_at || new Date(coupon.starts_at) <= now) &&
            (!coupon.expires_at || new Date(coupon.expires_at) >= now) &&
            (!coupon.minimum_order || subtotal >= coupon.minimum_order);

          if (isValid) {
            if (coupon.type === 'percentage') {
              discount = subtotal * (coupon.value / 100);
            } else {
              discount = coupon.value;
            }
            if (coupon.maximum_discount) {
              discount = Math.min(discount, coupon.maximum_discount);
            }
            discount = Math.min(discount, subtotal);
          }
        }
      }

      const shippingCost = subtotal >= 250 ? 0 : shippingMethod === 'express' ? 25 : 15;
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
            .select('user_id')
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
          await supabase.from('notifications').insert({
            user_id: order?.user_id,
            type: 'order',
            title: `Order Confirmed`,
            message: `Your order has been confirmed and is being processed.`,
            data: { orderId },
          });

          console.log(`Order ${orderId} marked as PAID.`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'CANCELLED', payment_status: 'failed' })
            .eq('id', orderId);

          await supabase
            .from('payments')
            .update({ status: 'failed' })
            .eq('provider_payment_id', pi.id);
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
