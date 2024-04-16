import { OrderType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getGrillzMaterials } from 'utils/tooth-utils';

import prisma from '../prisma';
import { FullOrder } from '../types';
import { CheckoutResponse, FullCheckoutResponse } from '../types/api-responses';
import {
  convertGrillzToLineItem,
  getGrillzFromMetadata,
  STRIPE_API_VERSION,
  STRIPE_SECRET_KEY,
} from '../utils/stripe-helpers';
import { handleApiError } from './error';

export const handleCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | FullCheckoutResponse>,
  orderType: OrderType,
) => {
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });

  switch (req.method) {
    case 'GET':
      await handleGetCheckout(req, res, stripe);
      break;
    case 'POST':
      await handlePostCheckout(req, res, stripe, orderType);
      break;
    default:
      res.setHeader('Allow', 'POST, GET');
      res.status(405).end('Method Not Allowed');
  }
};

const handlePostCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | FullCheckoutResponse>,
  stripe: Stripe,
  orderType: OrderType,
) => {
  const order = req.body as FullOrder;

  try {
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    let couponId;
    if (order.couponCode) {
      const promotionCodes = await stripe.promotionCodes.list({
        code: order.couponCode,
        limit: 1,
      });
      if (!promotionCodes.data.length)
        return res.status(200).json({ data: null, error: 'Invalid coupon code.' });
      couponId = promotionCodes.data[0].coupon.id;
    }

    const materials = await getGrillzMaterials();

    if (orderType === 'GRILLZ') {
      lineItems = order.items.map((item) => {
        const metadata = item.metadata as Record<string, string | number | boolean>;
        return convertGrillzToLineItem(getGrillzFromMetadata(metadata, materials));
      });
    }
    if (orderType === 'RING') {
      // TODO: Implement ring line item conversion
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      customer_email: order.email,
      client_reference_id: order.id,
      expand: ['customer_details', 'line_items'],
      shipping_address_collection: { allowed_countries: ['AU'] },
      mode: 'payment',
      payment_method_types: ['card', 'afterpay_clearpay'],
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      line_items: lineItems,
      custom_text: {
        shipping_address: {
          message: `Express postage is included with every order.`,
        },
        submit: {
          message: `We'll email you instructions on how to get started.`,
        },
      },
      customer_creation: 'always',
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${req.headers.origin}/receipt?order_id=${order.id}`,
      cancel_url: `${req.headers.origin}/receipt?order_id=${order.id}`,
      consent_collection: {
        terms_of_service: 'required',
      },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    if (!checkoutSession) {
      await handleApiError(res, new Error('Failed to create checkout session.'));
    }

    const customer = checkoutSession?.customer_details;

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        user: customer?.email
          ? {
              connectOrCreate: {
                where: {
                  email: customer.email,
                },
                create: {
                  email: customer.email,
                  stripeId: checkoutSession.customer?.toString(),
                },
              },
            }
          : undefined,
        status:
          checkoutSession?.status === 'complete'
            ? 'PAID'
            : checkoutSession?.status === 'expired'
              ? 'CANCELED'
              : 'PENDING',
        paymentType: order.paymentType ?? 'FULL_PAYMENT',
        stripeId: checkoutSession?.id,
      },
    });
    if (checkoutSession.url) {
      res.status(200).json({ data: { url: checkoutSession.url } });
    } else {
      throw new Error('Failed to create checkout session.');
    }
  } catch (error) {
    if (error instanceof Error || typeof error === 'string') await handleApiError(res, error);
  }
};

const handleGetCheckout = async (
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
