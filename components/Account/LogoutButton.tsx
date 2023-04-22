import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { BiLogOutCircle } from 'react-icons/bi';

interface Props {
  onLogout?: () => void;
}

function LogoutButton({ onLogout }: Props) {
  return (
    <Tooltip label='Logout'>
      <IconButton
        aria-label='Logout'
        colorScheme='yellow'
        icon={<Icon as={BiLogOutCircle} />}
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
