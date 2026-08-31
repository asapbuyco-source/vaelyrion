import { Router, Request, Response } from 'express';
import { CheckoutController } from '../controllers/checkout.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Stripe webhook — must use raw body, registered BEFORE json parsing middleware
router.post('/webhook', CheckoutController.handleWebhook as any);

// Authenticated routes
router.post('/payment-intent', requireAuth, CheckoutController.createPaymentIntent as any);
router.post('/validate-coupon', requireAuth, CheckoutController.validateCoupon as any);
router.post('/pricing-preview', requireAuth, CheckoutController.pricingPreview as any);

export default router;
