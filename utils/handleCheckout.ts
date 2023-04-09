import axios from 'axios';
import { CreateOrder } from 'shared/types';
import { CheckoutResponse, OrderResponse } from 'shared/types/apiResponses';

export const handleCheckout = async (createOrderData: CreateOrder) => {
  try {
    const { data: orderResponse } = await axios.post<OrderResponse>('/api/order', createOrderData);
    const order = orderResponse?.data;

    const { data: checkoutResponse } = await axios.post<CheckoutResponse>('/api/checkout', {
      order,
    });
    if (checkoutResponse?.data?.url) {
      window.location.assign(checkoutResponse?.data?.url);
    } else {
      throw new Error('No checkout url returned');
    }
  } catch (err) {
    console.error(err);
  }
};
