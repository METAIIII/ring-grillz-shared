import {
  BoxProps,
  Button,
  ButtonGroup,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaDollarSign, FaPercent } from 'react-icons/fa';
import { Panel } from 'shared/components/UI/Panel';
import { useSuccessFailToast } from 'shared/hooks/useSuccessFailToast';
import { useCreateCouponMutation } from 'shared/reducers/api';
import { CreateCoupon } from 'shared/types';
import { z } from 'zod';

export function CreateCoupon(props: BoxProps) {
  const [mode, setMode] = useState<'amount_off' | 'percent_off'>('amount_off');
  const [createCoupon, { isLoading, isError, isSuccess }] = useCreateCouponMutation();
  const schema = z.object({
    amount_off: z
      .number()
      .positive()
      .int()
      .optional()
      .refine((value) => value && mode === 'amount_off', {
        message: 'Amount off must be set when fixed mode is selected',
      }),
    duration: z.enum(['forever', 'once', 'repeating']),
    duration_in_months: z.number().positive().int().optional(),
    max_redemptions: z.number().positive().int().optional(),
    name: z.string(),
    percent_off: z
      .number()
      .positive()
      .int()
      .optional()
      .refine((value) => value && mode === 'percent_off', {
        message: 'Percent off must be set when percentage mode is selected',
      }),
    promotion_code: z.string(),
    redeem_by: z.number().positive().int().optional(),
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCoupon>({
    defaultValues: {
      duration: 'forever',
      name: '',
    },
    resolver: zodResolver(schema),
  });

  const duration = watch('duration');

  const onSubmit = (data: CreateCoupon) =>
    createCoupon({
      ...data,
      currency: 'aud',
      amount_off: data.amount_off ? data.amount_off * 100 : undefined,
    });

  useSuccessFailToast({
    isSuccess,
    isFail: isError,
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
        <InputGroup mb={2}>
          <InputLeftElement>
            <IconButton
              aria-label='Toggle Percentage/Fixed Amount'
              borderRightRadius={0}
              icon={mode === 'amount_off' ? <FaDollarSign /> : <FaPercent />}
              onClick={() => setMode(mode === 'amount_off' ? 'percent_off' : 'amount_off')}
            />
          </InputLeftElement>
          {mode === 'amount_off' && (
            <Input
              {...register('amount_off')}
              isInvalid={!!errors.amount_off}
              placeholder='Amount Off'
              type='number'
            />
          )}
          {mode === 'percent_off' && (
            <Input
              {...register('percent_off')}
              isInvalid={!!errors.percent_off}
              placeholder='Percent Off'
              type='number'
            />
          )}
          {errors.amount_off && <FormErrorMessage>{errors.amount_off.message}</FormErrorMessage>}
          {errors.percent_off && <FormErrorMessage>{errors.percent_off.message}</FormErrorMessage>}
        </InputGroup>
        <ButtonGroup isAttached mb={2}>
          <Button
            variant={duration === 'forever' ? 'solid' : 'outline'}
            onClick={() => setValue('duration', 'forever')}
          >
            Forever
          </Button>
          <Button
            variant={duration === 'once' ? 'solid' : 'outline'}
            onClick={() => setValue('duration', 'once')}
          >
            Once
          </Button>
          <Button
            variant={duration === 'repeating' ? 'solid' : 'outline'}
            onClick={() => setValue('duration', 'repeating')}
          >
            Repeating
          </Button>
        </ButtonGroup>
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
