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
          <Link
            legacyBehavior
            passHref
            href={`/admin/edit/material?id=${value}`}
          >
            <Button
              as='a'
              colorScheme='red'
              leftIcon={<Icon as={FaEdit} />}
              size='sm'
              variant='outline'
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
      colorScheme='red'
      columns={columns}
      data={materialsData}
    />
  ) : (
    <div />
  );
};

export default TeethMaterialsTable;
