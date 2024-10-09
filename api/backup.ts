import { RingEngraving, User } from '@prisma/client';

import prisma from '../prisma';
import { FullOrder, FullRing } from '../types';
import { BackupData, PresetData } from '../types/api-responses';
import { getGrillzMaterials } from '../utils/grillz-utils';
import { json } from '../utils/json-parse';

// Fetch all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    if (!users) return [];
    return json(users);
  } catch (error) {
    return [];
  }
};

// Fetch all orders
export const getAllOrders = async (): Promise<FullOrder[]> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
    });
    if (!orders) return [];

    return json(orders);
  } catch (error) {
    return [];
  }
};

// Fetch all engravings
export const getAllRingEngravings = async (): Promise<RingEngraving[]> => {
  try {
    const ringEngravings = await prisma.ringEngraving.findMany();
    if (!ringEngravings) return [];
    return json(ringEngravings);
  } catch (error) {
    return [];
  }
};
// Fetch all rings
export const getAllRings = async (): Promise<FullRing[]> => {
  try {
    const ringShapes = await prisma.ringShape.findMany({
      include: {
        materials: true,
        examples: true,
      },
    });
    if (!ringShapes) return [];
    return json(ringShapes);
  } catch (error) {
    return [];
  }
};

export const getAllRingEngravingPresets = async (): Promise<PresetData | null> => {
  try {
    const simple = await prisma.ringEngravingPreset.findMany({
      where: {
        shapes: {
          some: {
            name: 'Simple',
          },
        },
      },
    });
    const signet = await prisma.ringEngravingPreset.findMany({
      where: {
        shapes: {
          none: {
            name: 'Simple',
          },
        },
      },
    });
    if (!simple || !signet) return null;
    return json({ simple, signet });
  } catch (error) {
    return null;
  }
};

// Return all data
export const getAllData = async (): Promise<BackupData | null> => {
  try {
    const data = await Promise.all([
      getAllUsers(),
      getAllOrders(),
      getGrillzMaterials(),
      getAllRings(),
      getAllRingEngravings(),
      getAllRingEngravingPresets(),
    ]);
    if (!data) return null;
    return {
      users: data[0] ?? [],
      orders: data[1] ?? [],
      grillzMaterials: data[2] ?? [],
      ringShapes: data[3] ?? [],
      ringEngravings: data[4] ?? [],
      ringEngravingPresets: data[5] ?? {
        simple: [],
        signet: [],
      },
    };
  } catch (error) {
    return null;
  }
};
