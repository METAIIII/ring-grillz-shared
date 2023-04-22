import { Badge, Button, Icon } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Column } from 'react-table';

import { useGetAllUsersQuery } from '../../../reducers/api';
import { Panel } from '../../UI/Panel';
import PaginatedTable from '../../UI/Table';

function Customers() {
  const { data } = useGetAllUsersQuery('');

  const userData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

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
        Cell: ({ value }) => <Icon as={value ? FaCheck : FaTimes} />,
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => (
          <Badge colorScheme={value === 'ADMIN' ? 'red' : 'gray'}>{value}</Badge>
        ),
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <Link href={`/admin/user/${value}`}>
            <Button
              colorScheme='red'
              rightIcon={<Icon as={CgExternal} />}
              size='sm'
              variant='outline'
            >
              Details
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <Panel>
      <PaginatedTable<User> colorScheme='red' columns={columns} data={userData} />
    </Panel>
  );
}

export default Customers;
