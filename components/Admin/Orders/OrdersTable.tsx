import { Button, ButtonGroup, Card, CardBody, FormLabel, Icon, Link } from '@chakra-ui/react';
import { Order, OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { CgExternal } from 'react-icons/cg';
import { CellProps, Column, Renderer } from 'react-table';

import { formatAmountForDisplay } from '../../../utils/stripe-helpers';
import OrderStatusBadge from '../../Order/OrderStatusBadge';
import PaginatedTable from '../../UI/Table';
import MarkAsShipped from './MarkAsShipped';

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [status, setStatus] = useState<OrderStatus>('PAID');

  const renderCreatedAtCell: Renderer<CellProps<Order>> = ({ value }) => (
    <>{dayjs(value).format('L')}</>
  );
  const renderEmailCell: Renderer<CellProps<Order>> = ({ value, row }) => (
    <Link href={`/admin/user/${row.original.email}`}>{value}</Link>
  );
  const renderAmountCell: Renderer<CellProps<Order>> = ({ value }) => (
    <>{formatAmountForDisplay(value)}</>
  );
  const renderStatusCell: Renderer<CellProps<Order>> = ({ value }) => (
    <OrderStatusBadge orderStatus={value} />
  );
  const renderDetailsCell: Renderer<CellProps<Order>> = ({ value, row }) => (
    <ButtonGroup size='sm' variant='outline'>
      <NextLink href={`/receipt?order_id=${value}`}>
        <Button colorScheme='red' rightIcon={<Icon as={CgExternal} />}>
          Details
        </Button>
      </NextLink>
      {row.original.status === 'PAID' && <MarkAsShipped order={row.original} />}
    </ButtonGroup>
  );

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: renderCreatedAtCell,
      },
      {
        Header: 'Customer',
        accessor: 'email',
        Cell: renderEmailCell,
      },
      {
        Header: 'Amount',
        accessor: 'paymentAmount',
        Cell: renderAmountCell,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: renderStatusCell,
      },
      {
        Header: '',
        accessor: 'id',
        Cell: renderDetailsCell,
      },
    ],
    [],
  );

  return (
    <Card>
      <CardBody>
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
            colorScheme='yellow'
            variant={status === 'PENDING' ? 'solid' : 'outline'}
            onClick={() => setStatus('PENDING')}
          >
            Pending
          </Button>
          <Button
            colorScheme='blue'
            variant={status === 'SHIPPED' ? 'solid' : 'outline'}
            onClick={() => setStatus('SHIPPED')}
          >
            Shipped
          </Button>
          <Button
            colorScheme='red'
            variant={status === 'CANCELED' ? 'solid' : 'outline'}
            onClick={() => setStatus('CANCELED')}
          >
            Canceled
          </Button>
        </ButtonGroup>
        <PaginatedTable<Order>
          colorScheme='red'
          columns={columns}
          data={orders}
          filters={[{ key: 'status', value: status }]}
        />
      </CardBody>
    </Card>
  );
}
