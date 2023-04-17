import { RingEngraving, User } from '@prisma/client';

import prisma from '../prisma';
import { FullGrillzMaterial, FullOrder, FullRing } from '../types';
import { BackupData, PresetData } from '../types/apiResponses';

// SHARED

// Fetch all users
export const getAllUsers = async (): Promise<User[] | null> => {
  try {
    const users = await prisma.user.findMany();
    if (!users) return null;
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return null;
  }
};

// Fetch all orders
export const getAllOrders = async (): Promise<FullOrder[] | null> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
    });
    if (!orders) return null;

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    return null;
  }
};

// DR GRILLZ

// Fetch all GrillzMaterials
export const getAllGrillzMaterials = async (): Promise<FullGrillzMaterial[] | null> => {
  try {
    const grillzMaterials = await prisma.grillzMaterial.findMany({
      include: {
        options: true,
        variants: true,
      },
    });
    if (!grillzMaterials) return null;
    return JSON.parse(JSON.stringify(grillzMaterials));
  } catch (error) {
    return null;
  }
};

// RING KINGZ

// Fetch all engravings
export const getAllRingEngravings = async (): Promise<RingEngraving[] | null> => {
  try {
    const ringEngravings = await prisma.ringEngraving.findMany();
    if (!ringEngravings) return null;
    return JSON.parse(JSON.stringify(ringEngravings));
  } catch (error) {
    return null;
  }
};
// Fetch all rings
export const getAllRings = async (): Promise<FullRing[] | null> => {
  try {
    const ringShapes = await prisma.ringShape.findMany({
      include: {
        materials: true,
        examples: true,
      },
    });
    if (!ringShapes) return null;
    return JSON.parse(JSON.stringify(ringShapes));
  } catch (error) {
    return null;
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
    return JSON.parse(JSON.stringify({ simple, signet }));
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
      getAllGrillzMaterials(),
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
