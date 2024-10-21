import { getAllData } from '../../api/backup';
import prisma from '../../prisma';

// Mock the Prisma client
jest.mock('@shared/prisma', () => ({
  user: {
    findMany: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
  },
  grillzMaterial: {
    findMany: jest.fn(),
  },
  ringShape: {
    findMany: jest.fn(),
  },
  ringEngraving: {
    findMany: jest.fn(),
  },
  ringEngravingPreset: {
    findMany: jest.fn(),
  },
}));

describe('getAllData', () => {
  it('should return all data when successful', async () => {
    // Mock the return values for each Prisma query
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: '1', name: 'Test User' }]);
    (prisma.order.findMany as jest.Mock).mockResolvedValue([{ id: '1', status: 'PENDING' }]);
    (prisma.grillzMaterial.findMany as jest.Mock).mockResolvedValue([{ id: '1', name: 'Gold' }]);
    (prisma.ringShape.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ringEngraving.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ringEngravingPreset.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getAllData();

    expect(result).toEqual({
      users: [{ id: '1', name: 'Test User' }],
      orders: [{ id: '1', status: 'PENDING' }],
      grillzMaterials: [{ id: '1', name: 'Gold' }],
      ringShapes: [],
      ringEngravings: [],
      ringEngravingPresets: {
        simple: [],
        signet: [],
      },
    });
  });

  it('should return null when an error occurs', async () => {
    // Mock an error for one of the Prisma queries
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Reset other mocks to return empty arrays
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.grillzMaterial.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ringShape.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ringEngraving.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ringEngravingPreset.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getAllData();

    expect(result).toEqual({
      users: [],
      orders: [],
      grillzMaterials: [],
      ringShapes: [],
      ringEngravings: [],
      ringEngravingPresets: {
        simple: [],
        signet: [],
      },
    });
  });
});
