import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, ButtonGroup, Link } from '@chakra-ui/react';
import { Order, OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { CellProps, Column, Renderer } from 'react-table';

import { useGetOrdersQuery } from '../../../../reducers/api';
import { formatAmountForDisplay } from '../../../../utils/stripe-helpers';
import OrderStatusBadge from '../../../order/order-status-badge';
import MarkAsShipped from '../mark-as-shipped';

const renderCreatedAtCell: Renderer<CellProps<Order>> = ({ value }) => (
  <>{dayjs(value).format('L')} </>
);
const renderEmailCell: Renderer<CellProps<Order>> = ({ value, row }) => (
  <Link href={`/admin/user/${row.original.email}`}> {value} </Link>
);
const renderAmountCell: Renderer<CellProps<Order>> = ({ value }) => (
  <>{formatAmountForDisplay(value)} </>
);
const renderStatusCell: Renderer<CellProps<Order>> = ({ value }) => (
  <OrderStatusBadge orderStatus={value} />
);
const renderActionsCell: Renderer<CellProps<Order>> = ({ value, row }) => (
  <Box textAlign='right'>
    <ButtonGroup size='sm'>
      <NextLink href={`/receipt?order_id=${value}`}>
        <Button>View Receipt </Button>
      </NextLink>
      {(row.original.status === 'PAID' || row.original.status === 'SHIPPED') && (
        <MarkAsShipped order={row.original} />
      )}
    </ButtonGroup>
  </Box>
);

export function useOrdersTable() {
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

  return {
    orders,
    columns,
    isLoading,
    isFetching,
    search,
    setSearch,
    status,
    setStatus,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    pageCount: data?.data?.pageCount || 0,
  };
}
