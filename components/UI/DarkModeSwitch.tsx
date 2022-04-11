import { Icon, IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      aria-label={isDark ? "Light Mode" : "Dark Mode"}
      onClick={toggleColorMode}
      icon={<Icon as={isDark ? FaSun : FaMoon} />}
      size="sm"
      variant="ghost"
      colorScheme="yellow"
      mx={2}
    />
  );
};

export default DarkModeSwitch;
