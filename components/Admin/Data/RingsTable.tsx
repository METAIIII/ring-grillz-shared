import { Box, Button, Icon } from '@chakra-ui/react';
import _ from 'lodash';
import Link from 'next/link';
import { useMemo } from 'react';
import { GiPencil } from 'react-icons/gi';
import { Column } from 'react-table';
import useSWR from 'swr';

import PaginatedTable from '../../../components/UI/Table';
import { FullRing } from '../../../types';
import { RingsResponse } from '../../../types/apiResponses';
import fetcher from '../../../utils/axiosFetcher';

/* eslint-disable react/jsx-key */
const Rings = () => {
  const { data } = useSWR<RingsResponse>(`/api/ring`, fetcher);

  const ringsData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  const columns = useMemo<Column<FullRing>[]>(
    () => [
      {
        Header: 'Preview',
        accessor: 'previewImage',
        Cell: ({ value }) => (
          <Box
            bgImage={`url(${value})`}
            bgPosition='center'
            bgRepeat='no-repeat'
            bgSize='cover'
            h={20}
            w={20}
          />
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Order',
        accessor: 'order',
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <Link legacyBehavior passHref href={`/admin/rings/${value}`}>
            <Button
              as='a'
              colorScheme='yellow'
              leftIcon={<Icon as={GiPencil} />}
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

  return _.isArray(ringsData) ? (
    <PaginatedTable<FullRing> columns={columns} data={ringsData} />
  ) : (
    <div />
  );
};

export default Rings;
