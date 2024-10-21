import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';

import { useDeleteCoupon } from './use-delete-coupon';

export function DeleteCoupon({
  couponId,
  buttonProps,
}: {
  couponId: string;
  buttonProps?: ButtonProps;
}) {
  const { isOpen, onOpen, onClose, deleteCoupon, isLoading } = useDeleteCoupon();

  return (
    <>
      <Button leftIcon={<FaTrashAlt />} onClick={onOpen} {...buttonProps}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Coupon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this coupon and associated promo codes?
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              isLoading={isLoading}
              onClick={async () => {
                await deleteCoupon(couponId);
                onClose();
              }}
            >
              Yes, delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
