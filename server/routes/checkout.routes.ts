import { Router, Request, Response } from 'express';
import { CheckoutController } from '../controllers/checkout.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

const paymentLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20, keyPrefix: 'payment' });

// Stripe webhook — must use raw body, registered BEFORE json parsing middleware
router.post('/webhook', CheckoutController.handleWebhook as any);

// Cryptomus webhook — JSON body, signature verified in the controller
router.post('/cryptomus/webhook', CheckoutController.handleCryptomusWebhook as any);

// Authenticated routes
router.post('/payment-intent', requireAuth, paymentLimiter, CheckoutController.createPaymentIntent as any);
router.post('/cryptomus/payment', requireAuth, paymentLimiter, CheckoutController.createCryptomusPayment as any);
router.post('/validate-coupon', requireAuth, CheckoutController.validateCoupon as any);
router.post('/pricing-preview', requireAuth, CheckoutController.pricingPreview as any);

export default router;
