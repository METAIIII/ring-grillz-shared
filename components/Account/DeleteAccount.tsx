import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { useSuccessFailToast } from '../../hooks/use-toast';
import { useDeleteUserMutation } from '../../reducers/api';

function DeleteAccount({
  isOpen,
  onClose,
  email,
}: {
  email: string;
  isOpen: boolean;
  onClose(): void;
}) {
  const [deleteUser, { isError, isLoading, isSuccess }] = useDeleteUserMutation();

  useSuccessFailToast({
    isSuccess,
    isFail: isError,
    successMessage: 'Account deleted',
    failMessage: 'There was an error deleting your account',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalBody>
          <Text mb={2}>
            Deleting your account will log you out and permanently remove access to your order
            history. If you log in to this website again, a new user account will be created.
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme='red' isLoading={isLoading} onClick={() => deleteUser(email)}>
              Delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteAccount;
