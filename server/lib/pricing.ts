// Single source of truth for Tanelia pricing rules.
// The frontend mirrors these values in src/lib/pricing.ts for display only.
// Charging always uses this server module.

export const LENGTH_SURCHARGE_PER_INCH_EUR = 15;
export const LENGTH_SURCHARGE_BASE_INCHES = 20;
export const FREE_SHIPPING_THRESHOLD_EUR = 250;
export const STANDARD_SHIPPING_EUR = 15;
export const EXPRESS_SHIPPING_EUR = 25;

export const parseLengthInches = (length: unknown): number => {
  const match = String(length ?? '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const lengthSurchargeEuros = (length: unknown): number => {
  const inches = parseLengthInches(length);
  if (inches <= LENGTH_SURCHARGE_BASE_INCHES) return 0;
  return (inches - LENGTH_SURCHARGE_BASE_INCHES) * LENGTH_SURCHARGE_PER_INCH_EUR;
};

export const shippingCostEuros = (subtotal: number, method: 'standard' | 'express' = 'standard'): number => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD_EUR) return 0;
  return method === 'express' ? EXPRESS_SHIPPING_EUR : STANDARD_SHIPPING_EUR;
};
