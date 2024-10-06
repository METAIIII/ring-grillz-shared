import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
} from '@chakra-ui/react';
import { User, UserRole } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { CellProps, Column, Renderer } from 'react-table';
import { useGetUsersQuery } from 'shared/reducers/api';

import { Card } from '../../card';
import PaginatedTable from '../../UI/paginated-table';

export function UsersTable() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching } = useGetUsersQuery({
    pageIndex,
    pageSize,
    filters: [
      { key: 'role', value: role, operation: 'equals' },
      { key: 'email', value: search, operation: 'contains' },
    ],
    sortBy: [{ key: 'name', order: 'asc' }],
  });

  const users = useMemo<User[]>(() => {
    if (!data) return [];
    if (!data.data) return [];
    return data.data.users;
  }, [data]);

  const renderRoleCell: Renderer<CellProps<User>> = ({ value }) => (
    <Badge colorScheme={value === 'ADMIN' ? 'red' : 'gray'}>{value}</Badge>
  );

  const renderEmailCell: Renderer<CellProps<User>> = ({ value, row }) => (
    <Tooltip
      hasArrow
      isDisabled={!!row.original.emailVerified}
      label='Email not verified'
      placement='top-start'
    >
      <Flex alignItems='center' gap={2}>
        {value}
        {!row.original.emailVerified && <Icon as={FaTimes} color='red.400' />}
      </Flex>
    </Tooltip>
  );

  const renderActionsCell: Renderer<CellProps<User>> = ({ row }) => (
    <Box textAlign='right'>
      <Link href={`/admin/users/${row.original.email}`} style={{ marginLeft: 'auto' }}>
        <Button size='sm' variant='solid'>
          View Profile
        </Button>
      </Link>
    </Box>
  );

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        Header: 'Role',
        accessor: 'role',
        Cell: renderRoleCell,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: renderEmailCell,
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
      <PaginatedTable<User>
        columns={columns}
        data={users}
        isLoading={isLoading || isFetching}
        pageCount={data?.data?.pageCount ?? 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </Card>
  );
}
