import {
  LineItem,
  Order,
  OrderPaymentType,
  OrderStatus,
  OrderType,
  RingEngraving,
  RingEngravingType,
  RingMaterial,
  RingShape,
  RingShapeVariant,
  TeethMaterial,
  TeethMaterialOption,
  TeethMaterialVariant,
  User,
} from '@prisma/client';
import { IconType } from 'react-icons/lib';
import Stripe from 'stripe';

// Shared Database Models
export interface FullUser extends User {
  orders: Order[];
}
export interface FullOrder extends Order {
  items: LineItem[];
  user?: User;
}

// Shared Database Queries / Mutations
export interface CreateOrder {
  email?: string;
  customerNotes?: string;
  status: OrderStatus;
  type: OrderType;
  paymentType?: OrderPaymentType;
  items: Stripe.Checkout.SessionCreateParams.LineItem[];
  expressShipping?: boolean;
  data?: FullTeethMaterial[];
}

// Dr Grillz Specific
export type ToothID =
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45';

export interface Tooth {
  id: ToothID;
  name: string;
  row: 'top' | 'bottom';
  svgPathD: string;
  openFacePathD: string;
  disabled?: boolean;
}
export type Teeth = Tooth[];
export type TeethForm = {
  material?: TeethMaterial;
  variant?: TeethMaterialVariant;
  option?: TeethMaterialOption;
  selectedTeeth: ToothID[];
};
export type FormValuesAsMetadata = {
  materialId: string;
  variantId: string;
  optionId: string;
  selectedTeethIds: string;
  expressShipping: string;
};

export type FullTeethMaterial = TeethMaterial & {
  options: TeethMaterialOption[];
  variants: TeethMaterialVariant[];
};

// Ring Kingz Specific
export interface FormState {
  selectedShape?: RingShape;
  selectedVariant?: RingShapeVariant;
  selectedMaterial?: RingMaterial;
  selectedEngraving?: RingEngraving;
  size?: number;
}
export type CreatorStep = {
  index: number;
  label: string;
  icon: IconType;
};
export type RingFormFields =
  | 'selectedShape'
  | 'selectedVariant'
  | 'selectedMaterial'
  | 'selectedEngraving'
  | 'size';
export type RingFormValues =
  | RingShape
  | RingShapeVariant
  | RingMaterial
  | RingEngraving
  | number;

export interface RingModelProps extends JSX.IntrinsicAttributes {
  material?: RingMaterial;
  displacement?: string;
}
export interface FullVariant extends RingShapeVariant {
  materials: RingMaterial[];
}
export interface FullRing extends RingShape {
  variants: FullVariant[];
}
export interface UpdateRing {
  name: string;
  order: number;
  previewImage: string;
}
export interface CreateEngraving {
  type: RingEngravingType;
  imageUrl: string | null;
  canvasData: string | null;
  text: string | null;
  fontFamily: string | null;
}
