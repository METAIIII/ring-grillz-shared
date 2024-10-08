import { useRouter } from 'next/router';
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
  useDisclosure,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { z } from 'zod';

import { useSuccessFailToast } from '../../hooks/use-toast';
import { useUpdateUserMutation } from '../../reducers/api';
import { FullUser } from '../../types';
import { Card } from '../card';
import DeleteAccount from './DeleteAccount';

const schema = z.object({
  name: z.string(),
  phone: z.string(),
  street: z.string(),
  street2: z.string().optional(),
  suburb: z.string(),
  state: z.enum(['WA', 'NT', 'SA', 'QLD', 'NSW', 'VIC', 'TAS', 'ACT']),
  postcode: z.string(),
  image: z.string().optional(),
  stripeId: z.string().optional(),
});

export type UpdateUser = z.infer<typeof schema>;

function UserInfo({ user }: { user: FullUser }) {
  const { pathname } = useRouter();
  const isAdmin = pathname.includes('admin');

  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUser>({
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      street: user.street || '',
      street2: user.street2 || '',
      suburb: user.suburb || '',
      state: user.state || 'WA',
      postcode: user.postcode || '',
    },
    resolver: zodResolver(schema),
  });

  const [updateUser, { isError, isLoading, isSuccess }] = useUpdateUserMutation();
  useSuccessFailToast({
    isSuccess,
    isFail: isError,
    successMessage: 'Your details have been updated',
    failMessage: 'There was an error updating your details',
  });

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
            <Button colorScheme='red' variant='outline' onClick={onOpen}>
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

export default UserInfo;
