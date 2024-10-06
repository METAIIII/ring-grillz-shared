import {
  GrillzMaterialOption,
  GrillzMaterialVariant,
  RingEngraving,
  RingEngravingPreset,
  User,
} from '@prisma/client';
import { GetOrdersResult } from 'shared/api/order';
import { GetUsersResult } from 'shared/api/user';
import Stripe from 'stripe';

import { FullCoupon, FullGrillzMaterial, FullOrder, FullRing, FullUser } from '.';

export interface Filter {
  key: string;
  value: string;
  operation:
    | 'equals'
    | 'not'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte';
}

export interface Sort {
  key: string;
  order: 'asc' | 'desc';
}

export type PaginatedRequest<T> = {
  pageIndex: number;
  pageSize: number;
  filters: Filter[];
  sortBy: Sort[];
} & T;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type UserResponse = ApiResponse<FullUser>;
export type UsersResponse = ApiResponse<GetUsersResult>;

export type OrderResponse = ApiResponse<FullOrder>;
export type OrdersResponse = ApiResponse<GetOrdersResult>;

export type CouponResponse = ApiResponse<FullCoupon | null>;
export type CouponsResponse = ApiResponse<FullCoupon[]>;

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
export interface PresetData {
  simple: RingEngravingPreset[];
  signet: RingEngravingPreset[];
}
export type RingsDataResponse = ApiResponse<{
  rings: FullRing[];
  presets: PresetData;
}>;

export interface BackupData {
  users: User[];
  orders: FullOrder[];
  grillzMaterials: FullGrillzMaterial[];
  ringShapes: FullRing[];
  ringEngravings: RingEngraving[];
  ringEngravingPresets: PresetData;
}
export type BackupResponse = ApiResponse<BackupData>;
