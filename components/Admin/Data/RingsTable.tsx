import { Box, Button, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { GiPencil } from 'react-icons/gi';
import { Column } from 'react-table';

import { useGetRingsDataQuery } from 'shared/reducers/api';
import PaginatedTable from '../../../components/UI/Table';
import { FullRing } from '../../../types';

// TODO: THIS FILE TO BE MOVED TO RING KINGZ REPO, NOT SHARED

const Rings = () => {
  const { data } = useGetRingsDataQuery('');

  const ringsData = useMemo<FullRing[]>(() => {
    if (!data?.data) return [];
    return data.data.rings;
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
          <Link href={`/admin/rings/${value}`}>
            <Button colorScheme='yellow' leftIcon={<Icon as={GiPencil} />} variant='outline'>
              Edit
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  return <PaginatedTable<FullRing> columns={columns} data={ringsData} />;
};

export default Rings;
