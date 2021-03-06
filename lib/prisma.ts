import { PrismaClient } from '@prisma/client';

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
