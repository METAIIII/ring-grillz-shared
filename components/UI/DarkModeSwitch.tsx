import { Icon, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { BsMoonStarsFill, BsSun } from 'react-icons/bs';

const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <Tooltip label={`${isDark ? 'Light' : 'Dark'} mode`}>
      <IconButton
        aria-label={isDark ? 'Light Mode' : 'Dark Mode'}
        onClick={toggleColorMode}
        icon={<Icon as={isDark ? BsSun : BsMoonStarsFill} />}
        size='sm'
        variant='ghost'
        colorScheme='yellow'
        mx={2}
      />
    </Tooltip>
  );
};

export default DarkModeSwitch;
