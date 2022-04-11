import { Button, ButtonGroup, Icon, Link, Text } from '@chakra-ui/react';
import { Order, OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { CgExternal } from 'react-icons/cg';
import { Column } from 'react-table';
import useSWR from 'swr';

import { OrdersResponse } from '../../../types/apiResponses';
import AsyncCheckoutLink from '../../../utils/AsyncCheckoutLink';
import fetcher from '../../../utils/axiosFetcher';
import { formatAmountForDisplay } from '../../../utils/stripeHelpers';
import OrderStatusBadge from '../../Order/OrderStatusBadge';
import PaginatedTable from '../../UI/Table';
import MarkAsShipped from './MarkAsShipped';

/* eslint-disable react/jsx-key */
const Orders = () => {
  const [status, setStatus] = useState<OrderStatus>('PAID');
  const { data } = useSWR<OrdersResponse>(
    `/api/order?status=${status}`,
    fetcher
  );

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
        Cell: ({ value, row }) => (
          <Link href={`/admin/user/${row.original.userId}`}>{value}</Link>
        ),
      },
      {
        Header: 'Amount',
        accessor: 'total',
        Cell: ({ value }) => <>{formatAmountForDisplay(value)}</>,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <OrderStatusBadge orderStatus={value} />,
      },
      {
        Header: 'Stripe ID',
        accessor: 'stripeId',
        Cell: ({ value }) => {
          return (
            <>
              {!!value && (
                <AsyncCheckoutLink checkoutId={value}>
                  {value.substring(0, 10)}...
                </AsyncCheckoutLink>
              )}
            </>
          );
        },
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value, row }) => {
          return (
            <ButtonGroup size='sm' variant='outline'>
              <MarkAsShipped order={row.original} />
              <NextLink
                legacyBehavior
                passHref
                href={`/receipt?order_id=${value}`}
              >
                <Button
                  as='a'
                  colorScheme='red'
                  rightIcon={<Icon as={CgExternal} />}
                >
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

  return _.isArray(orderData) ? (
    <>
      <Text fontWeight='bold'>Filter results</Text>
      <ButtonGroup colorScheme='red' mb={4} size='xs'>
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
          variant={status === 'CANCELED' ? 'solid' : 'outline'}
          onClick={() => setStatus('CANCELED')}
        >
          Canceled
        </Button>
      </ButtonGroup>
      <PaginatedTable<Order>
        colorScheme='red'
        columns={columns}
        data={orderData}
      />
    </>
  ) : (
    <div />
  );
};

export default Orders;
