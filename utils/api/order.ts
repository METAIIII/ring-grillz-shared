import { Order, OrderStatus, OrderType } from '@prisma/client';

import prisma from '../../lib/prisma';
import {
  CreateOrder,
  FullOrder,
  RingFormAsMetadata,
  RingFormState,
  TeethForm,
  TeethFormAsMetadata,
  UpdateOrder,
} from '../../types';
import { getRingTotal, getTeethTotal } from '../getTotals';
import { getRingFromMetadata, getTeethFromMetadata } from '../stripeHelpers';

export const getOrders = async (type: OrderType, status?: OrderStatus) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        type,
        status,
      },
    });
    if (!orders) return null;
    return JSON.parse(JSON.stringify(orders)) as Order[];
  } catch (error) {
    return null;
  }
};

export const getOrder = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
        user: true,
      },
    });
    if (!order) return null;
    return JSON.parse(JSON.stringify(order)) as FullOrder;
  } catch (error) {
    return null;
  }
};

export const updateOrder = async (id: string, data: UpdateOrder) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        customerNotes: data.customerNotes,
        status: data.status,
        paymentType: data.paymentType,
        expressShipping: data.expressShipping,
        email: data.email ?? undefined,
        user: data.email
          ? {
              connect: {
                email: data.email,
              },
            }
          : undefined,
      },
      include: {
        items: true,
        user: true,
      },
    });
    if (!updatedOrder) return null;
    return JSON.parse(JSON.stringify(updatedOrder)) as FullOrder;
  } catch (error) {
    return null;
  }
};

export const createOrder = async (body: CreateOrder, type: OrderType) => {
  const orderTotal = body.items
    .map((item) => {
      const ringMetadata = JSON.parse(
        JSON.stringify(item?.price_data?.product_data?.metadata)
      ) as RingFormAsMetadata;

      const teethMetadata = JSON.parse(
        JSON.stringify(item?.price_data?.product_data?.metadata)
      ) as TeethFormAsMetadata;

      if (type === 'GRILLZ') {
        return getTeethTotal(
          getTeethFromMetadata(teethMetadata, body?.teethData ?? []),
          {
            expressShipping: body.expressShipping ?? false,
          }
        );
      }
      // if type === 'RING'
      else {
        return getRingTotal(
          getRingFromMetadata(ringMetadata, body?.ringData ?? []),
          {
            expressShipping: body.expressShipping ?? false,
          }
        );
      }
    })
    .reduce((acc, curr) => acc + curr, 0);

  try {
    const order = await prisma.order.create({
      data: {
        email: body?.email ?? '',
        customerNotes: body.customerNotes,
        total: orderTotal,
        type: body.type,
        status: body.status,
        items: {
          create: body.items.map((item) => {
            const ringMetadata = JSON.parse(
              JSON.stringify(item?.price_data?.product_data?.metadata)
            ) as RingFormState;

            const teethMetadata = JSON.parse(
              JSON.stringify(item?.price_data?.product_data?.metadata)
            ) as TeethForm;

            return type === 'GRILLZ'
              ? {
                  amount: getTeethTotal(teethMetadata, {
                    expressShipping: body.expressShipping ?? false,
                  }),
                  metadata: JSON.stringify(teethMetadata),
                }
              : // if 'RING'
                {
                  amount: getRingTotal(ringMetadata, {
                    expressShipping: body.expressShipping ?? false,
                  }),
                  metadata: JSON.stringify(ringMetadata),
                };
          }),
        },
        user: body.email
          ? {
              connectOrCreate: {
                where: {
                  email: body.email,
                },
                create: {
                  email: body.email,
                },
              },
            }
          : undefined,
      },
      include: {
        items: true,
        user: true,
      },
    });
    return JSON.parse(JSON.stringify(order)) as FullOrder;
  } catch (error) {
    return null;
  }
};
