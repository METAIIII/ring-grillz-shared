import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import LogoutButton from '../../components/Account/LogoutButton';
import DarkModeSwitch from '../../components/UI/DarkModeSwitch';
import Navigation from './Navigation';

const DrGrillzLogo = () => (
  <Image
    src='https://drgrillz.com/wp-content/uploads/2020/12/dr-grillz-transparent.png'
    alt='Dr Grillz'
    width={92}
    height={75}
  />
);

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDark = useColorModeValue(false, true);
  const { data: sessionData } = useSession();

  return (
    <Box pos='relative'>
      <Box
        pos='absolute'
        top={0}
        left={0}
        w='100%'
        h='100%'
        bgImage='url(https://drgrillz.com/wp-content/uploads/2020/12/Banner-Photo-4.jpg)'
        bgSize='cover'
        bgRepeat='no-repeat'
        bgPosition='center'
        zIndex={-2}
      />
      <Box
        pos='absolute'
        top={0}
        left={0}
        w='100%'
        h='100%'
        bgColor={isDark ? 'rgb(33, 35, 41)' : 'rgb(243,245,251)'}
        opacity={0.72}
        zIndex={-1}
      />
      <Container maxW='container.xl'>
        <Flex
          as='header'
          flexDir={{ base: 'row-reverse', md: 'row' }}
          alignItems='center'
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          pr={4}
        >
          {!isMobile && (
            <Flex
              flex={1}
              alignItems='center'
              justifyContent='flex-start'
              mr='auto'
            >
              <Tooltip label='Back home' placement='bottom' hasArrow>
                <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
                  <DrGrillzLogo />
                </Link>
              </Tooltip>

              <Heading fontFamily='cursive' fontWeight={600} ml={3}>
                CUSTOM
              </Heading>
              <Heading
                ml={2}
                style={{
                  letterSpacing: '2.7px',
                }}
              >
                GRILLZ BUILDER
              </Heading>
            </Flex>
          )}
          <Navigation />
          {sessionData && <LogoutButton />}
          <DarkModeSwitch />
          {isMobile && (
            <Box mr='auto'>
              <Tooltip label='Back home' placement='bottom' hasArrow>
                <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
                  <DrGrillzLogo />
                </Link>
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
