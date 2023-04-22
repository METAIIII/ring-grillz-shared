import {
  GrillzMaterialOption,
  GrillzMaterialVariant,
  Order,
  RingEngraving,
  RingEngravingPreset,
  User,
} from '@prisma/client';

import Stripe from 'stripe';
import { FullGrillzMaterial, FullOrder, FullRing, FullUser } from '.';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type UserResponse = ApiResponse<FullUser>;
export type UsersResponse = ApiResponse<User[]>;

export type OrderResponse = ApiResponse<FullOrder>;
export type OrdersResponse = ApiResponse<Order[]>;

export type CouponResponse = ApiResponse<Stripe.Coupon | null>;
export type CouponsResponse = ApiResponse<
  (Stripe.Coupon & { promotion?: Stripe.PromotionCode })[] | null
>;

export type CheckoutResponse = ApiResponse<{ url: string } | null>;

export type FullCheckoutResponse = ApiResponse<Stripe.Response<Stripe.Checkout.Session>>;

// Dr Grillz Specific
export type GrillzMaterialResponse = ApiResponse<FullGrillzMaterial>;
export type GrillzMaterialsResponse = ApiResponse<FullGrillzMaterial[]>;
export type GrillzMaterialVariantResponse = ApiResponse<GrillzMaterialVariant>;
export type GrillzMaterialOptionResponse = ApiResponse<GrillzMaterialOption>;

// Ring Kingz Specific
export type RingResponse = ApiResponse<FullRing>;
export type RingsResponse = ApiResponse<FullRing[]>;
export type RingPresetResponse = ApiResponse<RingEngravingPreset>;
export type EngravingResponse = ApiResponse<RingEngraving>;
export type PresetData = {
  simple: RingEngravingPreset[];
  signet: RingEngravingPreset[];
};
export type RingsDataResponse = ApiResponse<{
  rings: FullRing[];
  presets: PresetData;
}>;

export type BackupData = {
  users: User[];
  orders: FullOrder[];
  grillzMaterials: FullGrillzMaterial[];
  ringShapes: FullRing[];
  ringEngravings: RingEngraving[];
  ringEngravingPresets: PresetData;
};
export type BackupResponse = ApiResponse<BackupData>;
