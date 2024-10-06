import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

interface Props {
  onLogout?: () => void;
}

function LogoutButton({ onLogout }: Props) {
  return (
    <Tooltip label='Logout'>
      <IconButton
        aria-label='Logout'
        icon={<Icon as={FaSignOutAlt} />}
        size='sm'
        variant='ghost'
        onClick={() => {
          onLogout && onLogout();
          signOut();
        }}
      />
    </Tooltip>
  );
}

export default LogoutButton;
