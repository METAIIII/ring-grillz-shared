import { ADMIN_EMAIL, sendEmail } from '.';

import prisma from '../prisma';
import { OrderConfirmationAdminVars, OrderConfirmationVars } from '../types/email';

export async function sendOrderConfirmationEmails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { email: true, type: true },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const customerEmailVars: OrderConfirmationVars = {
      orderID: orderId,
      viewOrderURL: `${process.env.NEXT_PUBLIC_APP_URL}/receipt?order_id=${orderId}`,
    };

    const adminEmailVars: OrderConfirmationAdminVars = {
      ...customerEmailVars,
      customerEmail: order.email,
    };

    // Send order confirmation email to the customer
    await sendEmail({
      template: 'order-confirmation',
      vars: customerEmailVars,
      subject: 'Order Receipt',
      recipient: order.email,
      orderType: order.type,
    });

    // Send order confirmation email to the admin
    await sendEmail({
      template: 'order-confirmation-admin',
      vars: adminEmailVars,
      subject: 'Order Received',
      recipient: ADMIN_EMAIL,
      replyTo: order.email,
      orderType: order.type,
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        hasSentReceiptEmail: true,
        hasSentOrderEmail: true,
      },
    });
  } catch (error) {
    console.error('Failed to send order confirmation emails:', error);
    throw error;
  }
}
