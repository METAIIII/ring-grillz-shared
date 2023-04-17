import { Box, Button, ButtonGroup, Flex, Icon } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import { FaBox, FaTicketAlt, FaTooth, FaUser } from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';

import { useRouter } from 'next/router';
import CouponList from './Coupons/CouponList';
import { CreateCoupon } from './Coupons/CreateCoupon';
import OrdersTable from './Orders/OrdersTable';
import UsersTable from './Users/UsersTable';

interface DashboardProps {
  mode: OrderType;
  grillzDataComponent?: React.ReactNode;
  ringDataComponent?: React.ReactNode;
}

type DashboardTabs = 'users' | 'orders' | 'coupons' | 'materials' | 'rings';

const Dashboard: React.FC<DashboardProps> = ({ mode, ringDataComponent, grillzDataComponent }) => {
  const router = useRouter();
  const validTabs = ['users', 'orders', 'coupons', 'materials', 'rings'];
  const tab = router.query.tab as DashboardTabs | '';

  useEffect(() => {
    if (tab && validTabs.includes(tab)) {
      router.replace(`?tab=${tab}`);
    } else {
      router.replace('?tab=orders');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.tab]);

  const page = useMemo(() => {
    return tab;
  }, [tab]);

  const setPage = (tab: DashboardTabs) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <Box p={4}>
      <ButtonGroup isAttached my={4} size='sm'>
        <Button
          _dark={{ color: page === 'users' ? 'gray.50' : 'gray.500' }}
          _light={{ color: page === 'users' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaUser} />}
          variant={page === 'users' ? 'solid' : 'outline'}
          onClick={() => setPage('users')}
        >
          Customers
        </Button>
        <Button
          _dark={{ color: page === 'orders' ? 'gray.50' : 'gray.500' }}
          _light={{ color: page === 'orders' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaBox} />}
          variant={page === 'orders' ? 'solid' : 'outline'}
          onClick={() => setPage('orders')}
        >
          Orders
        </Button>
        <Button
          _dark={{ color: page === 'coupons' ? 'gray.50' : 'gray.500' }}
          _light={{ color: page === 'coupons' ? 'gray.900' : 'gray.500' }}
          leftIcon={<Icon as={FaTicketAlt} />}
          variant={page === 'coupons' ? 'solid' : 'outline'}
          onClick={() => setPage('coupons')}
        >
          Coupons
        </Button>
        {mode === 'GRILLZ' && (
          <Button
            _dark={{ color: page === 'materials' ? 'gray.50' : 'gray.500' }}
            _light={{ color: page === 'materials' ? 'gray.900' : 'gray.500' }}
            leftIcon={<Icon as={FaTooth} />}
            variant={page === 'materials' ? 'solid' : 'outline'}
            onClick={() => setPage('materials')}
          >
            Materials
          </Button>
        )}
        {mode === 'RING' && (
          <Button
            _dark={{ color: page === 'rings' ? 'gray.50' : 'gray.500' }}
            _light={{ color: page === 'rings' ? 'gray.900' : 'gray.500' }}
            leftIcon={<Icon as={GiRing} />}
            variant={page === 'rings' ? 'solid' : 'outline'}
            onClick={() => setPage('rings')}
          >
            Rings
          </Button>
        )}
      </ButtonGroup>
      {page === 'users' && <UsersTable />}
      {page === 'orders' && <OrdersTable />}
      {page === 'coupons' && (
        <Flex alignItems='flex-start'>
          <CreateCoupon mr={4} />
          <CouponList />
        </Flex>
      )}
      {page === 'materials' && <>{grillzDataComponent}</>}
      {page === 'rings' && <>{ringDataComponent}</>}
    </Box>
  );
};

export default Dashboard;
