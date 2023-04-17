import {
  BoxProps,
  Button,
  Flex,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaDollarSign, FaPercentage } from 'react-icons/fa';
import { Panel } from 'shared/components/UI/Panel';
import { useSuccessFailToast } from 'shared/hooks/useSuccessFailToast';
import { useCreateCouponMutation } from 'shared/reducers/api';
import { CreateCoupon } from 'shared/types';
import { z } from 'zod';

export function CreateCoupon(props: BoxProps) {
  const [mode, setMode] = useState<'amount_off' | 'percent_off'>('amount_off');
  const [createCoupon, { isLoading, isError, isSuccess, data }] = useCreateCouponMutation();
  const schema = z.object({
    amount_off: z.number().optional(),
    duration: z.enum(['forever', 'once', 'repeating']),
    name: z.string(),
    percent_off: z.number().optional(),
    promotion_code: z.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCoupon>({
    defaultValues: {
      duration: 'forever',
      name: '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: CreateCoupon) =>
    createCoupon({
      ...data,
      currency: 'aud',
      amount_off: data.amount_off ? data.amount_off * 100 : undefined,
    });

  useSuccessFailToast({
    isSuccess: isSuccess && !data?.error,
    isFail: isError || (isSuccess && !!data?.error),
    successMessage: 'Coupon created successfully',
    failMessage: 'Something went wrong',
  });

  return (
    <Panel {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading as='h2' fontSize='xl' mb={4}>
          Create Coupon
        </Heading>
        <InputGroup mb={2}>
          <Input {...register('name')} isInvalid={!!errors.name} placeholder='Name' />
        </InputGroup>
        <InputGroup mb={2}>
          <Input
            {...register('promotion_code')}
            isInvalid={!!errors.promotion_code}
            placeholder='Promotion Code'
          />
          {errors.promotion_code && (
            <FormErrorMessage>{errors.promotion_code.message}</FormErrorMessage>
          )}
        </InputGroup>
        <Flex mb={2}>
          <IconButton
            aria-label={mode === 'amount_off' ? 'Fixed' : 'Percentage'}
            icon={mode === 'amount_off' ? <FaDollarSign /> : <FaPercentage />}
            mr={2}
            onClick={() => setMode(mode === 'amount_off' ? 'percent_off' : 'amount_off')}
          />
          <Input
            flex={1}
            {...register('amount_off', { valueAsNumber: true })}
            isDisabled={mode === 'percent_off'}
            isInvalid={!!errors.amount_off}
            mr={2}
            placeholder='Amount Off'
            type='number'
          />
          {errors.amount_off && <Text color='red.300'>{errors.amount_off.message}</Text>}
          <Input
            flex={1}
            {...register('percent_off', { valueAsNumber: true })}
            isDisabled={mode === 'amount_off'}
            isInvalid={!!errors.percent_off}
            placeholder='Percent Off'
            type='number'
          />
        </Flex>
        {errors.percent_off && <Text color='red.300'>{errors.percent_off.message}</Text>}
        <Button
          colorScheme='green'
          isLoading={isLoading || isSubmitting}
          type='submit'
          width='full'
        >
          Create
        </Button>
      </form>
    </Panel>
  );
}
