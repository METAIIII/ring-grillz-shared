import { OrderType } from '@prisma/client';

import prisma from '../../lib/prisma';
import { FullUser } from '../../types';

const getUser = async (
  email: string,
  orderType: OrderType
): Promise<FullUser | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      orders: { where: { type: orderType }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (user) {
    return JSON.parse(JSON.stringify(user));
  } else {
    return null;
  }
};

export default getUser;
