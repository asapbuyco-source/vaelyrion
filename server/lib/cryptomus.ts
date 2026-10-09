// Cryptomus merchant API client.
// Docs: https://doc.cryptomus.com/merchant-api/payments/creating-invoice
//
// Auth: headers `merchant` (merchant UUID) + `sign`
// sign = md5( base64( json_encode(payload) ) + PAYMENT_API_KEY )
import crypto from 'crypto';

const API_URL = 'https://api.cryptomus.com/v1';

const merchantId = (): string => process.env.CRYPTOMUS_MERCHANT_ID || '';
const paymentApiKey = (): string => process.env.CRYPTOMUS_PAYMENT_API_KEY || '';

export const isCryptomusConfigured = (): boolean =>
  Boolean(merchantId() && paymentApiKey());

const signPayload = (payload: unknown): string =>
  crypto
    .createHash('md5')
    .update(Buffer.from(JSON.stringify(payload)).toString('base64') + paymentApiKey())
    .digest('hex');

export interface CryptomusInvoice {
  uuid: string;
  url: string;
  order_id?: string | null;
  amount?: string;
  currency?: string;
  payment_status?: string;
  status?: string;
  expired_at?: number | null;
  [key: string]: unknown;
}

export interface CreateInvoiceInput {
  amount: string;
  currency: string;
  order_id: string;
  url_callback?: string;
  url_return?: string;
  url_success?: string;
  lifetime?: number;
  is_payment_multiple?: boolean;
  to_currency?: string;
  network?: string;
  additional_data?: string;
}

export const createCryptomusInvoice = async (input: CreateInvoiceInput): Promise<CryptomusInvoice> => {
  if (!isCryptomusConfigured()) {
    throw new Error('Cryptomus is not configured');
  }

  const body = JSON.stringify(input);
  const response = await fetch(`${API_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      merchant: merchantId(),
      sign: signPayload(input),
    },
    body,
  });

  const data: any = await response.json().catch(() => null);

  if (!response.ok || !data || data.state !== 0 || !data.result) {
    const message = data?.message || data?.errors?.message || `Cryptomus request failed (${response.status})`;
    throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
  }

  return data.result as CryptomusInvoice;
};

// Webhook verification. Cryptomus sends the full payload plus a `sign` field.
// We rebuild the signature from the payload without `sign` using the payment API key.
export const verifyCryptomusWebhook = (body: unknown): boolean => {
  if (!body || typeof body !== 'object') return false;
  const payload = body as Record<string, unknown>;
  const received = payload.sign;
  if (typeof received !== 'string' || !received) return false;
  if (!paymentApiKey()) return false;

  const { sign: _sign, ...rest } = payload;

  // PHP's json_encode escapes forward slashes by default; JSON.stringify does not.
  // Accept either encoding so payload values containing "/" still verify.
  const candidates = [
    JSON.stringify(rest),
    JSON.stringify(rest).replace(/\//g, '\\/'),
  ];

  for (const candidate of candidates) {
    const expected = crypto
      .createHash('md5')
      .update(Buffer.from(candidate).toString('base64') + paymentApiKey())
      .digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(received);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }

  return false;
};
