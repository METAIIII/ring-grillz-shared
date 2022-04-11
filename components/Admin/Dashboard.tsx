import { Button, ButtonGroup, Flex, Icon } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { useState } from 'react';
import { FaBox, FaTooth, FaUser } from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';

import RingsTable from './Data/RingsTable';
import TeethTable from './Data/TeethTable';
import OrdersTable from './Orders/OrdersTable';
import UsersTable from './Users/UsersTable';

interface DashboardProps {
  mode: OrderType;
}

const Dashboard: React.FC<DashboardProps> = ({ mode }) => {
  const [page, setPage] = useState<'users' | 'orders' | 'teeth' | 'rings'>('orders');
  return (
    <>
      <Flex py={4}>
        <ButtonGroup isAttached colorScheme='red' size='sm'>
          <Button
            leftIcon={<Icon as={FaUser} />}
            variant={page === 'users' ? 'solid' : 'outline'}
            onClick={() => setPage('users')}
          >
            Customers
          </Button>
          <Button
            leftIcon={<Icon as={FaBox} />}
            variant={page === 'orders' ? 'solid' : 'outline'}
            onClick={() => setPage('orders')}
          >
            Orders
          </Button>
          {mode === 'GRILLZ' && (
            <Button
              leftIcon={<Icon as={FaTooth} />}
              variant={page === 'teeth' ? 'solid' : 'outline'}
              onClick={() => setPage('teeth')}
            >
              Grillz
            </Button>
          )}
          {mode === 'RING' && (
            <Button
              leftIcon={<Icon as={GiRing} />}
              variant={page === 'rings' ? 'solid' : 'outline'}
              onClick={() => setPage('rings')}
            >
              Rings
            </Button>
          )}
        </ButtonGroup>
      </Flex>
      {page === 'users' && <UsersTable />}
      {page === 'orders' && <OrdersTable />}
      {page === 'teeth' && <TeethTable />}
      {page === 'rings' && <RingsTable />}
    </>
  );
};

export default Dashboard;
