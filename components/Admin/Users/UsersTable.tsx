import { Badge, Button, Card, CardBody, Icon } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { CellProps, Column, Renderer } from 'react-table';

import { useGetAllUsersQuery } from '../../../reducers/api';
import PaginatedTable from '../../UI/Table';

function Customers() {
  const { data, isLoading } = useGetAllUsersQuery('');

  const userData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  const renderEmailVerifiedCell: Renderer<CellProps<User>> = ({ value }) => (
    <Icon as={value ? FaCheck : FaTimes} />
  );

  // @ts-ignore
  const renderRoleCell: Renderer<CellProps<User>> = ({ value }) => {
    <Badge colorScheme={value === 'ADMIN' ? 'red' : 'gray'}>{value}</Badge>;
  };

  const renderDetailsCell: Renderer<CellProps<User>> = ({ value }) => (
    <Link href={`/admin/user/${value}`}>
      <Button colorScheme='red' rightIcon={<Icon as={CgExternal} />} size='sm' variant='outline'>
        Details
      </Button>
    </Link>
  );

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Email',
        accessor: 'email',
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
      {
        Header: '',
        accessor: 'id',
        Cell: renderDetailsCell,
      },
    ],
    []
  );

  return (
    <Card>
      <CardBody>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <PaginatedTable<User> colorScheme='red' columns={columns} data={userData} />
        )}
      </CardBody>
    </Card>
  );
}

export default Customers;
