import { OrderType } from '@prisma/client';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { UpdateUser } from '../components/Account/UserInfo';
import { authOptions } from '../config/auth';
import prisma from '../prisma';
import { FullUser } from '../types';
import { UserResponse, UsersResponse } from '../types/apiResponses';
import { handleApiError } from './error';

/**
 * Fetches a user with the provided email and order type.
 * @param {string} email The email of the user to fetch.
 * @param {OrderType} orderType The order type to filter orders.
 * @returns {Promise<FullUser | null>} The fetched user, or null if not found or an error occurs.
 */
export async function getUser(email: string, orderType: OrderType): Promise<FullUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: { where: { type: orderType }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) return null;
    return JSON.parse(JSON.stringify(user)) as FullUser;
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
  orderType: OrderType
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
 * @param {string} email The email of the user to update.
 * @param {UpdateUser} data The data to update the user with.
 * @param {OrderType} orderType The order type to filter orders.
 * @returns {Promise<FullUser | null>} The updated user, or null if not found or an error occurs.
 */
export const updateUser = async (
  email: string,
  data: UpdateUser,
  orderType: OrderType
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

    return JSON.parse(JSON.stringify(updatedUser)) as FullUser;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes a user with the provided email.
 * @param {string} email The email of the user to delete.
 * @returns {Promise<void | null>} A promise that resolves when the user is deleted, or null if an error occurs.
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
  orderType: OrderType
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
    const users = await prisma.user.findMany({ orderBy: { email: 'asc' } });
    res.status(200).json({ data: users });
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
  orderType: OrderType
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
