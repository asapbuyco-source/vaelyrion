// Lazy Stripe client. Constructing `new Stripe('')` throws at import time and
// would crash the whole serverless function when STRIPE_SECRET_KEY is missing.
import Stripe from 'stripe';

let client: Stripe | null = null;

const stripeKey = (): string => process.env.STRIPE_SECRET_KEY || '';

export const isStripeConfigured = (): boolean => {
  const key = stripeKey();
  return Boolean(key) && !key.includes('...');
};

export const getStripe = (): Stripe | null => {
  if (!isStripeConfigured()) return null;
  if (!client) client = new Stripe(stripeKey());
  return client;
};
