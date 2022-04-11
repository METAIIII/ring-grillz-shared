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
import { useContext } from 'react';
import { FaBars } from 'react-icons/fa';

import useUser from '../../hooks/useUser';
import { LayoutContext } from '../Layout';
import NavigationItem from './NavigationItem';

const Navigation = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return isMobile ? (
    <>
      <IconButton
        aria-label='menu'
        onClick={onOpen}
        icon={<Icon as={FaBars} />}
        size='lg'
        variant='outline'
        colorScheme='yellow'
      />
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          bgColor='gray.900'
          borderLeftWidth={1}
          borderLeftColor='yellow.500'
          px={4}
        >
          <DrawerCloseButton color='yellow.300' size='lg' top={4} right={4} />
          <Box pt={20} px={4}>
            <NavigationItems />
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <NavigationItems />
  );
};

const NavigationItems = () => {
  const user = useUser();
  const { mode } = useContext(LayoutContext);

  return (
    <Stack direction={{ base: 'column', md: 'row' }} alignItems='flex-end'>
      {user?.role === 'ADMIN' && (
        <NavigationItem href='/admin' label='Admin' isAdmin />
      )}
      <NavigationItem href='/' label='Create' />
      {mode === 'RING' && <NavigationItem href='/preset' label='Presets' />}
      <NavigationItem
        href={user ? '/account' : '/api/auth/signin'}
        label={user ? 'My Account' : 'Login'}
      />
    </Stack>
  );
};

export default Navigation;
