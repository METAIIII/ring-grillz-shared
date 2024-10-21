import { OrderStatus } from '@prisma/client';

import prisma from './';

export async function transitionOrderStatus(
  orderId: string,
  event: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED',
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new Error('Order not found');
  }

  let newStatus: OrderStatus | undefined;

  switch (order.status) {
    case 'PENDING':
      if (event === 'PAYMENT_SUCCEEDED') {
        newStatus = 'PAID';
      } else if (event === 'PAYMENT_FAILED') {
        newStatus = 'UNPAID';
      }
      break;
    default:
      throw new Error('Invalid state transition');
  }

  if (newStatus) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }

  return newStatus;
}
