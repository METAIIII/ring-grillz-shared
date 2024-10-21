import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

export interface MockContext {
  prisma: DeepMockProxy<PrismaClient>;
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};
