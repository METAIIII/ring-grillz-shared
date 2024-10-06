import { Icon, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { BsMoonFill, BsSun } from 'react-icons/bs';

function DarkModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <Tooltip label={`${isDark ? 'Light' : 'Dark'} mode`}>
      <IconButton
        aria-label={isDark ? 'Light Mode' : 'Dark Mode'}
        icon={<Icon as={isDark ? BsSun : BsMoonFill} />}
        size='sm'
        variant='ghost'
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
}

export default DarkModeSwitch;
