import { Box, Button, ButtonGroup, Flex, Icon } from '@chakra-ui/react';
import { Order, OrderType, User } from '@prisma/client';
import { useState } from 'react';
import { FaBox, FaTicketAlt, FaTooth, FaUser } from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';
import { FullCoupon } from 'shared/types';

import { CouponList } from './Coupons/CouponList';
import { CreateCouponForm } from './Coupons/CreateCoupon';
import { OrdersTable } from './Orders/OrdersTable';
import { UsersTable } from './Users/UsersTable';

interface DashboardProps {
  mode: OrderType;
  orders: Order[];
  users: User[];
  coupons: FullCoupon[];
  grillzDataComponent?: React.ReactNode;
  ringDataComponent?: React.ReactNode;
}

type DashboardTab = 'users' | 'orders' | 'coupons' | 'materials' | 'rings';

function Dashboard({
  mode,
  orders,
  users,
  coupons,
  ringDataComponent,
  grillzDataComponent,
}: DashboardProps) {
  const [tab, setTab] = useState<DashboardTab>('orders');

  return (
    <Box p={4}>
      <ButtonGroup isAttached my={4} size='sm'>
        <Button
          _dark={{ color: tab === 'users' ? 'gray.50' : 'gray.500' }}
          _light={{ color: tab === 'users' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaUser} />}
          variant={tab === 'users' ? 'solid' : 'outline'}
          onClick={() => setTab('users')}
        >
          Customers
        </Button>
        <Button
          _dark={{ color: tab === 'orders' ? 'gray.50' : 'gray.500' }}
          _light={{ color: tab === 'orders' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaBox} />}
          variant={tab === 'orders' ? 'solid' : 'outline'}
          onClick={() => setTab('orders')}
        >
          Orders
        </Button>
        <Button
          _dark={{ color: tab === 'coupons' ? 'gray.50' : 'gray.500' }}
          _light={{ color: tab === 'coupons' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaTicketAlt} />}
          variant={tab === 'coupons' ? 'solid' : 'outline'}
          onClick={() => setTab('coupons')}
        >
          Coupons
        </Button>
        {mode === 'GRILLZ' && (
          <Button
            _dark={{ color: tab === 'materials' ? 'gray.50' : 'gray.500' }}
            _light={{ color: tab === 'materials' ? 'gray.900' : 'gray.500' }}
            leftIcon={<Icon as={FaTooth} />}
            variant={tab === 'materials' ? 'solid' : 'outline'}
            onClick={() => setTab('materials')}
          >
            Materials
          </Button>
        )}
        {mode === 'RING' && (
          <Button
            _dark={{ color: tab === 'rings' ? 'gray.50' : 'gray.500' }}
            _light={{ color: tab === 'rings' ? 'gray.900' : 'gray.500' }}
            leftIcon={<Icon as={GiRing} />}
            variant={tab === 'rings' ? 'solid' : 'outline'}
            onClick={() => setTab('rings')}
          >
            Rings
          </Button>
        )}
      </ButtonGroup>
      {tab === 'users' && <UsersTable users={users} />}
      {tab === 'orders' && <OrdersTable orders={orders} />}
      {tab === 'coupons' && (
        <Flex alignItems='flex-start' flexDir={{ base: 'column', lg: 'row' }} gap={6}>
          <CreateCouponForm flex={1} maxW='96' mr={4} />
          <CouponList coupons={coupons} />
        </Flex>
      )}
      {tab === 'materials' && <>{grillzDataComponent}</>}
      {tab === 'rings' && <>{ringDataComponent}</>}
    </Box>
  );
}

export default Dashboard;
