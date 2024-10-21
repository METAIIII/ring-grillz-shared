import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSuccessFailToast } from '../../../../hooks/use-toast';
import { useCreateCouponMutation } from '../../../../reducers/api';

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
    },
  );

export type CreateCoupon = z.infer<typeof schema>;

export function useCreateCoupon() {
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

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isLoading,
    setValue,
    mode,
  };
}
