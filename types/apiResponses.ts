import { Order, RingEngraving, RingEngravingPreset, TeethMaterialOption, TeethMaterialVariant, User } from '@prisma/client';
import Stripe from 'stripe';

import { FullCheckoutSession } from '../types/stripe';
import { FullOrder, FullRing, FullTeethMaterial, FullUser } from './';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type UserResponse = ApiResponse<FullUser>;
export type UsersResponse = ApiResponse<User | User[]>;

export type OrderResponse = ApiResponse<FullOrder>;
export type OrdersResponse = ApiResponse<FullOrder | Order[]>;

export type CheckoutResponse = ApiResponse<
  Stripe.Response<Stripe.Checkout.Session>
>;

export type FullCheckoutResponse = ApiResponse<FullCheckoutSession>;

// Dr Grillz Specific
export type TeethMaterialResponse = ApiResponse<FullTeethMaterial>;
export type TeethMaterialsResponse = ApiResponse<FullTeethMaterial[]>;
export type TeethMaterialVariantResponse = ApiResponse<TeethMaterialVariant>;
export type TeethMaterialOptionResponse = ApiResponse<TeethMaterialOption>;

// Ring Kingz Specific
export type RingResponse = ApiResponse<FullRing>;
export type RingsResponse = ApiResponse<FullRing[]>;
export type EngravingResponse = ApiResponse<RingEngraving>;
export type PresetData = {
  simple: RingEngravingPreset[];
  signet: RingEngravingPreset[];
};
export type PresetsResponse = ApiResponse<PresetData>;

export type BackupData = {
  users: User[];
  orders: FullOrder[];
  teethMaterials: FullTeethMaterial[];
  ringShapes: FullRing[];
  ringEngravings: RingEngraving[];
  ringEngravingPresets: PresetData;
};
export type BackupResponse = ApiResponse<BackupData>;
