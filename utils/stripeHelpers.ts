import Stripe from 'stripe';
import { CURRENCY, TOOTH_SEPARATOR } from '../config/stripe';
import {
  FullGrillzMaterial,
  FullRing,
  GrillzForm,
  GrillzFormAsMetadata,
  RingFormAsMetadata,
  RingFormState,
  ToothID,
} from '../types';
import { getGrillzTotal, getRingTotal } from './getTotals';

export function formatAmountForDisplay(amount: number): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: CURRENCY,
    currencyDisplay: 'narrowSymbol',
  });
  return numberFormat.format(amount / 100);
}

export function formatAmountForStripe(amount: number): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: CURRENCY,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const convertRingToLineItem = (
  form: RingFormState
): Stripe.Checkout.SessionCreateParams.LineItem => {
  return {
    quantity: 1,
    price_data: {
      currency: CURRENCY,
      unit_amount: getRingTotal(form),
      product_data: {
        name: `Custom ${form?.selectedShape?.name} Ring`,
        metadata: convertRingToMetadata(form),
      },
    },
  };
};

export const convertRingToMetadata = (form: RingFormState): RingFormAsMetadata => {
  return {
    shapeID: form.selectedShape?.id ?? '',
    materialID: form.selectedMaterial?.id ?? '',
    engravingIDs: JSON.stringify({
      FRONT: form.selectedEngravings.FRONT?.id,
      SIDE1: form.selectedEngravings.SIDE1?.id,
      SIDE2: form.selectedEngravings.SIDE2?.id,
      INNER: form.selectedEngravings.INNER?.id,
    }),
  };
};

export const getRingFromMetadata = (
  parsedMetadata: RingFormAsMetadata,
  data: FullRing[]
): RingFormState => {
  const shape = data.find((shape) => shape.id === parsedMetadata.shapeID);

  const material = shape?.materials.find((material) => material.id === parsedMetadata.materialID);

  return {
    selectedShape: shape,
    selectedMaterial: material,
    selectedEngravings: JSON.parse(parsedMetadata.engravingIDs),
    selectedFace: 'FRONT',
  } as RingFormState;
};

export const convertGrillzToLineItem = (
  form: GrillzForm
): Stripe.Checkout.SessionCreateParams.LineItem => {
  return {
    quantity: 1,
    price_data: {
      currency: CURRENCY,
      unit_amount: getGrillzTotal(form),
      product_data: {
        name: `${form?.material?.name} ${form?.variant?.name} ${
          form?.option ? `${form.option?.name}` : ''
        } [${form?.selectedTeeth?.join(TOOTH_SEPARATOR)}]`,
        metadata: convertGrillzToMetadata(form),
      },
    },
  };
};

export const convertGrillzToMetadata = (form: GrillzForm): GrillzFormAsMetadata => {
  return {
    materialId: form.material?.id ?? '',
    variantId: form.variant?.id ?? '',
    optionId: form.material?.hasOptions && form.option ? form.option.id : '',
    selectedTeethIds: form?.selectedTeeth?.join(TOOTH_SEPARATOR) ?? '',
  };
};

export const getGrillzFromMetadata = (
  metadata: GrillzFormAsMetadata,
  data: FullGrillzMaterial[]
): GrillzForm => {
  const material = data.find((material) => material.id === metadata.materialId);
  const variant = material?.variants.find((variant) => variant.id === metadata.variantId);
  const option = material?.options.find((option) => option.id === metadata.optionId);
  const selectedTeeth = metadata?.selectedTeethIds?.split(TOOTH_SEPARATOR) as ToothID[];

  return JSON.parse(
    JSON.stringify({
      material,
      variant,
      option,
      selectedTeeth,
    })
  ) as GrillzForm;
};
