import { Badge, Button, Icon } from '@chakra-ui/react';
import { User } from '@prisma/client';
import _ from 'lodash';
import Link from 'next/link';
import { useMemo } from 'react';
import { CgExternal } from 'react-icons/cg';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Column } from 'react-table';
import useSWR from 'swr';

import { UsersResponse } from '../../../types/apiResponses';
import fetcher from '../../../utils/axiosFetcher';
import PaginatedTable from '../../UI/Table';

/* eslint-disable react/jsx-key */
const Customers = () => {
  const { data } = useSWR<UsersResponse>(`/api/user`, fetcher);

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
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Verified',
        accessor: 'emailVerified',
        Cell: ({ value }) => <Icon as={value ? FaCheck : FaTimes} />,
      },
      {
        Header: 'Name',
        accessor: 'name',
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

  return _.isArray(userData) ? (
    <PaginatedTable<User> colorScheme='red' columns={columns} data={userData} />
  ) : (
    <div />
  );
};

export default Customers;
