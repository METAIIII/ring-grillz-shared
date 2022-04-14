import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { BiLogOutCircle } from 'react-icons/bi';

const LogoutButton = () => {
  return (
    <Tooltip label='Logout'>
      <IconButton
        aria-label='Logout'
        icon={<Icon as={BiLogOutCircle} />}
        onClick={() => signOut()}
        size='sm'
        variant='ghost'
        colorScheme='yellow'
      />
    </Tooltip>
  );
};

export default LogoutButton;
