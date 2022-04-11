import { OrderType } from '@prisma/client';

import prisma from '../../lib/prisma';
import { FullUser, UpdateUser } from '../../types';

export const getUser = async (email: string, orderType: OrderType): Promise<FullUser | null> => {
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
};

export const updateUser = async (email: string, data: UpdateUser, orderType: OrderType) => {
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
