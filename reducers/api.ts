import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EmailRequestBody } from 'shared/types/email';

import { UpdateUser } from '../components/Account/UserInfo';
import { CreateCoupon } from '../components/Admin/Coupons/CreateCoupon';
import { CreateOrder, FullOrder, UpdateOrder } from '../types';
import {
  ApiResponse,
  CouponResponse,
  CouponsResponse,
  FullCheckoutResponse,
  OrderResponse,
  OrdersResponse,
  UserResponse,
  UsersResponse,
} from '../types/api-responses';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  tagTypes: ['Data', 'User', 'Order', 'Coupon', 'Checkout'],
  endpoints: (builder) => ({
    /**
     * ORDER queries/mutations
     */
    getOrders: builder.query<OrdersResponse, { take: number; skip: number }>({
      query: ({ take, skip }) => `order?take=${take}&skip=${skip}`,
      providesTags: () => [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<OrderResponse, { data: CreateOrder }>({
      query: ({ data }) => ({
        url: `order`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOrder: builder.mutation<OrderResponse, { id: string; data: UpdateOrder }>({
      query: ({ id, data }) => ({
        url: `order/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    /**
     * EMAIL queries/mutations
     */
    sendEmail: builder.mutation<ApiResponse<string>, EmailRequestBody>({
      query: (req) => ({
        url: `mail`,
        method: 'POST',
        body: req,
      }),
      invalidatesTags: (result, error, { vars }) => [
        { type: 'Order', id: 'orderID' in vars ? vars.orderID : '' },
      ],
    }),
    /**
     * CHECKOUT queries/mutations
     */
    getCheckoutSession: builder.query<FullCheckoutResponse, string>({
      query: (id) => `checkout/${id}`,
      providesTags: (result, error, id) => [{ type: 'Checkout', id }],
    }),
    createCheckoutSession: builder.mutation<FullCheckoutResponse, FullOrder>({
      query: (data) => ({
        url: `checkout`,
        method: 'POST',
        body: data,
      }),
    }),
    /**
     * COUPON queries/mutations
     */
    getCoupons: builder.query<CouponsResponse, void>({
      query: () => 'coupon',
      providesTags: () => [{ type: 'Coupon', id: 'LIST' }],
    }),
    getCouponByCode: builder.query<CouponResponse, string>({
      query: (code) => `coupon/${code ?? 'UNDEFINED'}`,
      providesTags: (result, error, id) => [{ type: 'Coupon', id }],
    }),
    createCoupon: builder.mutation<CouponResponse, CreateCoupon>({
      query: (data) => ({
        url: `coupon`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: () => [{ type: 'Coupon', id: 'LIST' }],
    }),
    deleteCoupon: builder.mutation<null, string>({
      query: (code) => ({
        url: `coupon/${code}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),
    /**
     * USER queries/mutations
     */
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => 'user',
      providesTags: () => [{ type: 'User', id: 'LIST' }],
    }),
    getUserByEmail: builder.query<UserResponse, string>({
      query: (email) => `user/${email}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<UserResponse, { email: string; data: UpdateUser }>({
      query: ({ email, data }) => ({
        url: `user/${email}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { email }) => [
        { type: 'User', id: email },
        { type: 'User', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<null, string>({
      query: (email) => ({
        url: `user/${email}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreateCouponMutation,
  useCreateOrderMutation,
  useDeleteCouponMutation,
  useDeleteUserMutation,
  useGetCheckoutSessionQuery,
  useGetCouponByCodeQuery,
  useGetOrderByIdQuery,
  useGetUserByEmailQuery,
  useSendEmailMutation,
  useUpdateOrderMutation,
  useUpdateUserMutation,
} = api;
