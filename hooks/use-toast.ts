import { useEffect } from 'react';
import { toast } from 'sonner';

interface ToastAction {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  actionButtonStyle?: React.CSSProperties;
}

export const useSuccessFailToast = ({
  isSuccess,
  successMessage,
  successAction,
  isFail,
  failMessage,
  failAction,
}: {
  isSuccess?: boolean;
  successMessage: string;
  successAction?: ToastAction;
  isFail?: boolean;
  failMessage: string;
  failAction?: ToastAction;
}) => {
  useEffect(() => {
    if (isSuccess) {
      toast.success(successMessage, {
        action: successAction,
      });
    }
    if (isFail) {
      toast.error(failMessage, {
        action: failAction,
      });
    }
  }, [isSuccess, successMessage, isFail, failMessage, successAction, failAction]);
};
