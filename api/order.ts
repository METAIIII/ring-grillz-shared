import { Order, OrderStatus, OrderType } from '@prisma/client';

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../config/auth';
import prisma from '../prisma';
import {
  CreateOrder,
  FullOrder,
  GrillzForm,
  GrillzFormAsMetadata,
  RingFormAsMetadata,
  RingFormState,
  UpdateOrder,
} from '../types';
import { OrderResponse, OrdersResponse } from '../types/apiResponses';
import { getGrillzTotal, getRingTotal } from '../utils/getTotals';
import { getGrillzFromMetadata, getRingFromMetadata } from '../utils/stripeHelpers';
import { handleApiError } from './error';
import { getUser } from './user';

/**
 * Fetches multiple orders based on the provided type and status.
 * @param {OrderType} type The type of orders to fetch.
 * @param {OrderStatus} [status] The status of orders to fetch (optional).
 * @returns {Promise<Order[] | null>} An array of Order objects or null if not found or an error occurs.
 */
export const getOrders = async (type: OrderType, status?: OrderStatus): Promise<Order[] | null> => {
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

/**
 * Fetches a single order based on the provided order ID.
 * @param {string} id The ID of the order to fetch.
 * @returns {Promise<FullOrder | null>} A FullOrder object or null if not found or an error occurs.
 */
export const getOrder = async (id: string): Promise<FullOrder | null> => {
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

/**
 * Updates an order based on the provided order ID and data.
 * @param {string} id The ID of the order to update.
 * @param {UpdateOrder} data The data to update the order with.
 * @returns {Promise<FullOrder | null>} An updated FullOrder object or null if not found or an error occurs.
 */
export const updateOrder = async (id: string, data: UpdateOrder): Promise<FullOrder | null> => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(data.customerNotes && { customerNotes: data.customerNotes }),
        ...(data.status && { status: data.status }),
        ...(data.paymentType && { paymentType: data.paymentType }),
        ...(data.couponCode && { couponCode: data.couponCode }),
        ...(data.email && {
          email: data.email,
          user: {
            connect: {
              email: data.email,
            },
          },
        }),
        ...(data.phone && { phone: data.phone }),
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

/**
 * Creates a new order based on the provided data and order type.
 * @param {CreateOrder} body The data to create the order with.
 * @param {OrderType} type The type of order to create.
 * @returns {Promise<FullOrder | null>} A FullOrder object or null if an error occurs.
 */
export const createOrder = async (
  body: CreateOrder,
  type: OrderType
): Promise<FullOrder | null> => {
  const orderTotal = body.items
    .map((item) => {
      const ringMetadata = JSON.parse(
        JSON.stringify(item?.price_data?.product_data?.metadata)
      ) as RingFormAsMetadata;

      const teethMetadata = JSON.parse(
        JSON.stringify(item?.price_data?.product_data?.metadata)
      ) as GrillzFormAsMetadata;

      if (type === 'GRILLZ') {
        return getGrillzTotal(getGrillzFromMetadata(teethMetadata, body?.teethData ?? []));
      }
      if (type === 'RING') {
        return getRingTotal(getRingFromMetadata(ringMetadata, body?.ringData ?? []));
      }
      return 0;
    })
    .reduce((acc, curr) => acc + curr, 0);

  try {
    const order = await prisma.order.create({
      data: {
        email: body?.email ?? '',
        phone: body?.phone ?? '',
        customerNotes: body.customerNotes,
        paymentAmount: orderTotal,
        paymentType: body.paymentType,
        couponCode: body.couponCode,
        type: body.type,
        status: body.status,
        items: {
          create: body.items.map((item) => {
            const ringMetadata = JSON.parse(
              JSON.stringify(item?.price_data?.product_data?.metadata)
            ) as RingFormState;

            const teethMetadata = JSON.parse(
              JSON.stringify(item?.price_data?.product_data?.metadata)
            ) as GrillzForm;

            return type === 'GRILLZ'
              ? {
                  amount: getGrillzTotal(teethMetadata),
                  metadata: JSON.stringify(teethMetadata),
                }
              : // if 'RING'
                {
                  amount: getRingTotal(ringMetadata),
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

/** Handles requests to the /api/order endpoint. */
export const handleOrdersRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<OrdersResponse | OrderResponse>,
  orderType: OrderType
) => {
  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
  const isAdmin = sessionUser?.role === 'ADMIN';
  const method = req.method;
  const body = req.body as CreateOrder;
  try {
    switch (method) {
      case 'GET':
        if (!isAdmin) return await handleApiError(res, new Error('Unauthorised'), 403);
        const orders = await getOrders(orderType, req.query.status as OrderStatus);
        if (!orders) throw new Error('No orders found');
        res.status(200).json({ data: orders });
        return;
      case 'POST':
        const order = await createOrder(body, orderType);
        if (!order) throw new Error('Order not created');
        res.status(201).json({ data: order });
      default:
        res.end();
        return;
    }
  } catch (error) {
    await handleApiError(res, Error(`${error}`));
  }
};

/** Handles requests to the /api/orders/[id] endpoint. */
export const handleOrderRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<OrderResponse>
) => {
  const method = req.method;
  const body = req.body as UpdateOrder;
  try {
    switch (method) {
      case 'GET':
        const order = await prisma.order.findUnique({
          where: {
            id: `${req.query.id}`,
          },
          include: {
            items: true,
            user: true,
          },
        });
        res.status(200).json({ data: JSON.parse(JSON.stringify(order)) });
        return;
      case 'PATCH':
        const updatedOrder = await updateOrder(`${req.query.id}`, body);
        res.status(201).json({ data: JSON.parse(JSON.stringify(updatedOrder)) });
        return;
      case 'DELETE':
        await prisma.order.delete({
          where: { id: `${req.query.id}` },
        });
        res.status(204).end();
        return;
      default:
        res.end();
        return;
    }
  } catch (error) {
    await handleApiError(res, Error(`${error}`));
  }
};
