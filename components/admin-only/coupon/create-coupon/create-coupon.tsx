import { BoxProps, Button, Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { FaDollarSign, FaPercentage } from 'react-icons/fa';

import { Card } from '../../../card/card';
import { useCreateCoupon } from './use-create-coupon';

export function CreateCouponForm(props: BoxProps) {
  const { register, handleSubmit, errors, isSubmitting, isLoading, onSubmit, setValue, mode } =
    useCreateCoupon();

  return (
    <Card shine isLoading={isLoading || isSubmitting} title='Create Coupon' {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup mb={4}>
          <Input {...register('name')} isInvalid={!!errors.name} placeholder='Name' />
        </InputGroup>
        <InputGroup mb={4}>
          <Input
            {...register('promotion_code')}
            isInvalid={!!errors.promotion_code}
            placeholder='Promotion Code'
          />
        </InputGroup>
        <Flex mb={4}>
          <IconButton
            aria-label={mode === 'fixed' ? 'Fixed' : 'Percentage'}
            icon={mode === 'fixed' ? <FaDollarSign /> : <FaPercentage />}
            mr={2}
            onClick={() => setValue('mode', mode === 'fixed' ? 'percentage' : 'fixed')}
          />
          <Input
            {...register('amount_off', { valueAsNumber: true })}
            flex={1}
            isDisabled={mode === 'percentage'}
            isInvalid={!!errors.amount_off}
            mr={2}
            placeholder='Amount Off'
            type='number'
          />
          <Input
            flex={1}
            {...register('percent_off', { valueAsNumber: true })}
            isDisabled={mode === 'fixed'}
            isInvalid={!!errors.percent_off}
            placeholder='Percent Off'
            type='number'
          />
        </Flex>
        {errors.amount_off && <p>{errors.amount_off.message}</p>}
        {errors.percent_off && <p>{errors.percent_off.message}</p>}
        <Button
          colorScheme='green'
          isLoading={isLoading || isSubmitting}
          type='submit'
          width='full'
        >
          Create
        </Button>
      </form>
    </Card>
  );
}
