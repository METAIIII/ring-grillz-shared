import { useRouter } from 'next/router';
import { useDisclosure } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSuccessFailToast } from '../../../hooks/use-toast';
import { useUpdateUserMutation } from '../../../reducers/api';
import { FullUser } from '../../../types';

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

export function useEditProfile(user: FullUser) {
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

  return {
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
  };
}
