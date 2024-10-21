import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { FaBars } from 'react-icons/fa';

import NavigationItem from './navigation-item';

function Navigation() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return isMobile ? (
    <>
      <IconButton
        aria-label='menu'
        colorScheme='yellow'
        icon={<Icon as={FaBars} />}
        size='lg'
        variant='outline'
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgColor='gray.900' borderLeftColor='yellow.500' borderLeftWidth={1} px={4}>
          <DrawerCloseButton color='yellow.300' right={4} size='lg' top={4} />
          <Box pt={20} px={4}>
            <NavigationItems />
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <NavigationItems />
  );
}

function NavigationItems() {
  const { data } = useSession();
  const isAdmin = data?.user?.role === 'ADMIN';

  return (
    <Stack alignItems='flex-end' direction={{ base: 'column', md: 'row' }} mr={{ base: 0, md: 4 }}>
      {isAdmin && <NavigationItem isAdmin href='/admin/orders' label='Admin' />}
      <NavigationItem href='/' label='Create' />
      <NavigationItem
        href={data?.user ? '/account' : '/auth/signin'}
        label={data?.user ? 'My Account' : 'Login'}
      />
    </Stack>
  );
}

export default Navigation;
