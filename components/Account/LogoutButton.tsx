import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

import { Icon, IconButton, Tooltip } from '@chakra-ui/react';

const LogoutButton = () => {
  return (
    <Tooltip label='Logout'>
      <IconButton
        aria-label='Logout'
        icon={<Icon as={FaSignOutAlt} />}
        onClick={() => signOut()}
        size='sm'
        variant='ghost'
        colorScheme='yellow'
        mx={2}
      />
    </Tooltip>
  );
};

export default LogoutButton;
