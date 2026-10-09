// Resend email engine. All transactional email flows through this module.
// Docs: https://resend.com/docs/api-reference/emails/send-email
//
// Env:
//   RESEND_API_KEY   — required to actually send
//   EMAIL_FROM       — verified sender, e.g. "Tanelia <orders@tanelia.shop>"
//   EMAIL_REPLY_TO   — optional reply-to address
//   ADMIN_EMAIL      — where contact/enquiry notifications are delivered
const RESEND_API_URL = 'https://api.resend.com/emails';

// Every Tanelia email (customer confirmations and internal alerts) is also
// delivered to the Client Services inbox.
export const ADMIN_EMAIL_FALLBACK = 'taneliashop17@gmail.com';

const apiKey = (): string => process.env.RESEND_API_KEY || '';
const fromAddress = (): string => process.env.EMAIL_FROM || 'Tanelia <orders@tanelia.shop>';
const replyToAddress = (): string | undefined => process.env.EMAIL_REPLY_TO || undefined;
const adminAddress = (): string => process.env.ADMIN_EMAIL || ADMIN_EMAIL_FALLBACK;

export const isEmailConfigured = (): boolean => Boolean(apiKey());

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  bcc?: string | string[];
}

export interface EmailResult {
  sent: boolean;
  id?: string;
  skipped?: boolean;
  error?: string;
}

export const sendEmail = async (message: EmailMessage): Promise<EmailResult> => {
  if (!isEmailConfigured()) {
    console.warn('[email] RESEND_API_KEY not configured — email skipped.');
    return { sent: false, skipped: true };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey()}`,
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        ...(message.text ? { text: message.text } : {}),
        ...(message.replyTo || replyToAddress() ? { reply_to: message.replyTo || replyToAddress() } : {}),
        ...(message.bcc ? { bcc: Array.isArray(message.bcc) ? message.bcc : [message.bcc] } : {}),
      }),
    });

    const data: any = await response.json().catch(() => null);

    if (!response.ok) {
      const error = data?.message || data?.error || `Resend request failed (${response.status})`;
      console.error('[email] Send failed:', error);
      return { sent: false, error: String(error) };
    }

    return { sent: true, id: data?.id };
  } catch (err: any) {
    console.error('[email] Send error:', err?.message || err);
    return { sent: false, error: err?.message || 'Email send error' };
  }
};

export const sendAdminNotification = async (message: Omit<EmailMessage, 'to'>): Promise<EmailResult> =>
  sendEmail({ ...message, to: adminAddress() });

export const getAdminEmail = (): string => adminAddress();
