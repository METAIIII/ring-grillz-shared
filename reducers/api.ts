import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from '../types/api-responses';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  tagTypes: ['Data', 'User', 'Order', 'Coupon', 'Checkout'],
  endpoints: (builder) => ({
    /**
     * DATA queries/mutations
     */
    getGrillzData: builder.query<GrillzMaterialsResponse, void>({
      query: () => `data`,
      providesTags: () => [{ type: 'Data', id: 'GRILLZ' }],
    }),
    getRingsData: builder.query<RingsDataResponse, string>({
      query: () => `data`,
      providesTags: () => [{ type: 'Data', id: 'RINGS' }],
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
      providesTags: () => [{ type: 'Order', id: 'LIST' }],
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
    sendOrderEmail: builder.mutation<OrderResponse, { orderId: string; checkoutId: string }>({
      query: ({ orderId, checkoutId }) => ({
        url: `order/mail`,
        method: 'POST',
        body: { orderId, checkoutId },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
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
    getAllUsers: builder.query<UsersResponse, string>({
      query: (str) => `user`,
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
