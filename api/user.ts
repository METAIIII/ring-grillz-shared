import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { OrderType, User } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { UpdateUser } from '../components/Account/UserInfo';
import { authOptions } from '../config/auth';
import prisma from '../prisma';
import { FullUser } from '../types';
import { Filter, Sort, UserResponse, UsersResponse } from '../types/api-responses';
import { json } from '../utils/json-parse';
import { handleApiError } from './error';

export interface GetUsersResult {
  users: User[];
  pageCount: number;
  totalCount: number;
}

export const getUsers = async ({
  where,
  orderBy,
  take,
  skip,
}: {
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  take: number;
  skip: number;
}): Promise<GetUsersResult> => {
  try {
    const users = await prisma.user.findMany({
      where,
      orderBy,
      take,
      skip,
    });
    const totalUsersCount = await prisma.user.count({ where });
    if (!users)
      return {
        users: [],
        pageCount: 0,
        totalCount: 0,
      };
    return json({
      users,
      pageCount: Math.ceil(totalUsersCount / take),
      totalCount: totalUsersCount,
    });
  } catch (error) {
    return { users: [], pageCount: 0, totalCount: 0 };
  }
};

export async function getUser(email: string, orderType: OrderType): Promise<FullUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: { where: { type: orderType }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) return null;
    return json(user);
  } catch (error) {
    return null;
  }
}

/**
 * Checks if user is admin
 */
export async function checkUser(
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res'],
  orderType: OrderType,
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
    const isAdmin = sessionUser?.role === 'ADMIN';
    return {
      isAdmin,
      user: sessionUser,
    };
  } catch (error) {
    return {
      isAdmin: false,
      user: null,
    };
  }
}

/**
 * Updates a user with the provided email and data, and returns the updated user.
 * @param email The email of the user to update.
 * @param data The data to update the user with.
 * @param orderType The order type to filter orders.
 * @returns The updated user, or null if not found or an error occurs.
 */
export const updateUser = async (
  email: string,
  data: UpdateUser,
  orderType: OrderType,
): Promise<FullUser | null> => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data,
      include: {
        orders: { where: { type: orderType }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!updatedUser) return null;

    return json(updatedUser);
  } catch (error) {
    return null;
  }
};

/**
 * Deletes a user with the provided email.
 * @param email The email of the user to delete.
 * @returns A promise that resolves when the user is deleted, or null if an error occurs.
 */
export const deleteUser = async (email: string) => {
  try {
    await prisma.user.delete({
      where: {
        email,
      },
    });
  } catch (error) {
    return null;
  }
};

/**
 * Handles requests to the /api/user endpoint.
 */
export const handleUsersRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>,
  orderType: OrderType,
) => {
  const method = req.method;
  if (method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
  try {
    const session = await getServerSession(req, res, authOptions);
    const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
    const isAdmin = sessionUser?.role === 'ADMIN';
    if (!isAdmin) {
      return await handleApiError(res, new Error('Unauthorised'), 403);
    }

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

    const { users, pageCount, totalCount } = await getUsers({
      where,
      orderBy,
      skip: pageIndexNum * pageSizeNum,
      take: pageSizeNum,
    });

    res.status(200).json({ data: { users, pageCount, totalCount } });
  } catch (error) {
    await handleApiError(res, Error(`${error}`));
  }
};

/**
 * Handles requests to the /api/user/[email] endpoint.
 */
export const handleUserRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>,
  orderType: OrderType,
) => {
  const method = req.method;
  const body = req.body as UpdateUser;
  try {
    const session = await getServerSession(req, res, authOptions);
    const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
    const isAdmin = sessionUser?.role === 'ADMIN';

    const user = await getUser(`${req.query.email}`, orderType);
    const userEmail = user?.email;
    const isLoggedIn = session?.user?.email === user?.email;
    const isReceiptPage = req.headers.referer?.includes('receipt');

    if (!userEmail) {
      res.status(404).json({
        error: 'User not found',
      });
      return;
    }

    switch (method) {
      case 'GET':
        res.status(200).json({ data: user });
        return;
      case 'PATCH':
        if (!isAdmin && !isLoggedIn && !isReceiptPage)
          return await handleApiError(res, new Error('Unauthorised'), 403);
        const updatedUser = await updateUser(userEmail, body, orderType);
        if (!updatedUser) await handleApiError(res, new Error('Failed to update user'), 404);
        res.status(201).json({ data: updatedUser ?? undefined });
        return;
      case 'DELETE':
        if (!isAdmin && !isLoggedIn)
          return await handleApiError(res, new Error('Unauthorised'), 403);
        await deleteUser(userEmail);
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
