import { Badge, Button, Card, CardBody, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { CellProps, Column, Renderer } from 'react-table';

import PaginatedTable from '../../UI/Table';

export function UsersTable(props: { users: User[] }) {
  const users = useMemo(() => props.users, [props.users]);
  const renderEmailVerifiedCell: Renderer<CellProps<User>> = ({ value }) => (
    <Icon as={value ? FaCheck : FaTimes} />
  );

  const renderRoleCell: Renderer<CellProps<User>> = ({ value }) => (
    <Badge colorScheme={value === 'ADMIN' ? 'red' : 'gray'}>{value}</Badge>
  );

  const renderEmailCell: Renderer<CellProps<User>> = ({ value }) => (
    <Flex alignItems='center' gap={4}>
      <Text flex={1}>{value}</Text>
      <Link href={`/admin/user/${value}`} style={{ marginLeft: 'auto' }}>
        <Button colorScheme='red' rightIcon={<Icon as={CgExternal} />} size='sm' variant='outline'>
          Details
        </Button>
      </Link>
    </Flex>
  );

  const columns = useMemo<Column<User>[]>(
    () => [
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
        Header: 'Verified',
        accessor: 'emailVerified',
        Cell: renderEmailVerifiedCell,
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: renderRoleCell,
      },
    ],
    [],
  );

  return (
    <Card>
      <CardBody>
        <PaginatedTable<User> colorScheme='red' columns={columns} data={users} />
      </CardBody>
    </Card>
  );
}
