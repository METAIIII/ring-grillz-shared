import { RingEngraving, RingMaterial, RingShape, RingShapeVariant } from '@prisma/client';

import { RingFormState, TeethForm } from '../types';

// Dr Grillz Specific
export const getTeethLabourCost = (data: TeethForm): number => {
  const labourCost = data.material?.labourCost || 0;
  return labourCost;
};

export const getToothValue = (data: TeethForm): number => {
  let variantValue = 0;
  let optionValue = 0;

  if (data.variant) {
    variantValue = data.variant.price;
  }
  if (data.option) {
    optionValue = data.option.price;
  }

  return variantValue + optionValue;
};

export const getTeethTotal = (
  data: TeethForm,
  options: { expressShipping: boolean }
): number => {
  if (!data.material || !data.selectedTeeth) return 0;

  let postage = 0;

  if (options.expressShipping) {
    // Add $20 for express shipping option
    postage = 2000;
  }

  const toothValue = getToothValue(data);
  const numOfTeeth = data.selectedTeeth.length;
  const labourCost = getTeethLabourCost(data);

  return toothValue * numOfTeeth + labourCost + postage;
};

// Ring Kingz Specific
export const getRingShapeTotal = (shape?: RingShape): number => {
  if (!shape) return 0;
  return 0;
};
export const getRingVariantTotal = (variant?: RingShapeVariant): number => {
  if (!variant) return 0;
  return variant.price;
};
export const getRingMaterialTotal = (material?: RingMaterial): number => {
  if (!material) return 0;
  return material.price;
};
export const getRingEngravingTotal = (engraving?: RingEngraving): number => {
  if (!engraving) return 0;
  // Fixed cost at $100
  return 10000;
};

export const getRingTotal = (
  form: RingFormState,
  options: { expressShipping: boolean }
) => {
  let postage = 0;
  if (options.expressShipping) {
    // Add $20 for express shipping option
    postage = 2000;
  }

  const shapeTotal = getRingShapeTotal(form?.selectedShape);
  const variantTotal = getRingVariantTotal(form?.selectedVariant);
  const materialTotal = getRingMaterialTotal(form?.selectedMaterial);
  const engravingTotal = getRingEngravingTotal(form?.selectedEngraving);
  return shapeTotal + variantTotal + materialTotal + engravingTotal + postage;
};
