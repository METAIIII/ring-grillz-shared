import {
  Box,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  ThemeTypings,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Row, TableOptions, usePagination, useTable } from 'react-table';

/* eslint-disable react/jsx-key */
interface TableProps<T extends object> extends TableOptions<T> {
  onClick?: (row: Row<T>) => void;
  colorScheme?: ThemeTypings['colorSchemes'];
}

function PaginatedTable<T extends object>({
  columns,
  data,
  colorScheme,
}: TableProps<T>): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<T>({ columns, data }, usePagination);

  return (
    <>
      <Table {...getTableProps()} colorScheme={colorScheme}>
        <Thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    <>{column.render('Header')}</>
                  </Th>
                ))}
              </Tr>
            ))
          }
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            page.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>
                        <>{cell.render('Cell')}</>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })
          }
        </Tbody>
      </Table>
      <Flex alignItems='center' justifyContent='flex-end' p={4}>
        <Text fontSize='sm' fontWeight='bold' mr={2}>
          Page {pageIndex + 1} of {pageCount}
        </Text>
        <ButtonGroup isAttached colorScheme='yellow' mr={2} size='sm' variant='ghost'>
          <Tooltip label='Previous Page'>
            <IconButton
              aria-label='Previous Page'
              icon={<Icon as={FaAngleLeft} />}
              isDisabled={!canPreviousPage}
              onClick={previousPage}
            />
          </Tooltip>
          <Tooltip label='Next Page'>
            <IconButton
              aria-label='Next Page'
              icon={<Icon as={FaAngleRight} />}
              isDisabled={!canNextPage}
              onClick={nextPage}
            />
          </Tooltip>
        </ButtonGroup>
        <Box>
          <Select size='sm' value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </Box>
      </Flex>
    </>
  );
}

export default PaginatedTable;
