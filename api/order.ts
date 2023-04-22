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
import { OrderResponse, OrdersResponse } from '../types/api-responses';
import { getGrillzTotal, getRingTotal } from '../utils/get-totals';
import { getGrillzFromMetadata, getRingFromMetadata } from '../utils/stripe-helpers';
import { handleApiError } from './error';
import { getUser } from './user';
import { json } from 'shared/utils/json-parse';

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
    return json(orders);
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
    return json(order);
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
    return json(updatedOrder);
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
      if (type === 'GRILLZ') {
        const metadata = json<GrillzFormAsMetadata>(
          item?.price_data?.product_data?.metadata as GrillzFormAsMetadata
        );
        return getGrillzTotal(getGrillzFromMetadata(metadata, body?.grillzData ?? []));
      }
      if (type === 'RING') {
        const metadata = json<RingFormAsMetadata>(
          item?.price_data?.product_data?.metadata as RingFormAsMetadata
        );
        return getRingTotal(getRingFromMetadata(metadata, body?.ringData ?? []));
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
            const ringMetadata = json<RingFormAsMetadata>(
              item?.price_data?.product_data?.metadata as RingFormAsMetadata
            );

            const grillzMetadata = json<GrillzFormAsMetadata>(
              item?.price_data?.product_data?.metadata as GrillzFormAsMetadata
            );

            return type === 'GRILLZ'
              ? {
                  amount: getGrillzTotal(
                    getGrillzFromMetadata(grillzMetadata, body?.grillzData ?? [])
                  ),
                  metadata: JSON.stringify(grillzMetadata),
                }
              : // if 'RING'
                {
                  amount: getRingTotal(getRingFromMetadata(ringMetadata, body?.ringData ?? [])),
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
    return json(order);
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
        if (!order) {
          res.status(404).json({ error: 'Order not found.' });
          return;
        }
        res.status(200).json({ data: json(order) });
        return;
      case 'PATCH':
        const updatedOrder = await updateOrder(`${req.query.id}`, body);
        if (!updatedOrder) {
          res.status(404).json({ error: 'Order not found.' });
          return;
        }
        res.status(201).json({ data: json(updatedOrder) });
        return;
      case 'DELETE':
        await prisma.order.delete({
          where: { id: `${req.query.id}` },
        });
        res.status(204).end();
        return;
      default:
        return;
    }
  } catch (error) {
    await handleApiError(res, Error(`${error}`));
  }
};
