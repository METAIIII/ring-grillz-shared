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
import { AiOutlineMail } from 'react-icons/ai';
import { FaStripeS } from 'react-icons/fa';

import { CouponInput } from './coupon-input';
import { CheckoutProps, useCheckout } from './use-checkout';

function Checkout({ lineItems, couponCode, orderType }: CheckoutProps) {
  const { handleSubmit, register, onSubmit, errors, isLoading, isSubmitting } = useCheckout({
    lineItems,
    couponCode,
    orderType,
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
