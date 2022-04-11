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
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

/* eslint-disable react-hooks/exhaustive-deps */
const DeleteAccount: React.FC<{
  email: string;
  isOpen: boolean;
  onClose(): void;
}> = ({ isOpen, onClose, email }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/user/${email}`);
      await signOut();
      setLoading(false);
      setSuccess('Deleted user.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 3000);
    }
  }, [success]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalBody>
          <Text mb={2}>
            Deleting your account will log you out and permanently remove access
            to your order history. If you log in to this website again, a new
            user account will be created.
          </Text>
          <Text textColor='red.400'></Text>
          {error && error}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              colorScheme='red'
              onClick={handleDelete}
              isLoading={loading}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAccount;
