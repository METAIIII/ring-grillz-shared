import { Badge, Button, Icon, Text } from '@chakra-ui/react';
import _ from 'lodash';
import Link from 'next/link';
import { useMemo } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Column } from 'react-table';
import useSWR from 'swr';

import { FullTeethMaterial } from '../../../types';
import { TeethMaterialsResponse } from '../../../types/apiResponses';
import fetcher from '../../../utils/axiosFetcher';
import { formatAmountForDisplay } from '../../../utils/stripeHelpers';
import PaginatedTable from '../../UI/Table';

/* eslint-disable react/jsx-key */
const TeethMaterialsTable = () => {
  const { data } = useSWR<TeethMaterialsResponse>(`/api/material`, fetcher);

  const materialsData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  const columns = useMemo<Column<FullTeethMaterial>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Variants',
        accessor: 'variants',
        Cell: ({ value }) => {
          return <Badge>{value.length}</Badge>;
        },
      },
      {
        Header: 'Options',
        accessor: 'options',
        Cell: ({ value }) => {
          return <Badge>{value.length}</Badge>;
        },
      },
      {
        Header: 'Labour Cost',
        accessor: 'labourCost',
        Cell: ({ value }) => {
          return <Text>{formatAmountForDisplay(value)}</Text>;
        },
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <Link href={`/admin/edit/material?id=${value}`} passHref>
            <Button
              as='a'
              size='sm'
              colorScheme='red'
              variant='outline'
              leftIcon={<Icon as={FaEdit} />}
            >
              Edit
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  return _.isArray(materialsData) ? (
    <PaginatedTable<FullTeethMaterial>
      columns={columns}
      data={materialsData}
      colorScheme='red'
    />
  ) : (
    <div />
  );
};

export default TeethMaterialsTable;
