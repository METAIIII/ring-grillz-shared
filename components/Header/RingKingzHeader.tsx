import { Box, Flex, Image, Link, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import LogoutButton from '../Account/LogoutButton';
import DarkModeSwitch from '../UI/DarkModeSwitch';
import Navigation from './Navigation';

const RingKingzLogo = () => (
  <Image
    alt='Ring Kingz'
    src='/logo.svg'
    w={{ base: '60px', md: '80px' }}
    // scale by 1.1 on hover
    _hover={{
      transform: 'scale(1.1)',
      transition: 'transform 0.3s',
    }}
  />
);

const Header = () => {
  const { data: sessionData } = useSession();
  const isDark = useColorModeValue(false, true);

  return (
    <Flex
      as='header'
      pos='relative'
      flexDir='row'
      alignItems='center'
      justifyContent={{ base: 'flex-start', md: 'flex-end' }}
      h='100px'
      pr='4'
      mb='8'
      boxShadow={
        isDark
          ? '0px 0px 10px 0px rgb(0 0 0 / 50%)'
          : '0px 0px 10px 0px rgb(155 155 155 / 50%)'
      }
    >
      <Box ml='8' mr='auto'>
        <Tooltip label='Back home' placement='bottom' hasArrow>
          <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
            <RingKingzLogo />
          </Link>
        </Tooltip>
      </Box>
      <Navigation />
      {sessionData && <LogoutButton />}
      <DarkModeSwitch />
    </Flex>
  );
};

export default Header;
