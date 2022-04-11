import Stripe from 'stripe';

export type FullCheckoutSession = Stripe.Response<
  Stripe.Checkout.Session & {
    customer: Stripe.Customer;
    payment_intent: Stripe.PaymentIntent & {
      payment_method: Stripe.PaymentMethod;
    };
    line_items: Stripe.LineItem[];
  }
>;
