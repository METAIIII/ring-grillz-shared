import { Order, OrderType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { json } from 'shared/utils/json-parse';
import { getGrillzMaterials } from 'utils/tooth-utils';

import { authOptions } from '../config/auth';
import prisma from '../prisma';
import { CreateOrder, FullOrder, UpdateOrder } from '../types';
import { Filter, OrderResponse, OrdersResponse, Sort } from '../types/api-responses';
import { getGrillzTotal } from '../utils/get-totals';
import { getGrillzFromMetadata } from '../utils/stripe-helpers';
import { handleApiError } from './error';
import { getUser } from './user';

export interface GetOrdersResult {
  orders: Order[];
  pageCount: number;
  totalCount: number;
}

export const getOrders = async ({
  type,
  where,
  orderBy,
  take,
  skip,
}: {
  type: OrderType;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  take: number;
  skip: number;
}): Promise<GetOrdersResult> => {
  try {
    const orders = await prisma.order.findMany({
      where: { type, ...where },
      orderBy: orderBy || { createdAt: 'desc' },
      take,
      skip,
    });
    const totalOrdersCount = await prisma.order.count({
      where: { type, ...where },
    });
    if (!orders)
      return {
        orders: [],
        pageCount: 0,
        totalCount: 0,
      };
    return json({
      orders,
      pageCount: Math.ceil(totalOrdersCount / take),
      totalCount: totalOrdersCount,
    });
  } catch (error) {
    return { orders: [], pageCount: 0, totalCount: 0 };
  }
};

export const getOrder = async (id: string): Promise<FullOrder | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
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
  type: OrderType,
): Promise<FullOrder | null> => {
  const grillzData = await getGrillzMaterials();
  const orderTotal = body.items
    .map((item) => {
      if (!item?.price_data?.product_data?.metadata) return 0;
      if (type === 'GRILLZ') {
        const metadata = item.price_data.product_data.metadata;
        return getGrillzTotal(getGrillzFromMetadata(metadata, grillzData));
      }
      // if (type === 'RING') {
      //   const metadata = json<RingFormAsMetadata>(item.price_data.product_data.metadata);
      //   return getRingTotal(getRingFromMetadata(metadata, ringData));
      // }
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
            const grillzMetadata = item?.price_data?.product_data?.metadata!;

            if (type === 'GRILLZ') {
              return {
                amount: getGrillzTotal(getGrillzFromMetadata(grillzMetadata, grillzData)),
                metadata: grillzMetadata,
              };
            }

            // const ringMetadata =  item?.price_data?.product_data?.metadata!;
            // if (type === 'RING') {
            //   return {
            //     amount: getRingTotal(getRingFromMetadata(ringMetadata, body?.ringData ?? [])),
            //     metadata: ringMetadata,
            //   };
            // }

            return { amount: 0, metadata: '' };
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
  orderType: OrderType,
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

        const { pageIndex, pageSize, filter, sort } = req.query;

        const pageIndexNum = Number(pageIndex) || 0;
        const pageSizeNum = Number(pageSize) || 10;

        let filters: Filter[] = [];
        let sortBy: Sort[] = [];

        if (typeof filter === 'string') {
          filters = [JSON.parse(filter)];
        } else if (Array.isArray(filter)) {
          filters = filter.map((f) => JSON.parse(f));
        }

        if (typeof sort === 'string') {
          sortBy = [JSON.parse(sort)];
        } else if (Array.isArray(sort)) {
          sortBy = sort.map((s) => JSON.parse(s));
        }

        const where = filters.reduce<Record<string, any>>((acc, f) => {
          acc[f.key] = { [f.operation]: f.value };
          return acc;
        }, {});

        const orderBy = sortBy.reduce<Record<string, 'asc' | 'desc'>>((acc, s) => {
          acc[s.key] = s.order;
          return acc;
        }, {});

        const { orders, pageCount, totalCount } = await getOrders({
          type: orderType,
          where,
          orderBy,
          skip: pageIndexNum * pageSizeNum,
          take: pageSizeNum,
        });

        res.status(200).json({
          data: {
            orders,
            pageCount,
            totalCount,
          },
        });
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
  res: NextApiResponse<OrderResponse>,
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
