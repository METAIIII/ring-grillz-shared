import axios from 'axios';

import getStripe from '../lib/stripe';
import { CreateOrder } from '../types';
import { CheckoutResponse, OrderResponse } from '../types/apiResponses';

const handleOrderCheckout = async (createOrderData: CreateOrder) => {
  try {
    const orderResponse = await axios.post<OrderResponse>(
      '/api/order',
      createOrderData
    );

    const order = orderResponse.data?.data;

    // Create a Checkout Session.
    const checkoutResponse = await axios.post<CheckoutResponse>(
      '/api/checkout',
      {
        order,
      }
    );

    const checkoutSession = checkoutResponse.data?.data;

    if (!checkoutSession) throw new Error('Checkout session not found');

    // Redirect to Checkout.
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe not found');
    const { error } = await stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    console.error(err);
  }
};

export default handleOrderCheckout;
