import { Button, Icon, Image } from '@chakra-ui/react';
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
        Cell: ({ value }) => <Image alt='preview' src={value} maxW='32' />,
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
          <Link href={`/admin/rings/${value}`} passHref>
            <Button
              as='a'
              colorScheme='yellow'
              variant='outline'
              leftIcon={<Icon as={GiPencil} />}
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
