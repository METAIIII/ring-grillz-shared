import { useRouter } from 'next/router';
import { Button, Flex, Icon } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { FaBox, FaTicketAlt, FaTooth, FaUser } from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';

export function AdminNavigation({ mode }: { mode: OrderType }) {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <Flex alignItems='center' flexWrap='wrap' gap={2} py={4}>
      <Button
        colorScheme={isActive('/admin/orders') ? 'yellow' : 'gray'}
        leftIcon={<Icon as={FaBox} />}
        size='sm'
        variant={isActive('/admin/orders') ? 'solid' : 'outline'}
        onClick={() => router.push('/admin/orders')}
      >
        Orders
      </Button>
      <Button
        colorScheme={isActive('/admin/products') ? 'yellow' : 'gray'}
        leftIcon={<Icon as={mode === 'GRILLZ' ? FaTooth : GiRing} />}
        size='sm'
        variant={isActive('/admin/products') ? 'solid' : 'outline'}
        onClick={() => router.push('/admin/products')}
      >
        Products
      </Button>
      <Button
        colorScheme={isActive('/admin/users') ? 'yellow' : 'gray'}
        leftIcon={<Icon as={FaUser} />}
        size='sm'
        variant={isActive('/admin/users') ? 'solid' : 'outline'}
        onClick={() => router.push('/admin/users')}
      >
        Customers
      </Button>
      <Button
        colorScheme={isActive('/admin/coupons') ? 'yellow' : 'gray'}
        leftIcon={<Icon as={FaTicketAlt} />}
        size='sm'
        variant={isActive('/admin/coupons') ? 'solid' : 'outline'}
        onClick={() => router.push('/admin/coupons')}
      >
        Coupons
      </Button>
    </Flex>
  );
}
