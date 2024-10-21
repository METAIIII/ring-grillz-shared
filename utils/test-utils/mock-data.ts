import { faker } from '@faker-js/faker';
import { OrderPaymentType, OrderStatus, OrderType, StateEnum } from '@prisma/client';
import { FaUser } from 'react-icons/fa'; // Example icon
import { IconType } from 'react-icons/lib';
import Stripe from 'stripe';

import { CartItem } from '../../reducers/cart';
import {
  CheckoutOptions,
  CreateOrder,
  CreateUser,
  CreatorStep,
  GrillzForm,
  ToothID,
  UpdateOrder,
} from '../../types';
import { formatAmountForStripe } from '../stripe-helpers';

export function mockCreateUser(): CreateUser {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    street: faker.location.streetAddress(),
    street2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
    suburb: faker.location.city(),
    state: faker.helpers.arrayElement(Object.values(StateEnum)),
    postcode: faker.location.zipCode(),
    image: faker.image.avatar(),
  };
}

export function mockCreateOrder(): CreateOrder {
  return {
    customerNotes: faker.helpers.maybe(() => faker.lorem.sentence()),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    items: [{ price: faker.string.uuid(), quantity: faker.number.int({ min: 1, max: 5 }) }],
    paymentAmount: faker.number.int({ min: 1000, max: 100000 }),
    paymentType: faker.helpers.arrayElement(Object.values(OrderPaymentType)),
    couponCode: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    status: faker.helpers.arrayElement(Object.values(OrderStatus)),
    type: faker.helpers.arrayElement(Object.values(OrderType)),
  };
}

export function mockUpdateOrder(): UpdateOrder {
  return {
    email: faker.helpers.maybe(() => faker.internet.email()),
    phone: faker.helpers.maybe(() => faker.phone.number()),
    customerNotes: faker.helpers.maybe(() => faker.lorem.sentence()),
    status: faker.helpers.maybe(() => faker.helpers.arrayElement(Object.values(OrderStatus))),
    paymentType: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Object.values(OrderPaymentType)),
    ),
    couponCode: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    stripeId: faker.helpers.maybe(() => `pi_${faker.string.alphanumeric(24)}`),
  };
}

export function mockCheckoutOptions(): CheckoutOptions {
  return {
    tcAgreed: faker.datatype.boolean(),
    expressShipping: faker.datatype.boolean(),
    paymentType: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Object.values(OrderPaymentType)),
    ),
    couponCode: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
  };
}

export const MOCK_LABOUR_COST = 30000;
export const MOCK_VARIANT_PRICE = 80000;
export const MOCK_OPTION_PRICE = 50000;

export function mockGrillzMaterial(hasOptions = false): GrillzForm['material'] {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productMaterial(),
    hasOptions,
    labourCost: MOCK_LABOUR_COST,
    optionsHeading: faker.helpers.maybe(() => faker.lorem.words(2)) ?? null,
  };
}

export function mockGrillzVariant(isSingleRowOnly = false): GrillzForm['variant'] {
  return {
    name: faker.commerce.productName(),
    id: faker.string.uuid(),
    price: MOCK_VARIANT_PRICE,
    previewImage: faker.image.url(),
    singleRowOnly: isSingleRowOnly,
    bgImage: faker.helpers.maybe(() => faker.image.url()) ?? null,
    baseMaterialId: faker.string.uuid(),
  };
}

export function mockGrillzOption(): GrillzForm['option'] {
  return {
    name: faker.commerce.productName(),
    id: faker.string.uuid(),
    price: MOCK_OPTION_PRICE,
    previewImage: faker.image.url(),
    baseMaterialId: faker.string.uuid(),
  };
}

export function mockGrillzForm(): GrillzForm {
  return {
    material: mockGrillzMaterial(),
    variant: mockGrillzVariant(),
    option: mockGrillzOption(),
    selectedTeeth: faker.helpers.arrayElements(
      [
        '11',
        '12',
        '13',
        '14',
        '15',
        '21',
        '22',
        '23',
        '24',
        '25',
        '31',
        '32',
        '33',
        '34',
        '35',
        '41',
        '42',
        '43',
        '44',
        '45',
      ] as ToothID[],
      { min: 1, max: 10 },
    ),
    isAddToCartDisabled: false,
    isTopRowDisabled: false,
    isBottomRowDisabled: false,
    itemsTotal: faker.number.int({ min: 1, max: 10 }),
    formDataAsMetadata: '',
  };
}

export function mockCreatorStep(): CreatorStep {
  return {
    index: faker.number.int({ min: 0, max: 5 }),
    label: faker.lorem.word(),
    icon: FaUser as IconType,
  };
}

export const MOCK_CART_ITEM_AMOUNT = 1000;
export function getMockCartTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.amount, 0);
}

export function mockCartItem(): CartItem {
  return {
    id: faker.string.uuid(),
    amount: MOCK_CART_ITEM_AMOUNT,
    metadata: '{"materialId":"1","variantId":"1","selectedTeethIds":"11,21"}',
  };
}

export function mockPrice(): Stripe.Price {
  return {
    id: 'price_123',
    object: 'price',
    active: true,
    billing_scheme: 'per_unit',
    created: NOW_SECONDS,
    currency: 'usd',
    custom_unit_amount: null,
    livemode: true,
    lookup_key: null,
    metadata: {},
    nickname: null,
    product: faker.string.uuid(),
    recurring: null,
    tax_behavior: null,
    tiers: [],
    tiers_mode: null,
    transform_quantity: null,
    type: 'one_time',
    unit_amount: formatAmountForStripe(MOCK_CART_ITEM_AMOUNT),
    unit_amount_decimal: formatAmountForStripe(MOCK_CART_ITEM_AMOUNT).toFixed(2),
  };
}

export function mockLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    price: mockPrice().id,
    quantity: 1,
  };
}

export const MOCK_COUPON_CODE = 'DISCOUNT2';
export const MOCK_COUPON_AMOUNT_OFF = 200;
const NOW_SECONDS = Math.floor(Date.now() / 1000);

export function mockCoupon(): Stripe.Coupon {
  return {
    id: 'coupon_123',
    object: 'coupon',
    amount_off: MOCK_COUPON_AMOUNT_OFF,
    percent_off: null,
    created: NOW_SECONDS,
    currency: 'usd',
    duration: 'once',
    livemode: false,
    max_redemptions: null,
    metadata: {},
    name: 'Test Coupon',
    times_redeemed: 0,
    valid: true,
    duration_in_months: null,
    redeem_by: null,
  };
}

export function mockPromotion(): Stripe.PromotionCode {
  return {
    id: 'promotion_123',
    object: 'promotion_code',
    active: true,
    code: MOCK_COUPON_CODE,
    coupon: mockCoupon(),
    created: NOW_SECONDS,
    customer: null,
    expires_at: null,
    livemode: false,
    max_redemptions: null,
    metadata: null,
    restrictions: {
      currency_options: {},
      first_time_transaction: false,
      minimum_amount: null,
      minimum_amount_currency: null,
    },
    times_redeemed: 0,
  };
}
