import { OrderType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '../config/auth';
import { CreateCoupon } from '../types';
import { CouponResponse, CouponsResponse } from '../types/apiResponses';
import { handleApiError } from './error';
import { getUser } from './user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

export const handleCoupons = async (
  req: NextApiRequest,
  res: NextApiResponse<CouponsResponse>,
  orderType: OrderType
) => {
  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user?.email ? await getUser(session.user.email, orderType) : null;
  const isAdmin = sessionUser?.role === 'ADMIN';
  if (!isAdmin) {
    return await handleApiError(res, new Error('Unauthorised'), 403);
  }

  const couponList = await stripe.coupons.list({
    limit: 100,
    starting_after: req.query.starting_after?.toString(),
    ending_before: req.query.ending_before?.toString(),
  });

  if (!couponList) {
    return res.status(200).json({ data: null, error: 'No coupons found' });
  }

  const promotionCodes = await Promise.all(
    couponList.data.map(async (coupon) => {
      const promotionCode = await stripe.promotionCodes.list({
        coupon: coupon.id,
        limit: 1,
      });

      return promotionCode.data.length ? promotionCode.data[0] : null;
    })
  );

  const coupons: (Stripe.Coupon & { promotion: Stripe.PromotionCode })[] = couponList.data
    .map((coupon, index) => {
      const promotionCode = promotionCodes[index];
      return promotionCode ? { ...coupon, promotion: promotionCode } : null;
    })
    .filter((coupon): coupon is Stripe.Coupon & { promotion: Stripe.PromotionCode } => !!coupon);

  res.status(200).json({ data: coupons });
};

export const handleCoupon = async (req: NextApiRequest, res: NextApiResponse<CouponResponse>) => {
  try {
    if (req.method === 'POST') {
      const createParams = req.body as CreateCoupon;
      const newCoupon = await stripe.coupons.create({
        amount_off: createParams.amount_off,
        currency: createParams.currency,
        duration: createParams.duration,
        name: createParams.name,
        percent_off: createParams.percent_off,
      });
      const newPromotionCode = await stripe.promotionCodes.create({
        coupon: newCoupon.id,
        code: createParams.promotion_code,
        active: true,
      });

      res.status(200).json({ data: newPromotionCode ? newCoupon : null });
    }

    const couponCode = req.query.code as string;
    if (!couponCode || couponCode === 'UNDEFINED') {
      return res.status(200).json({ data: null });
    }

    const promotionCodes = await stripe.promotionCodes.list({
      code: couponCode,
      limit: 1,
    });

    const promotionCode = promotionCodes.data[0];
    const coupon = promotionCode?.coupon;

    if (!promotionCode) {
      return res.status(200).json({ data: null, error: 'Promotion code not found' });
    }

    if (!coupon) {
      return res.status(200).json({ data: null, error: 'Coupon not found' });
    }

    if (req.method === 'GET') {
      res.status(200).json({ data: coupon });
    }

    if (req.method === 'DELETE') {
      await stripe.coupons.del(coupon.id);
      res.status(200).json({ data: coupon });
    }
  } catch (error) {
    await handleApiError(res, 'Error creating coupon');
  }
};
