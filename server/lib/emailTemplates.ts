// Branded HTML email templates for the Resend engine.
// Table-based layout with inline styles for broad email client support.

export const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_SANS = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const INK = '#141414';
const MUTED = '#6B6560';
const GOLD = '#B5935A';
const BORDER = '#E8E2D8';
const BG = '#F4F1EB';

const money = (amount: number, symbol: string): string =>
  `${symbol}${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface LayoutOptions {
  title: string;
  preheader: string;
  content: string;
  supportEmail: string;
  footerNote?: string;
}

const layout = ({ title, preheader, content, supportEmail, footerNote }: LayoutOptions): string => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:8px 0 28px 0;">
              <div style="font-family:${FONT_SERIF};font-size:26px;letter-spacing:8px;color:${INK};text-transform:uppercase;">Tanelia</div>
              <div style="font-family:${FONT_SANS};font-size:10px;letter-spacing:4px;color:${GOLD};text-transform:uppercase;padding-top:6px;">Hair, Considered</div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid ${BORDER};border-radius:2px;padding:40px 36px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 16px 8px 16px;font-family:${FONT_SANS};font-size:11px;line-height:18px;color:${MUTED};">
              ${footerNote ? `<p style="margin:0 0 10px 0;color:${MUTED};">${footerNote}</p>` : ''}
              <p style="margin:0 0 6px 0;">Questions? Write to us at <a href="mailto:${escapeHtml(supportEmail)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(supportEmail)}</a></p>
              <p style="margin:0;">Tanelia · Oslo, Norway</p>
              <p style="margin:14px 0 0 0;color:#A8A29E;">You are receiving this email because you placed an order or contacted Tanelia.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const heading = (text: string): string =>
  `<h1 style="margin:0 0 8px 0;font-family:${FONT_SERIF};font-size:26px;line-height:34px;font-weight:500;color:${INK};">${escapeHtml(text)}</h1>`;

const eyebrow = (text: string): string =>
  `<div style="font-family:${FONT_SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-bottom:10px;">${escapeHtml(text)}</div>`;

const button = (label: string, url: string): string =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 4px 0;"><tr><td style="background-color:${INK};border-radius:2px;">
    <a href="${escapeHtml(url)}" style="display:inline-block;padding:15px 34px;font-family:${FONT_SANS};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
  </td></tr></table>`;

const divider = (): string =>
  `<div style="border-top:1px solid ${BORDER};margin:26px 0;"></div>`;

