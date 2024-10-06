/* eslint-disable react/jsx-key */
import {
  Box,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Select,
  Skeleton,
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

interface TableProps<T extends object> extends TableOptions<T> {
  onClick?: (row: Row<T>) => void;
  colorScheme?: ThemeTypings['colorSchemes'];
  // Add new optional props for external pagination control
  pageIndex: number;
  onPageIndexChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  pageCount: number;
  isLoading?: boolean;
}

const ROW_HEIGHT_PX = 50;

function PaginatedTable<T extends object>({
  columns,
  data,
  pageIndex,
  onPageIndexChange,
  pageSize,
  onPageSizeChange,
  pageCount,
  isLoading,
}: TableProps<T>): ReactElement {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        pageIndex,
        pageSize,
      },
      manualPagination: true,
      manualSortBy: true,
      pageCount: pageCount,
    },
    usePagination,
  );

  // Ensure pageIndex is within valid range
  const safePageIndex = Math.min(pageIndex, Math.max(pageCount - 1, 0));

  // If the current pageIndex is different from the safe one, update it
  if (safePageIndex !== pageIndex) {
    onPageIndexChange(safePageIndex);
  }

  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()} paddingX={0}>
                    <>{column.render('Header')}</>
                  </Th>
                ))}
              </Tr>
            ))
          }
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {isLoading
            ? Array.from({ length: pageSize }).map((_, index) => (
                <Tr key={index}>
                  <Td colSpan={columns.length} height={`${ROW_HEIGHT_PX}px`} padding={0}>
                    <Skeleton borderRadius={6} height='80%' width='100%' />
                  </Td>
                </Tr>
              ))
            : page.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <Td {...cell.getCellProps()} height={`${ROW_HEIGHT_PX}px`} padding={0}>
                          <>{cell.render('Cell')}</>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
        </Tbody>
      </Table>
      <Flex alignItems='center' justifyContent='flex-end' pt={4}>
        <Text fontSize='sm' fontWeight='bold' mr={2}>
          {pageCount > 0 ? `Page ${safePageIndex + 1} of ${pageCount}` : 'No pages'}
        </Text>
        <ButtonGroup isAttached colorScheme='yellow' mr={2} size='sm' variant='ghost'>
          <Tooltip label='Previous Page'>
            <IconButton
              aria-label='Previous Page'
              icon={<Icon as={FaAngleLeft} />}
              isDisabled={safePageIndex === 0 || pageCount === 0}
              onClick={() => onPageIndexChange(Math.max(safePageIndex - 1, 0))}
            />
          </Tooltip>
          <Tooltip label='Next Page'>
            <IconButton
              aria-label='Next Page'
              icon={<Icon as={FaAngleRight} />}
              isDisabled={safePageIndex === pageCount - 1 || pageCount === 0}
              onClick={() => onPageIndexChange(Math.min(safePageIndex + 1, pageCount - 1))}
            />
          </Tooltip>
        </ButtonGroup>
        <Box>
          <Select
            borderRadius={6}
            isDisabled={pageCount === 0}
            size='sm'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
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
