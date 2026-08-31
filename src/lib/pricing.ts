// Display-only mirror of the server pricing rules in server/lib/pricing.ts.
// Charging ALWAYS happens server-side. Keep these values in sync.
export const LENGTH_SURCHARGE_PER_INCH_EUR = 15;
export const LENGTH_SURCHARGE_BASE_INCHES = 20;
export const FREE_SHIPPING_THRESHOLD_EUR = 250;
export const STANDARD_SHIPPING_EUR = 15;
export const EXPRESS_SHIPPING_EUR = 25;

export const lengthSurchargeEuros = (length: string): number => {
  const match = String(length ?? '').match(/(\d+)/);
  const inches = match ? parseInt(match[1], 10) : 0;
  if (inches <= LENGTH_SURCHARGE_BASE_INCHES) return 0;
  return (inches - LENGTH_SURCHARGE_BASE_INCHES) * LENGTH_SURCHARGE_PER_INCH_EUR;
};

export const shippingCostEuros = (subtotal: number, method: 'standard' | 'express' = 'standard'): number => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD_EUR) return 0;
  return method === 'express' ? EXPRESS_SHIPPING_EUR : STANDARD_SHIPPING_EUR;
};
