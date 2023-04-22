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
import { OrderType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import LogoutButton from '../../components/Account/LogoutButton';
import DarkModeSwitch from '../../components/UI/DarkModeSwitch';
import { FullUser } from '../../types';
import Navigation from '../Navigation';

interface Props {
  mode: OrderType;
  user?: FullUser;
}

const DrGrillzLogo = () => (
  <Image
    alt='Dr Grillz'
    height={75}
    src='https://drgrillz.com/wp-content/uploads/2020/12/dr-grillz-transparent.png'
    width={92}
  />
);

const RingKingzLogo = () => <Image alt='Ring Kingz' p={2} src='/logo.svg' w='120px' />;

function Header({ mode, user }: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDark = useColorModeValue(false, true);
  const { data: sessionData } = useSession();

  return (
    <Box pos='relative'>
      {mode === 'GRILLZ' && (
        <>
          <Box
            bgImage='url(https://drgrillz.com/wp-content/uploads/2020/12/Banner-Photo-4.jpg)'
            bgPosition='center'
            bgRepeat='no-repeat'
            bgSize='cover'
            h='100%'
            left={0}
            pos='absolute'
            top={0}
            w='100%'
            zIndex={-2}
          />
          <Box
            bgColor={isDark ? 'rgb(33, 35, 41)' : 'rgb(243,245,251)'}
            h='100%'
            left={0}
            opacity={0.72}
            pos='absolute'
            top={0}
            w='100%'
            zIndex={-1}
          />
        </>
      )}
      <Container maxW='container.xl'>
        <Flex
          alignItems='center'
          as='header'
          flexDir={{ base: 'row-reverse', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
        >
          {!isMobile && (
            <Flex alignItems='center' mr='auto'>
              <Tooltip hasArrow label='Back home' placement='bottom'>
                <Link href={process.env.NEXT_PUBLIC_HOME_URL} target='_blank'>
                  {mode === 'GRILLZ' ? <DrGrillzLogo /> : <RingKingzLogo />}
                </Link>
              </Tooltip>
              {mode === 'GRILLZ' && (
                <>
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
                </>
              )}
            </Flex>
          )}
          <Navigation user={user} />
          {sessionData && <LogoutButton />}
          <DarkModeSwitch />
          {isMobile && (
            <Box mr='auto'>
              <Tooltip hasArrow label='Back home' placement='bottom'>
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
