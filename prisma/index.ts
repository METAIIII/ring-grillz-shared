import { PrismaClient } from '@prisma/client';

declare global {
  namespace PrismaJson {
    interface GrillzFormAsMetadata {
      materialId: string;
      variantId: string;
      optionId: string;
      selectedTeethIds: string;
    }
    interface RingFormAsMetadata {
      shapeID: string;
      materialID: string;
      engravingIDs: string;
    }
  }
}

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
  if (!newGlobalThis[prismaClientPropertyName]) {
    newGlobalThis[prismaClientPropertyName] = new PrismaClient();
  }
  prisma = newGlobalThis[prismaClientPropertyName];
}

export default prisma;
