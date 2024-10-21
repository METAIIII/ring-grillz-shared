import { useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Icon, Link, Tooltip } from '@chakra-ui/react';
import { User, UserRole } from '@prisma/client';
import { FaTimes } from 'react-icons/fa';
import { CellProps, Column, Renderer } from 'react-table';

import { useGetUsersQuery } from '../../../../reducers/api';

const renderRoleCell: Renderer<CellProps<User>> = ({ value }) => (
  <Badge colorScheme={value === 'ADMIN' ? 'red' : 'gray'}>{value}</Badge>
);

const renderEmailCell: Renderer<CellProps<User>> = ({ value, row }) => (
  <Flex alignItems='center' gap={2}>
    {value}
    {!row.original.emailVerified && (
      <Tooltip label='Email not verified' placement='top'>
        <Box mb='-1.5'>
          <Icon as={FaTimes} color='red.400' />
        </Box>
      </Tooltip>
    )}
  </Flex>
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

export function useUsersTable() {
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

  return {
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
    pageCount: data?.data?.pageCount || 0,
  };
}
