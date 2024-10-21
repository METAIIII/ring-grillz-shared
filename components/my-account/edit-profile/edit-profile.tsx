import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { FullUser } from '../../../types';
import { Card } from '../../card/card';
import DeleteAccount from '../delete-account';
import { useEditProfile } from './use-edit-profile';

function EditProfile({ user }: { user: FullUser }) {
  const {
    isAdmin,
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isLoading,
    isOpen,
    onOpen,
    onClose,
    updateUser,
  } = useEditProfile(user);

  return (
    <Card title={`${isAdmin ? 'Customer' : 'My'} Details`}>
      <form onSubmit={handleSubmit((data) => updateUser({ email: user.email ?? '', data }))}>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input {...register('name')} colorScheme='yellow' />
          {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <Input isDisabled colorScheme='yellow' value={user?.email || 'No email'} />
            <Tooltip label={user?.emailVerified ? 'Verified' : 'Not Verified'}>
              <InputRightElement>
                {user?.emailVerified ? (
                  <Icon as={FaCheck} color='yellow.500' />
                ) : (
                  <Icon as={FaTimes} color='red.400' />
                )}
              </InputRightElement>
            </Tooltip>
          </InputGroup>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Street Address</FormLabel>
          <Input {...register('street')} />
          {errors.street && <FormErrorMessage>{errors.street.message}</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Street Address (Line 2)</FormLabel>
          <Input {...register('street2')} />
          {errors.street2 && <FormErrorMessage>{errors.street2.message}</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Suburb</FormLabel>
          <Input {...register('suburb')} />
          {errors.suburb && <FormErrorMessage>{errors.suburb.message}</FormErrorMessage>}
        </FormControl>
        <SimpleGrid columns={2} mb={4} spacing={4}>
          <FormControl>
            <FormLabel>State</FormLabel>
            <Input {...register('state')} />
            {errors.state && <FormErrorMessage>{errors.state.message}</FormErrorMessage>}
          </FormControl>
          <FormControl>
            <FormLabel>Postcode</FormLabel>
            <Input {...register('postcode')} />
            {errors.postcode && <FormErrorMessage>{errors.postcode.message}</FormErrorMessage>}
          </FormControl>
        </SimpleGrid>
        <Flex justifyContent='flex-end' pt={4}>
          <ButtonGroup>
            <Button colorScheme='red' variant='ghost' onClick={onOpen}>
              Delete Account
            </Button>
            <Button colorScheme='yellow' isLoading={isSubmitting || isLoading} type='submit'>
              Save Changes
            </Button>
          </ButtonGroup>
        </Flex>
        {user.email && <DeleteAccount email={user.email} isOpen={isOpen} onClose={onClose} />}
      </form>
    </Card>
  );
}

export default EditProfile;
