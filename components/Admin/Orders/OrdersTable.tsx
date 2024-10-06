import {
  Box,
  Button,
  ButtonGroup,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
} from '@chakra-ui/react';
import { Order, OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { CellProps, Column, Renderer } from 'react-table';
import { useGetOrdersQuery } from 'shared/reducers/api';

import { formatAmountForDisplay } from '../../../utils/stripe-helpers';
import { Card } from '../../card';
import OrderStatusBadge from '../../Order/OrderStatusBadge';
import PaginatedTable from '../../UI/paginated-table';
import MarkAsShipped from './MarkAsShipped';

export function OrdersTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus>('PAID');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching } = useGetOrdersQuery({
    pageIndex,
    pageSize,
    filters: [
      { key: 'status', value: status, operation: 'equals' },
      { key: 'email', value: search, operation: 'contains' },
    ],
    sortBy: [{ key: 'createdAt', order: 'desc' }],
  });

  const orders = useMemo<Order[]>(() => {
    if (!data) return [];
    if (!data.data) return [];
    return data.data.orders;
  }, [data]);

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
  const renderActionsCell: Renderer<CellProps<Order>> = ({ value, row }) => (
    <Box textAlign='right'>
      <ButtonGroup size='sm'>
        <NextLink href={`/receipt?order_id=${value}`}>
          <Button>View Receipt</Button>
        </NextLink>
        {(row.original.status === 'PAID' || row.original.status === 'SHIPPED') && (
          <MarkAsShipped order={row.original} />
        )}
      </ButtonGroup>
    </Box>
  );

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: 'Status',
        accessor: 'status',
        Cell: renderStatusCell,
      },
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
        Header: '',
        accessor: 'id',
        Cell: renderActionsCell,
      },
    ],
    [],
  );

  return (
    <Card isLoading={isLoading || isFetching}>
      <FormLabel fontWeight='bold' mb={1}>
        Filter results
      </FormLabel>
      <InputGroup mb={2} size='sm'>
        <InputLeftElement>
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input
          borderRadius={6}
          placeholder='Search by email'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <ButtonGroup mb={4} size='xs'>
        <Button
          colorScheme={status === 'PAID' ? 'green' : 'gray'}
          variant={status === 'PAID' ? 'solid' : 'outline'}
          onClick={() => setStatus('PAID')}
        >
          Paid
        </Button>
        <Button
          colorScheme={status === 'PENDING' ? 'yellow' : 'gray'}
          variant={status === 'PENDING' ? 'solid' : 'outline'}
          onClick={() => setStatus('PENDING')}
        >
          Pending
        </Button>
        <Button
          colorScheme={status === 'SHIPPED' ? 'blue' : 'gray'}
          variant={status === 'SHIPPED' ? 'solid' : 'outline'}
          onClick={() => setStatus('SHIPPED')}
        >
          Shipped
        </Button>
        <Button
          colorScheme={status === 'CANCELED' ? 'red' : 'gray'}
          variant={status === 'CANCELED' ? 'solid' : 'outline'}
          onClick={() => setStatus('CANCELED')}
        >
          Canceled
        </Button>
      </ButtonGroup>
      <PaginatedTable<Order>
        columns={columns}
        data={orders}
        filters={[{ key: 'status', value: status, operation: 'equals' }]}
        isLoading={isLoading || isFetching}
        pageCount={data?.data?.pageCount || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </Card>
  );
}
