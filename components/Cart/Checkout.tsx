import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { FaStripeS } from 'react-icons/fa';
import Stripe from 'stripe';
import { z } from 'zod';

import { useSuccessFailToast } from '../../hooks/use-toast';
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from '../../reducers/api';
import { CouponInput } from './CouponInput';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  notes: z.string().optional(),
});

export type CustomerInfo = z.infer<typeof schema>;

interface Props {
  couponCode?: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  orderType: OrderType;
}

function Checkout({ lineItems, couponCode, orderType }: Props) {
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
    const checkoutSessionResponse = await createCheckoutSession(orderResponse.data).unwrap();
    if (!checkoutSessionResponse.data?.url) return;
    window.location.assign(checkoutSessionResponse.data.url);
  };

  useSuccessFailToast({
    isFail: isError || !!checkoutData?.error,
    successMessage: 'Order created successfully',
    failMessage: 'Failed to create order',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2} pb={2} px={2}>
        <FormControl isInvalid={'email' in errors}>
          <InputGroup>
            <InputLeftElement color='gray.300' pointerEvents='none'>
              <AiOutlineMail />
            </InputLeftElement>
            <Input
              {...register('email', { required: true })}
              id='email'
              placeholder='Email'
              type='email'
            />
          </InputGroup>
          {'email' in errors && <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>}
        </FormControl>
        <FormControl>
          <Textarea
            noOfLines={3}
            {...register('notes')}
            id='notes'
            placeholder='Notes (optional)'
          />
        </FormControl>
        <CouponInput />
        <Button
          colorScheme='yellow'
          isDisabled={'email' in errors || 'phone' in errors}
          isLoading={isLoading || isSubmitting}
          leftIcon={<Icon as={FaStripeS} />}
          type='submit'
          width='100%'
        >
          Checkout
        </Button>
      </Stack>
    </form>
  );
}

export default Checkout;
