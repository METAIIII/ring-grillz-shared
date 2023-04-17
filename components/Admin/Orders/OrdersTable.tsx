import { Button, ButtonGroup, FormLabel, Icon, Link } from '@chakra-ui/react';
import { Order, OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { CgExternal } from 'react-icons/cg';
import { Column } from 'react-table';

import { useGetOrdersByStatusQuery } from '../../../reducers/api';
import { formatAmountForDisplay } from '../../../utils/stripeHelpers';
import OrderStatusBadge from '../../Order/OrderStatusBadge';
import { Panel } from '../../UI/Panel';
import PaginatedTable from '../../UI/Table';
import MarkAsShipped from './MarkAsShipped';

const Orders = () => {
  const [status, setStatus] = useState<OrderStatus>('PAID');
  const { data } = useGetOrdersByStatusQuery(status);

  const orderData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ value }) => <>{dayjs(value).format('L')}</>,
      },
      {
        Header: 'Customer',
        accessor: 'email',
        Cell: ({ value, row }) => <Link href={`/admin/user/${row.original.userId}`}>{value}</Link>,
      },
      {
        Header: 'Amount',
        accessor: 'paymentAmount',
        Cell: ({ value }) => <>{formatAmountForDisplay(value)}</>,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <OrderStatusBadge orderStatus={value} />,
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value, row }) => {
          return (
            <ButtonGroup size='sm' variant='outline'>
              {row.original.status === 'PAID' && <MarkAsShipped order={row.original} />}
              <NextLink href={`/admin/order/${value}`}>
                <Button colorScheme='red' rightIcon={<Icon as={CgExternal} />}>
                  Details
                </Button>
              </NextLink>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  return (
    <Panel>
      <FormLabel fontWeight='bold' mb={1}>
        Filter results
      </FormLabel>
      <ButtonGroup mb={4} size='xs'>
        <Button
          colorScheme='green'
          variant={status === 'PAID' ? 'solid' : 'outline'}
          onClick={() => setStatus('PAID')}
        >
          Paid
        </Button>
        <Button
          colorScheme='blue'
          variant={status === 'SHIPPED' ? 'solid' : 'outline'}
          onClick={() => setStatus('SHIPPED')}
        >
          Shipped
        </Button>
        <Button
          colorScheme='yellow'
          variant={status === 'PENDING' ? 'solid' : 'outline'}
          onClick={() => setStatus('PENDING')}
        >
          Pending
        </Button>
        <Button
          colorScheme='red'
          variant={status === 'CANCELED' ? 'solid' : 'outline'}
          onClick={() => setStatus('CANCELED')}
        >
          Canceled
        </Button>
      </ButtonGroup>
      <PaginatedTable<Order> colorScheme='red' columns={columns} data={orderData} />
    </Panel>
  );
};

export default Orders;
