import teeth from '../data/teeth';
import prisma from '../prisma';
import { FullGrillzMaterial, ToothID } from '../types';

/**
 * Gets full tooth from Tooth ID
 * @param id Tooth ID
 * @returns Full tooth
 */
const getFullTooth = (id: ToothID) => {
  const tooth = teeth.find((t) => t.id === id);
  return tooth;
};

/**
 * Get the grillz materials data from the server
 */
export async function getGrillzMaterials(): Promise<FullGrillzMaterial[]> {
  const materials = await prisma.grillzMaterial.findMany({
    include: {
      options: { orderBy: { price: 'asc' } },
      variants: { orderBy: { price: 'asc' } },
    },
  });
  return materials ?? [];
}

export default getFullTooth;
