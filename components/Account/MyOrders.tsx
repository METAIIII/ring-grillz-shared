import { Box, Button, Heading, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Order } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { Column, useTable } from 'react-table';

import { formatAmountForDisplay } from '../../utils/stripeHelpers';
import OrderStatusBadge from '../Order/OrderStatusBadge';

/* eslint-disable react/jsx-key */
const MyOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: "Date",
        accessor: "createdAt", // accessor is the "key" in the data
        Cell: ({ value }) => dayjs(value).format("L"),
      },
      {
        Header: "Amount",
        accessor: "total",
        Cell: ({ value }) => formatAmountForDisplay(value),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => <OrderStatusBadge orderStatus={value} />,
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ value }) => (
          <Link href={`/receipt?order_id=${value}`} passHref>
            <Button
              as="a"
              size="sm"
              variant="outline"
              colorScheme="yellow"
              rightIcon={<Icon as={CgExternal} />}
            >
              Details
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: orders });

  return (
    <Box p={4} borderWidth={1}>
      <Heading size="md">My Orders</Heading>
      <Table {...getTableProps()} colorScheme="yellow">
        <Thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))
          }
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })
          }
        </Tbody>
      </Table>
    </Box>
  );
};

export default MyOrders;
