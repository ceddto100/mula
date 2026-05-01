import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@cualquiercosano9.com';

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number; size?: string; color?: string }[];
  totalAmount: number;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

function formatOrderItemsHtml(items: OrderEmailData['items']): string {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}${item.size ? ` (${item.size})` : ''}${item.color ? ` / ${item.color}` : ''}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');
}

export async function sendNewOrderNotification(data: OrderEmailData): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

  const transport = createTransport();
  const shippingLine = data.shippingAddress
    ? `${data.shippingAddress.street || ''}, ${data.shippingAddress.city || ''}, ${data.shippingAddress.state || ''} ${data.shippingAddress.zipCode || ''}`
    : 'Not provided';

  await transport.sendMail({
    from: `"Mula Store" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New Order ${data.orderNumber} - $${data.totalAmount.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#111">New Order Received</h2>
        <p><strong>Order #:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Ship to:</strong> ${shippingLine}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Item</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${formatOrderItemsHtml(data.items)}</tbody>
        </table>
        <p style="font-size:18px"><strong>Order Total: $${data.totalAmount.toFixed(2)}</strong></p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

  const transport = createTransport();

  await transport.sendMail({
    from: `"Mula Store" <${ADMIN_EMAIL}>`,
    to: data.customerEmail,
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#111">Thanks for your order, ${data.customerName}!</h2>
        <p>Your order <strong>${data.orderNumber}</strong> has been confirmed and is being processed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Item</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${formatOrderItemsHtml(data.items)}</tbody>
        </table>
        <p style="font-size:18px"><strong>Order Total: $${data.totalAmount.toFixed(2)}</strong></p>
        <p style="color:#666;font-size:13px">Questions? Reply to this email or contact us at ${ADMIN_EMAIL}</p>
      </div>
    `,
  });
}
