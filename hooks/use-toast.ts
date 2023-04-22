import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

export const useSuccessFailToast = ({
  isSuccess,
  successMessage,
  isFail,
  failMessage,
}: {
  isSuccess?: boolean;
  successMessage: string;
  isFail?: boolean;
  failMessage: string;
}) => {
  const toast = useToast();
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: successMessage,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    if (isFail) {
      toast({
        title: failMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    return () => {
      toast.closeAll();
    };
  }, [isSuccess, successMessage, isFail, failMessage, toast]);
};
