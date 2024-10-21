import Stripe from 'stripe';

import { CURRENCY, TOOTH_SEPARATOR } from '../config/stripe';
import { FullGrillzMaterial, GrillzForm, RingFormState, ToothID } from '../types';
import { getGrillzTotal, getRingTotal } from './get-totals';
import { getGrillzMaterials } from './grillz-utils';
import { json } from './json-parse';

export const STRIPE_API_VERSION = '2024-09-30.acacia';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';

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
  form: RingFormState,
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

export const convertRingToMetadata = (
  form: RingFormState,
): Record<string, string | number | null> => {
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

export const convertGrillzToLineItem = (
  form: GrillzForm,
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
        metadata: convertGrillzToMetadata(form, false),
      },
    },
  };
};

// Overload signatures
export function convertGrillzToMetadata(form: GrillzForm, stringify: true): string;
export function convertGrillzToMetadata(
  form: GrillzForm,
  stringify: false,
): Record<string, string | number | null>;

export function convertGrillzToMetadata(
  form: GrillzForm,
  stringify = true,
): Record<string, string | number | null> | string {
  const metadata = {
    materialId: form.material?.id ?? '',
    variantId: form.variant?.id ?? '',
    optionId: form.material?.hasOptions && form.option ? form.option.id : '',
    selectedTeethIds: form?.selectedTeeth?.join(TOOTH_SEPARATOR) ?? '',
  };

  if (!stringify) return metadata;

  return JSON.stringify(metadata);
}

export const getGrillzFromMetadata = (
  metadata: Record<string, string | number | boolean | null> | null,
  data: FullGrillzMaterial[],
): GrillzForm => {
  const material = data.find((material) => material.id === metadata?.materialId);
  const variant = material?.variants.find((variant) => variant.id === metadata?.variantId);
  const option = material?.options.find((option) => option.id === metadata?.optionId);
  const selectedTeeth = (metadata?.selectedTeethIds as string)?.split(TOOTH_SEPARATOR) as ToothID[];

  const formData: GrillzForm = {
    material: material ?? null,
    variant: variant ?? null,
    option: option ?? null,
    selectedTeeth,
    isAddToCartDisabled: false,
    isTopRowDisabled: false,
    isBottomRowDisabled: false,
    itemsTotal: 0,
    formDataAsMetadata: JSON.stringify(metadata),
  };

  return json(formData);
};

export async function createStripeCheckoutSession(order: any) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: STRIPE_API_VERSION });

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let couponId;

  if (order.couponCode) {
    const promotionCodes = await stripe.promotionCodes.list({
      code: order.couponCode,
      limit: 1,
    });
    if (promotionCodes.data.length) {
      couponId = promotionCodes.data[0].coupon.id;
    }
  }

  const materials = await getGrillzMaterials();

  // TODO: Handle ring orders
  // Assuming the order type is GRILLZ for now
  lineItems = order.items.map((item: any) => {
    const metadata = item.metadata as Record<string, string | number | boolean>;
    return convertGrillzToLineItem(getGrillzFromMetadata(metadata, materials));
  });

  const params: Stripe.Checkout.SessionCreateParams = {
    customer_email: order.email,
    client_reference_id: order.id,
    expand: ['customer_details', 'line_items'],
    shipping_address_collection: { allowed_countries: ['AU'] },
    mode: 'payment',
    payment_method_types: ['card', 'afterpay_clearpay'],
    discounts: couponId ? [{ coupon: couponId }] : undefined,
    line_items: lineItems,
    custom_text: {
      shipping_address: {
        message: `Express postage is included with every order.`,
      },
      submit: {
        message: `We'll email you instructions on how to get started.`,
      },
    },
    customer_creation: 'always',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/receipt?order_id=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/receipt?order_id=${order.id}`,
    consent_collection: {
      terms_of_service: 'required',
    },
  };

  return stripe.checkout.sessions.create(params);
}
