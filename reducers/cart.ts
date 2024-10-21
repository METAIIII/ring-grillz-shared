import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CheckoutOptions } from '../types';

export interface CartItem {
  id: string;
  amount: number;
  metadata: string;
}

interface CartState {
  cartItems: CartItem[];
  total: number;
  options: CheckoutOptions;
}

const initialState: CartState = {
  cartItems: [],
  total: 0,
  options: {
    tcAgreed: false,
    paymentType: 'FULL_PAYMENT',
    couponCode: '',
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.cartItems.push(action.payload);
      state.total = Math.max(state.total + action.payload.amount, 0);
    },
    removeItem: (state, action: PayloadAction<CartItem>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
      state.total = Math.max(state.total - action.payload.amount, 0);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.total = 0;
    },
    setCartOptions: (state, action: PayloadAction<Partial<CartState['options']>>) => {
      state.options = {
        ...state.options,
        ...action.payload,
      };
    },
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.options.couponCode = action.payload;
    },
  },
});

export const { addItem, removeItem, clearCart, setCartOptions, setCouponCode } = cartSlice.actions;

export default cartSlice.reducer;
