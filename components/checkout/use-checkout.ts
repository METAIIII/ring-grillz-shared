import { zodResolver } from '@hookform/resolvers/zod';
import { OrderType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import Stripe from 'stripe';
import { z } from 'zod';

import { useSuccessFailToast } from '../../hooks/use-toast';
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from '../../reducers/api';

export interface CheckoutProps {
  couponCode?: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  orderType: OrderType;
}

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  notes: z.string().optional(),
});

export type CustomerInfo = z.infer<typeof schema>;

export function useCheckout({ couponCode, lineItems, orderType }: CheckoutProps) {
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [createOrder, { isLoading, isError, data: checkoutData }] = useCreateOrderMutation();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: '',
      notes: '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (customerInfo: CustomerInfo) => {
    const orderResponse = await createOrder({
      data: {
        customerNotes: customerInfo.notes,
        email: customerInfo.email,
        items: lineItems,
        paymentType: 'FULL_PAYMENT',
        couponCode,
        status: 'UNPAID',
        type: orderType,
      },
    }).unwrap();
    if (!orderResponse.data) return;
    const checkoutSessionResponse = await createCheckoutSession({
      orderId: orderResponse.data.id,
    }).unwrap();
    if (!checkoutSessionResponse.sessionUrl) return;
    window.location.assign(checkoutSessionResponse.sessionUrl);
  };

  useSuccessFailToast({
    isFail: isError || !!checkoutData?.error,
    successMessage: 'Order created successfully',
    failMessage: 'Failed to create order',
  });

  return {
    handleSubmit,
    register,
    onSubmit,
    errors,
    isLoading,
    isSubmitting,
  };
}
