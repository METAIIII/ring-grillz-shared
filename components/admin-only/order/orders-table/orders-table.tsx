import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Order } from '@prisma/client';
import { FaSearch } from 'react-icons/fa';

import { Card } from '../../../card/card';
import PaginatedTable from '../../../paginated-table';
import { useOrdersTable } from './use-orders-table';

export function OrdersTable() {
  const {
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
    pageCount,
  } = useOrdersTable();

  return (
    <Card isLoading={isLoading || isFetching}>
      <Flex alignItems='center' gap={4} justifyContent='space-between' mb={4}>
        <ButtonGroup size='xs'>
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
        <InputGroup size='sm' width='sm'>
          <InputLeftElement>
            <Icon as={FaSearch} color='gray.500' />
          </InputLeftElement>
          <Input
            borderRadius={6}
            placeholder='Search by email'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <PaginatedTable<Order>
        columns={columns}
        data={orders}
        filters={[{ key: 'status', value: status, operation: 'equals' }]}
        isLoading={isLoading || isFetching}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </Card>
  );
}
