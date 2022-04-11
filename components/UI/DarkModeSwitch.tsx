import { Icon, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { BsMoonStarsFill, BsSun } from 'react-icons/bs';

const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <Tooltip label={`${isDark ? 'Light' : 'Dark'} mode`}>
      <IconButton
        aria-label={isDark ? 'Light Mode' : 'Dark Mode'}
        colorScheme='yellow'
        icon={<Icon as={isDark ? BsSun : BsMoonStarsFill} />}
        mx={2}
        size='sm'
        variant='ghost'
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
};

export default DarkModeSwitch;
