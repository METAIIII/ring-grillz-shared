import Image from 'next/image';
import { Box, Container, Flex, Heading, Link, Tooltip, useBreakpointValue } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { useSession } from 'next-auth/react';

import SignOutButton from '../my-account/signout-button';
import ThemeToggle from '../theme-toggle';
import Navigation from './navigation';

interface Props {
  mode: OrderType;
}

function DrGrillzLogo() {
  return (
    <Image
      alt='Dr Grillz'
      height={75}
      src='https://drgrillz.com/wp-content/uploads/2020/12/dr-grillz-transparent.png'
      width={92}
    />
  );
}

function RingKingzLogo() {
  return <Image alt='Ring Kingz' src='/logo.svg' width={120} />;
}

function Header({ mode }: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: sessionData } = useSession();

  return (
    <Box
      _dark={{ bgColor: 'rgb(0,0,0)', borderColor: 'gray.900' }}
      _light={{ bgColor: 'rgb(241, 242, 244)', borderColor: 'gray.100' }}
      borderBottomWidth={1}
      pos='relative'
    >
      <Container maxW='container.xl'>
        <Flex
          alignItems='center'
          as='header'
          flexDir={{ base: 'row-reverse', md: 'row' }}
          gap={4}
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
        >
          {!isMobile && (
            <Flex alignItems='center' mr='auto'>
              <Tooltip label='Back home' placement='bottom'>
                <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
                  {mode === 'GRILLZ' ? <DrGrillzLogo /> : <RingKingzLogo />}
                </Link>
              </Tooltip>
              {mode === 'GRILLZ' && (
                <>
                  <Heading fontFamily='cursive' fontWeight={600} ml={3}>
                    CUSTOM
                  </Heading>
                  <Heading letterSpacing='2.7px' ml={2}>
                    GRILLZ BUILDER
                  </Heading>
                </>
              )}
            </Flex>
          )}
          <Navigation />
          {sessionData && <SignOutButton />}
          <ThemeToggle />
          {isMobile && (
            <Box mr='auto'>
              <Tooltip label='Back home' placement='bottom'>
                <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
                  {mode === 'GRILLZ' ? <DrGrillzLogo /> : <RingKingzLogo />}
                </Link>
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default Header;
