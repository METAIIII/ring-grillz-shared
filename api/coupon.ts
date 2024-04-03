import { OrderType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { FullCoupon } from 'shared/types';
import Stripe from 'stripe';

import { CreateCoupon } from '../components/Admin/Coupons/CreateCoupon';
import { authOptions } from '../config/auth';
import { CouponResponse, CouponsResponse } from '../types/api-responses';
import { handleApiError } from './error';
import { getUser } from './user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2023-10-16' });

export async function getCoupons({
  limit = 100,
  starting_after,
  ending_before,
}: {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}) {
  const couponList = await stripe.coupons.list({
    limit,
    starting_after,
    ending_before,
  });

  const promotionCodes = await Promise.all(
    couponList.data.map(async (coupon) => {
      const promotionCode = await stripe.promotionCodes.list({
        coupon: coupon.id,
        limit: 1,
      });

      return promotionCode.data.length ? promotionCode.data[0] : null;
    }),
  );

  const coupons: FullCoupon[] = couponList.data
    .map((coupon, index) => {
      const promotionCode = promotionCodes[index];
      return promotionCode ? { ...coupon, promotion: promotionCode } : null;
    })
    .filter((coupon): coupon is FullCoupon => !!coupon);

  return coupons;
}

export const handleCoupons = async (
  req: NextApiRequest,
  res: NextApiResponse<CouponsResponse>,
  orderType: OrderType,
) => {
  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
  const isAdmin = sessionUser?.role === 'ADMIN';
  if (!isAdmin) return await handleApiError(res, new Error('Unauthorised'), 403);

  const coupons = await getCoupons({
    limit: 100,
    starting_after: req.query.starting_after as string,
    ending_before: req.query.ending_before as string,
  });

  res.status(200).json({ data: coupons });
};

export const handleCoupon = async (req: NextApiRequest, res: NextApiResponse<CouponResponse>) => {
  try {
    if (req.method === 'POST') {
      const createParams = req.body as CreateCoupon;
      const newCoupon = await stripe.coupons.create({
        amount_off: !!createParams.amount_off ? createParams.amount_off : undefined,
        currency: 'aud',
        duration: createParams.duration,
        name: createParams.name,
        percent_off: !!createParams.percent_off ? createParams.percent_off : undefined,
      });
      const newPromotionCode = await stripe.promotionCodes.create({
        coupon: newCoupon.id,
        code: createParams.promotion_code,
        active: true,
      });

      res.status(200).json({ data: { ...newCoupon, promotion: newPromotionCode } });
    }

    if (req.method === 'GET') {
      const couponCode = req.query.code as string;
      if (!couponCode || couponCode === 'UNDEFINED') {
        return res.status(200).json({ data: null, error: 'No coupon code provided' });
      }
      const promotionCodes = await stripe.promotionCodes.list({
        code: couponCode,
        limit: 1,
      });

      const promotionCode = promotionCodes.data[0];
      if (!promotionCode) {
        return res.status(200).json({ data: null, error: 'Promotion code not found' });
      }
      const coupon = { ...promotionCode?.coupon, promotion: promotionCode };
      if (!coupon) {
        return res.status(200).json({ data: null, error: 'Coupon not found' });
      }
      res.status(200).json({ data: coupon });
    }
    if (req.method === 'DELETE') {
      const couponId = req.query.code as string;
      // in the case of delete req, 'code' is actually the id of the coupon, not the promo code
      await stripe.coupons.del(couponId);
      res.status(200).json({ data: null });
    }
  } catch (error) {
    await handleApiError(res, 'Error creating coupon');
  }
};
