/* eslint-disable react/jsx-key */
import {
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Order } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { CellProps, Column, Renderer, useTable } from 'react-table';

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
      <Button colorScheme='yellow' rightIcon={<Icon as={CgExternal} />} size='sm' variant='outline'>
        Receipt
      </Button>
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
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Order>({
    columns,
    data: orders,
  });

  return (
    <Card>
      <CardBody>
        <Heading size={{ base: 'sm', md: 'md' }}>{isAdmin ? '' : 'My '}Orders</Heading>
        <Table {...getTableProps()} colorScheme='yellow'>
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
      </CardBody>
    </Card>
  );
}

export default UserOrders;
