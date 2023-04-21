import {
  GrillzMaterial,
  GrillzMaterialOption,
  GrillzMaterialVariant,
  LineItem,
  Order,
  OrderPaymentType,
  OrderStatus,
  OrderType,
  RingEngraving,
  RingEngravingType,
  RingFace,
  RingMaterial,
  RingShape,
  RingShapeExample,
  StateEnum,
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
export interface CreateUser {
  email: string;
  name: string;
  phone?: string;
  street?: string;
  street2?: string;
  suburb?: string;
  state?: StateEnum;
  postcode?: string;
  image?: string;
}

export interface CreateOrder {
  customerNotes?: string;
  email?: string;
  phone?: string;
  items: Stripe.Checkout.SessionCreateParams.LineItem[];
  paymentAmount?: number;
  paymentType?: OrderPaymentType;
  couponCode?: string;
  ringData?: FullRing[];
  teethData?: FullGrillzMaterial[];
  status: OrderStatus;
  type: OrderType;
}
export interface UpdateOrder {
  email?: string;
  phone?: string;
  customerNotes?: string;
  status?: OrderStatus;
  paymentType?: OrderPaymentType;
  couponCode?: string;
  stripeId?: string;
}

export interface CheckoutOptions {
  tcAgreed?: boolean;
  expressShipping?: boolean;
  paymentType?: OrderPaymentType;
  couponCode?: string;
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
export type GrillzForm = {
  material?: GrillzMaterial;
  variant?: GrillzMaterialVariant;
  option?: GrillzMaterialOption;
  selectedTeeth: ToothID[];
};
export type GrillzFormAsMetadata = {
  materialId: string;
  variantId: string;
  optionId: string;
  selectedTeethIds: string;
};

export type FullGrillzMaterial = GrillzMaterial & {
  options: GrillzMaterialOption[];
  variants: GrillzMaterialVariant[];
};

// Ring Kingz Specific
export interface RingFormState {
  selectedShape: RingShape | null;
  selectedMaterial: RingMaterial | null;
  selectedFace: RingFace;
  selectedEngravings: Record<RingFace, RingEngraving | null>;
  size: {
    value: string;
    format: string;
  };
}
export type RingFormAsMetadata = {
  shapeID: string;
  materialID: string;
  engravingIDs: string;
  size: string;
  sizeFormat: string;
};
export type CreatorStep = {
  index: number;
  label: string;
  icon: IconType;
};

export type RingFormValues =
  | RingShape
  | RingMaterial
  | Partial<Record<RingFace, RingEngraving>>
  | RingFace;

export interface RingModelProps extends JSX.IntrinsicAttributes {
  material?: RingMaterial;
  displacement?: string;
}
export interface FullRing extends RingShape {
  materials: RingMaterial[];
  examples: RingShapeExample[];
}
export interface UpdateRing {
  name: string;
  order: number;
  previewImage: string;
  modelUrl: string;
  price: number;
}
export interface UpdateRingMaterial {
  name: string;
  ambientOcclusion: string | null;
  baseColor: string | null;
  metallic: string | null;
  roughness: string | null;
  normal: string | null;
  emissive: string | null;
  previewImage: string | null;
  price: number;
}
export interface CreateEngraving {
  type: RingEngravingType;
  face: RingFace;
  imageUrl: string | null;
  canvasData: string | null;
  text: string | null;
  fontFamily: string | null;
  flippedX?: boolean;
  flippedY?: boolean;
  invertedColor?: boolean;
  imageOption?: 'standard' | 'drawing' | 'engraving';
}
export interface UpdateEngraving {
  id: string;
  type?: RingEngravingType;
  face?: RingFace;
  imageUrl?: string;
  canvasData?: string;
  text?: string;
  fontFamily?: string;
  flippedX?: boolean;
  flippedY?: boolean;
  invertedColor?: boolean;
  imageOption?: 'standard' | 'drawing' | 'engraving';
}
