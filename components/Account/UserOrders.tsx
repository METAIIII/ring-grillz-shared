/* eslint-disable react/jsx-key */
import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Order } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CellProps, Column, Renderer, useTable } from 'react-table';
import { Card } from 'shared/components/card';

import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import OrderStatusBadge from '../Order/OrderStatusBadge';

function UserOrders({ orders }: { orders: Order[] }) {
  const { pathname } = useRouter();
  const isAdmin = pathname.includes('admin');

  // @ts-ignore
  const renderCreatedAtCell: Renderer<CellProps<Order>> = ({ value }) => (
    <>{dayjs(value).format('L')}</>
  );

  // @ts-ignore
  const renderAmountCell: Renderer<CellProps<Order>> = ({ value }) => (
    <>{formatAmountForDisplay(value)}</>
  );

  // @ts-ignore
  const renderStatusCell: Renderer<CellProps<Order>> = ({ value }) => (
    <OrderStatusBadge orderStatus={value} />
  );

  // @ts-ignore
  const renderReceiptButtonCell: Renderer<CellProps<Order>> = ({ value }) => (
    <Link href={`/receipt?order_id=${value}`}>
      <Button size='sm'>View Receipt</Button>
    </Link>
  );

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: renderCreatedAtCell,
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
        Cell: renderReceiptButtonCell,
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Order>({
    columns,
    data: orders,
  });

  return (
    <Card title={`${orders.length === 0 ? 'No ' : isAdmin ? '' : 'My '}Orders`}>
      {orders.length > 0 && (
        <Table {...getTableProps()} colorScheme='yellow' pt={2}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    <>{column.render('Header')}</>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>
                        <>{cell.render('Cell')}</>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Card>
  );
}

export default UserOrders;
