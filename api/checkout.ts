import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

import { sendOrderConfirmationEmails } from '../email/send-order-email';
import prisma from '../prisma';
import { transitionOrderStatus } from '../prisma/order-state-machine';
import { CheckoutResponse, FullCheckoutResponse } from '../types/api-responses';
import { STRIPE_API_VERSION, STRIPE_SECRET_KEY } from '../utils/stripe-helpers';
import { handleApiError } from './error';

export const handleCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | FullCheckoutResponse>,
) => {
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });

  switch (req.method) {
    case 'GET':
      await handleGetCheckout(req, res, stripe);
      break;
    default:
      res.setHeader('Allow', 'GET');
      res.status(405).end('Method Not Allowed');
  }
};

export const handleGetCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | FullCheckoutResponse>,
  stripe: Stripe,
) => {
  const sessionId = `${req.query.id}`;

  if (!sessionId) {
    handleApiError(res, 'Session ID not provided.', 404);
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json({ data: session });
  } catch (error) {
    if (error instanceof Error || typeof error === 'string') await handleApiError(res, error);
  }
};

export const handleCheckoutWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_API_VERSION,
  });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = await prisma.order.findFirst({ where: { stripeId: session.id } });

    if (order) {
      const newStatus = await transitionOrderStatus(order.id, 'PAYMENT_SUCCEEDED');
      if (newStatus === 'PAID') {
        await sendOrderConfirmationEmails(order.id);
      }
    }
  }
};
