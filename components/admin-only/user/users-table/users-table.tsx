import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { User } from '@prisma/client';
import { FaSearch } from 'react-icons/fa';

import { Card } from '../../../card/card';
import PaginatedTable from '../../../paginated-table';
import { useUsersTable } from './use-users-table';

export function UsersTable() {
  const {
    users,
    columns,
    isLoading,
    isFetching,
    search,
    setSearch,
    role,
    setRole,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    pageCount,
  } = useUsersTable();

  return (
    <Card isLoading={isLoading || isFetching}>
      <Flex alignItems='center' justifyContent='space-between' mb={4}>
        <ButtonGroup size='xs'>
          <Button
            colorScheme={role === 'CUSTOMER' ? 'blue' : 'gray'}
            variant={role === 'CUSTOMER' ? 'solid' : 'outline'}
            onClick={() => setRole('CUSTOMER')}
          >
            Customers
          </Button>
          <Button
            colorScheme={role === 'ADMIN' ? 'red' : 'gray'}
            variant={role === 'ADMIN' ? 'solid' : 'outline'}
            onClick={() => setRole('ADMIN')}
          >
            Admins
          </Button>
        </ButtonGroup>
        <InputGroup size='sm' width='sm'>
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
      </Flex>
      <PaginatedTable<User>
        columns={columns}
        data={users}
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
