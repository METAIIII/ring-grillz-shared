import {
  BoxProps,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaDollarSign, FaPercentage } from 'react-icons/fa';
import { useSuccessFailToast } from 'shared/hooks/use-toast';
import { useCreateCouponMutation } from 'shared/reducers/api';
import { z } from 'zod';

const schema = z
  .object({
    mode: z.enum(['fixed', 'percentage']),
    duration: z.enum(['forever', 'once', 'repeating']),
    name: z.string(),
    promotion_code: z.string(),
    amount_off: z.union([z.number().optional().nullable(), z.nan()]),
    percent_off: z.union([z.number().optional().nullable(), z.nan()]),
  })
  .refine(
    (data) => {
      if (
        data.mode === 'fixed' &&
        (data.amount_off === undefined || (data.amount_off && isNaN(data.amount_off)))
      ) {
        return false;
      } else if (
        data.mode === 'percentage' &&
        (data.percent_off === undefined || (data.percent_off && isNaN(data.percent_off)))
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Invalid combination of mode and amount_off/percent_off',
      path: ['mode'],
    }
  );

export type CreateCoupon = z.infer<typeof schema>;

export function CreateCouponForm(props: BoxProps) {
  const [createCoupon, { isLoading, isError, isSuccess, data }] = useCreateCouponMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCoupon>({
    defaultValues: {
      amount_off: undefined,
      duration: 'forever',
      name: '',
      percent_off: undefined,
    },
    resolver: zodResolver(schema),
  });
  const mode = watch('mode', 'fixed');

  const onSubmit = (data: CreateCoupon) => {
    const baseData = {
      ...data,
      currency: 'aud',
    };

    const updatedData =
      mode === 'fixed'
        ? {
            ...baseData,
            amount_off: data.amount_off ? data.amount_off * 100 : undefined,
            percent_off: undefined,
          }
        : {
            ...baseData,
            percent_off: data.percent_off,
            amount_off: undefined,
          };

    createCoupon(updatedData);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useSuccessFailToast({
    isSuccess: isSuccess && !data?.error,
    isFail: isError || (isSuccess && !!data?.error),
    successMessage: 'Coupon created successfully',
    failMessage: 'Something went wrong',
  });

  return (
    <Card {...props}>
      <CardBody>
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
          </InputGroup>
          <Flex mb={2}>
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
      </CardBody>
    </Card>
  );
}
