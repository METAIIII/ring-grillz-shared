import { useDisclosure } from '@chakra-ui/react';

import { useSuccessFailToast } from '../../../../hooks/use-toast';
import { useDeleteCouponMutation } from '../../../../reducers/api';

export function useDeleteCoupon() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteCoupon, { isError, isLoading, isSuccess }] = useDeleteCouponMutation();

  useSuccessFailToast({
    isSuccess,
    isFail: isError,
    successMessage: 'Coupon deleted',
    failMessage: 'There was an error deleting the coupon',
  });

  return {
    isOpen,
    onOpen,
    onClose,
    deleteCoupon,
    isLoading,
  };
}
