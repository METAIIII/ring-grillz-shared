import Stripe from 'stripe';

export type FullCheckoutSession = Stripe.Response<Stripe.Checkout.Session>;
