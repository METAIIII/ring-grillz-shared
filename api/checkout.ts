import { OrderType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { MAX_AMOUNT, MIN_AMOUNT } from '../config/stripe';
import prisma from '../prisma';
import { FullOrder, GrillzFormAsMetadata } from '../types';
import { CheckoutResponse, FullCheckoutResponse } from '../types/apiResponses';
import { convertGrillzToLineItem, getGrillzFromMetadata } from '../utils/stripeHelpers';
import { handleApiError } from './error';

export const handleCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | FullCheckoutResponse>,
  orderType: OrderType
) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'POST, GET');
    res.status(405).end('Method Not Allowed');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
  });

  if (req.method === 'GET') {
    const sessionId = `${req.query.id}`;

    if (!sessionId) {
      res.status(404).end();
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(200).json({ data: session });
    } catch (error) {
      await handleApiError(res, Error(`${error}`));
    }
  }
  if (req.method === 'POST') {
    const order = req.body as FullOrder;

    if (!(order.paymentAmount >= MIN_AMOUNT && order.paymentAmount <= MAX_AMOUNT)) {
      await handleApiError(res, new Error(`Invalid amount: ${order.paymentAmount}`));
    }
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

      const grillzData = await prisma.grillzMaterial.findMany({
        include: {
          variants: true,
          options: true,
        },
      });
      if (orderType === 'GRILLZ') {
        lineItems = order.items.map((item) => {
          const metadata = JSON.parse(item.metadata) as GrillzFormAsMetadata;
          return convertGrillzToLineItem(getGrillzFromMetadata(metadata, grillzData));
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
      await handleApiError(res, Error(`${error}`));
    }
  }
};