export interface OrderEmailItem {
  name: string;
  variant?: string;
  quantity: number;
  total: number;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  paymentMethodLabel: string;
  items: OrderEmailItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currencySymbol: string;
  shippingAddress: {
    name?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  isPreOrder?: boolean;
  supportEmail: string;
  trackingUrl?: string;
}

export const renderOrderConfirmation = (data: OrderEmailData): { subject: string; html: string; text: string } => {
  const symbol = data.currencySymbol || '€';
  const itemRows = data.items.map((item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:13px;line-height:20px;color:${INK};">
        <strong style="font-weight:600;">${escapeHtml(item.name)}</strong>
        ${item.variant ? `<div style="color:${MUTED};font-size:11px;padding-top:3px;">${escapeHtml(item.variant)}</div>` : ''}
        <div style="color:${MUTED};font-size:11px;padding-top:3px;">Quantity ${item.quantity}</div>
      </td>
      <td align="right" style="padding:14px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:13px;color:${INK};white-space:nowrap;vertical-align:top;">
        ${money(item.total, symbol)}
      </td>
    </tr>`).join('');

  const addressLines = [
    data.shippingAddress.name,
    data.shippingAddress.address,
    [data.shippingAddress.postalCode, data.shippingAddress.city].filter(Boolean).join(' '),
    data.shippingAddress.country,
    data.shippingAddress.phone ? `Tel: ${data.shippingAddress.phone}` : '',
  ].filter(Boolean).map((line) => escapeHtml(line)).join('<br />');

  const content = `
    ${eyebrow('Order Confirmed')}
    ${heading('Thank you for your order')}
    <p style="margin:14px 0 0 0;font-family:${FONT_SANS};font-size:13px;line-height:22px;color:${MUTED};">
      Dear ${escapeHtml(data.customerName)}, your order <strong style="color:${INK};">${escapeHtml(data.orderNumber)}</strong> has been received
      and payment confirmed via ${escapeHtml(data.paymentMethodLabel)}.
    </p>
    <p style="margin:10px 0 0 0;font-family:${FONT_SANS};font-size:13px;line-height:22px;color:${MUTED};">
      Each piece is prepared by hand and inspected in Oslo before dispatch. ${data.isPreOrder ? 'As your order includes a made-to-order piece, estimated delivery is 10–18 business days.' : 'Estimated delivery is 2–4 business days.'}
    </p>
    ${divider()}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${itemRows}
      <tr>
        <td style="padding:12px 0 2px 0;font-family:${FONT_SANS};font-size:12px;color:${MUTED};">Subtotal</td>
        <td align="right" style="padding:12px 0 2px 0;font-family:${FONT_SANS};font-size:12px;color:${MUTED};">${money(data.subtotal, symbol)}</td>
      </tr>
      ${data.discount > 0 ? `<tr>
        <td style="padding:2px 0;font-family:${FONT_SANS};font-size:12px;color:${GOLD};">Discount</td>
        <td align="right" style="padding:2px 0;font-family:${FONT_SANS};font-size:12px;color:${GOLD};">−${money(data.discount, symbol)}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:2px 0;font-family:${FONT_SANS};font-size:12px;color:${MUTED};">Delivery</td>
        <td align="right" style="padding:2px 0;font-family:${FONT_SANS};font-size:12px;color:${MUTED};">${data.shipping > 0 ? money(data.shipping, symbol) : 'Complimentary'}</td>
      </tr>
      <tr>
        <td style="padding:14px 0 0 0;font-family:${FONT_SANS};font-size:13px;font-weight:600;color:${INK};border-top:1px solid ${BORDER};">Total Paid</td>
        <td align="right" style="padding:14px 0 0 0;font-family:${FONT_SANS};font-size:15px;font-weight:600;color:${INK};border-top:1px solid ${BORDER};">${money(data.total, symbol)}</td>
      </tr>
    </table>
    ${divider()}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:${FONT_SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};padding-bottom:8px;">Delivery To</td>
      </tr>
      <tr>
        <td style="font-family:${FONT_SANS};font-size:13px;line-height:21px;color:${MUTED};">${addressLines}</td>
      </tr>
    </table>
    ${data.trackingUrl ? button('Track Your Order', data.trackingUrl) : ''}
    <p style="margin:18px 0 0 0;font-family:${FONT_SANS};font-size:12px;line-height:20px;color:${MUTED};">
      If you need anything at all, reply to this email or write to
      <a href="mailto:${escapeHtml(data.supportEmail)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(data.supportEmail)}</a>.
    </p>`;

  const text = [
    `TANELIA — Order Confirmed`,
    ``,
    `Dear ${data.customerName},`,
    `Thank you for your order ${data.orderNumber}. Payment confirmed via ${data.paymentMethodLabel}.`,
    ``,
    ...data.items.map((i) => `${i.name}${i.variant ? ` (${i.variant})` : ''} × ${i.quantity} — ${money(i.total, symbol)}`),
    ``,
    `Subtotal: ${money(data.subtotal, symbol)}`,
    ...(data.discount > 0 ? [`Discount: -${money(data.discount, symbol)}`] : []),
    `Delivery: ${data.shipping > 0 ? money(data.shipping, symbol) : 'Complimentary'}`,
    `Total Paid: ${money(data.total, symbol)}`,
    ``,
    `Delivery to:`,
    addressLines.replace(/<br \/>/g, '\n'),
    ``,
    data.trackingUrl ? `Track your order: ${data.trackingUrl}` : '',
    `Support: ${data.supportEmail}`,
  ].filter(Boolean).join('\n');

  return {
    subject: `Your Tanelia order ${data.orderNumber} is confirmed`,
    html: layout({
      title: `Order ${data.orderNumber} confirmed`,
      preheader: `Order ${data.orderNumber} confirmed — preparing your pieces in Oslo.`,
      content,
      supportEmail: data.supportEmail,
    }),
    text,
  };
};

export const renderContactNotification = (data: {
  name: string;
  email: string;
  message: string;
  submittedAt?: string;
  supportEmail: string;
}): { subject: string; html: string; text: string } => {
  const content = `
    ${eyebrow('New Enquiry')}
    ${heading('Client Services message')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};width:110px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:13px;color:${INK};">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:13px;"><a href="mailto:${escapeHtml(data.email)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(data.email)}</a></td>
      </tr>
      ${data.submittedAt ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Received</td>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_SANS};font-size:13px;color:${INK};">${escapeHtml(data.submittedAt)}</td>
      </tr>` : ''}
    </table>
    <div style="margin-top:22px;font-family:${FONT_SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">Message</div>
    <p style="margin:10px 0 0 0;font-family:${FONT_SANS};font-size:13px;line-height:22px;color:${INK};white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    ${button('Reply to ' + data.name, `mailto:${data.email}?subject=${encodeURIComponent('Re: Your enquiry to Tanelia')}`)}`;

  return {
    subject: `Tanelia enquiry — ${data.name}`,
    html: layout({
      title: 'New client enquiry',
      preheader: `New enquiry from ${data.name}`,
      content,
      supportEmail: data.supportEmail,
    }),
    text: `New enquiry\n\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  };
};
