import { RingMaterial, RingShape } from '@prisma/client';

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
  return shape.price;
};
export const getRingMaterialTotal = (material?: RingMaterial): number => {
  if (!material) return 0;
  return material.price;
};
export const getRingEngravingTotal = (
  engravings?: RingFormState['selectedEngravings']
): number => {
  if (!engravings) return 0;
  let total = 0;

  // Loop through each engraving and add the price
  Object.values(engravings).forEach(() => {
    total += 10000;
  });

  return total;
};

export const RING_LABOUR_COST = 40000;

export const getRingTotal = (
  form: RingFormState,
  options: { expressShipping: boolean }
) => {
  let postage = 0;
  if (options.expressShipping) {
    // Add $20 for express shipping option
    postage = 2000;
  }

  const shapeTotal = form?.selectedShape
    ? getRingShapeTotal(form.selectedShape)
    : 0;
  const materialTotal = form?.selectedMaterial
    ? getRingMaterialTotal(form.selectedMaterial)
    : 0;
  const engravingTotal = getRingEngravingTotal(form?.selectedEngravings);
  return (
    shapeTotal + materialTotal + engravingTotal + postage + RING_LABOUR_COST
  );
};
