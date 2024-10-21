import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CreateCoupon } from '../components/admin-only/coupon/create-coupon/use-create-coupon';
import { UpdateUser } from '../components/my-account/edit-profile/use-edit-profile';
import { CreateOrder, UpdateOrder } from '../types';
import {
  ApiResponse,
  CouponResponse,
  CouponsResponse,
  FullCheckoutResponse,
  OrderResponse,
  OrdersResponse,
  PaginatedRequest,
  UserResponse,
  UsersResponse,
} from '../types/api-responses';
import { EmailRequestBody } from '../types/email';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  tagTypes: ['Data', 'User', 'Order', 'Coupon', 'Checkout'],
  endpoints: (builder) => ({
    /**
     * ORDER queries/mutations
     */
    getOrders: builder.query<OrdersResponse, PaginatedRequest<Record<string, any>>>({
      query: ({ pageIndex, pageSize, filters, sortBy }) => {
        let queryString = `order?pageIndex=${pageIndex}&pageSize=${pageSize}`;

        // Add filters to the query string
        if (filters && filters.length > 0) {
          const filterParams = filters
            .map((f) => `filter=${encodeURIComponent(JSON.stringify(f))}`)
            .join('&');
          queryString += `&${filterParams}`;
        }

        // Add sorting to the query string
        if (sortBy && sortBy.length > 0) {
          const sortParams = sortBy
            .map((s) => `sort=${encodeURIComponent(JSON.stringify(s))}`)
            .join('&');
          queryString += `&${sortParams}`;
        }

        return queryString;
      },
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
    createCheckoutSession: builder.mutation<{ sessionUrl: string | null }, { orderId: string }>({
      query: (data) => ({
        url: `checkout/process`,
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
    getUsers: builder.query<UsersResponse, PaginatedRequest<Record<string, any>>>({
      query: ({ pageIndex, pageSize, filters, sortBy }) => {
        let queryString = `user?pageIndex=${pageIndex}&pageSize=${pageSize}`;

        // Add filters to the query string
        if (filters && filters.length > 0) {
          const filterParams = filters
            .map((f) => `filter=${encodeURIComponent(JSON.stringify(f))}`)
            .join('&');
          queryString += `&${filterParams}`;
        }

        // Add sorting to the query string
        if (sortBy && sortBy.length > 0) {
          const sortParams = sortBy
            .map((s) => `sort=${encodeURIComponent(JSON.stringify(s))}`)
            .join('&');
          queryString += `&${sortParams}`;
        }

        return queryString;
      },
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
  useGetCouponsQuery,
  useGetOrderByIdQuery,
  useGetOrdersQuery,
  useGetUserByEmailQuery,
  useGetUsersQuery,
  useSendEmailMutation,
  useUpdateOrderMutation,
  useUpdateUserMutation,
} = api;
