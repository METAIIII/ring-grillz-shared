import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { UpdateUser } from '../components/Account/UserInfo';
import { CreateCoupon } from '../components/Admin/Coupons/CreateCoupon';
import { CreateOrder, FullOrder, UpdateOrder } from '../types';
import {
  CouponResponse,
  CouponsResponse,
  FullCheckoutResponse,
  GrillzMaterialsResponse,
  OrderResponse,
  OrdersResponse,
  RingsDataResponse,
  UserResponse,
  UsersResponse,
} from '../types/apiResponses';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Data', 'User', 'Order', 'Coupon', 'Checkout'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    /**
     * DATA queries/mutations
     */
    getGrillzData: builder.query<GrillzMaterialsResponse, string>({
      query: (str) => `data`,
      providesTags: () => [{ type: 'Data', code: 'GRILLZ' }],
    }),
    getRingsData: builder.query<RingsDataResponse, string>({
      query: (str) => `data`,
      providesTags: () => [{ type: 'Data', code: 'RINGS' }],
    }),
    /**
     * ORDER queries/mutations
     */
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    getOrdersByStatus: builder.query<OrdersResponse, string>({
      query: (status) => `order?status=${status}`,
      providesTags: () => [{ type: 'Order', status: 'LIST' }],
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
        { type: 'Order', status: 'LIST' },
      ],
    }),
    sendOrderEmail: builder.mutation<OrderResponse, { orderId: string; checkoutId: string }>({
      query: ({ orderId, checkoutId }) => ({
        url: `order/mail`,
        method: 'POST',
        body: { orderId, checkoutId },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', orderId }],
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
    getCoupons: builder.query<CouponsResponse, string>({
      query: (str) => `coupon`,
      providesTags: () => [{ type: 'Coupon', code: 'LIST' }],
    }),
    getCouponByCode: builder.query<CouponResponse, string>({
      query: (code) => `coupon/${code ?? 'UNDEFINED'}`,
      providesTags: (result, error, code) => [{ type: 'Coupon', code }],
    }),
    createCoupon: builder.mutation<CouponResponse, CreateCoupon>({
      query: (data) => ({
        url: `coupon`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: () => [{ type: 'Coupon', code: 'LIST' }],
    }),
    deleteCoupon: builder.mutation<null, string>({
      query: (code) => ({
        url: `coupon/${code}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, code) => [
        { type: 'Coupon', code },
        { type: 'Coupon', code: 'LIST' },
      ],
    }),
    /**
     * USER queries/mutations
     */
    getAllUsers: builder.query<UsersResponse, string>({
      query: (str) => `user`,
      providesTags: () => [{ type: 'User', email: 'LIST' }],
    }),
    getUserByEmail: builder.query<UserResponse, string>({
      query: (email) => `user/${email}`,
      providesTags: (result, error, email) => [{ type: 'User', email }],
    }),
    updateUser: builder.mutation<UserResponse, { email: string; data: UpdateUser }>({
      query: ({ email, data }) => ({
        url: `user/${email}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { email }) => [
        { type: 'User', email },
        { type: 'User', email: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<null, string>({
      query: (email) => ({
        url: `user/${email}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, email) => [
        { type: 'User', email },
        { type: 'User', email: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetGrillzDataQuery,
  useGetRingsDataQuery,
  useGetCouponsQuery,
  useGetCouponByCodeQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetOrderByIdQuery,
  useGetOrdersByStatusQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useSendOrderEmailMutation,
  useGetCheckoutSessionQuery,
  useCreateCheckoutSessionMutation,
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  util: { getRunningQueriesThunk },
} = api;

export const { getGrillzData } = api.endpoints;
