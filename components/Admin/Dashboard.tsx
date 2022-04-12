import { Button, ButtonGroup, Container, Flex, Icon } from '@chakra-ui/react';
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
  const [page, setPage] = useState<'users' | 'orders' | 'teeth' | 'rings'>(
    'orders'
  );
  return (
    <Container maxW='container.xl'>
      <Flex py={4}>
        <ButtonGroup isAttached size='sm' colorScheme='red'>
          <Button
            variant={page === 'users' ? 'solid' : 'outline'}
            leftIcon={<Icon as={FaUser} />}
            onClick={() => setPage('users')}
          >
            Customers
          </Button>
          <Button
            variant={page === 'orders' ? 'solid' : 'outline'}
            leftIcon={<Icon as={FaBox} />}
            onClick={() => setPage('orders')}
          >
            Orders
          </Button>
          {mode === 'GRILLZ' && (
            <Button
              variant={page === 'teeth' ? 'solid' : 'outline'}
              leftIcon={<Icon as={FaTooth} />}
              onClick={() => setPage('teeth')}
            >
              Teeth
            </Button>
          )}
          {mode === 'RING' && (
            <Button
              variant={page === 'rings' ? 'solid' : 'outline'}
              leftIcon={<Icon as={GiRing} />}
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
    </Container>
  );
};

export default Dashboard;
