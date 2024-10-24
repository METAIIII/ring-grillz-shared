import { RingMaterial, RingShape } from '@prisma/client';

import { GrillzForm, RingFormState } from '../types';
import { formatAmountForDisplay } from './stripe-helpers';

export function formatCouponDiscount(amount_off?: number | null, percent_off?: number | null) {
  if (amount_off) {
    return `- ${formatAmountForDisplay(amount_off)}`;
  }
  if (percent_off) {
    return `- ${percent_off}%`;
  }
  return '';
}

// Dr Grillz Specific
export const getGrillzLabourCost = (data: GrillzForm): number => {
  const labourCost = data.material?.labourCost || 0;
  return labourCost;
};

export const getToothValue = (data: GrillzForm): number => {
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

export const getGrillzTotal = (data: GrillzForm): number => {
  if (!data.material || !data.selectedTeeth || data.selectedTeeth.length === 0) return 0;

  const toothValue = getToothValue(data);
  const numOfTeeth = data.selectedTeeth.length;
  const labourCost = getGrillzLabourCost(data);

  return toothValue * numOfTeeth + labourCost;
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
export const getRingEngravingTotal = (engravings?: RingFormState['selectedEngravings']): number => {
  if (!engravings) return 0;
  let total = 0;

  // Loop through each engraving and add the price
  Object.values(engravings).forEach(() => {
    total += 10000;
  });

  return total;
};

export const RING_LABOUR_COST = 30000;

export const getRingTotal = (form: RingFormState) => {
  const labourCost = 30000;
  const shapeTotal = form?.selectedShape ? getRingShapeTotal(form.selectedShape) : 0;
  const materialTotal = form?.selectedMaterial ? getRingMaterialTotal(form.selectedMaterial) : 0;
  const engravingTotal = getRingEngravingTotal(form?.selectedEngravings);
  return shapeTotal + materialTotal + engravingTotal + labourCost;
};
