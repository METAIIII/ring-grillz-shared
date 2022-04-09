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
  colorScheme?: ThemeTypings["colorSchemes"];
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
                    {column.render("Header")}
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
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })
          }
        </Tbody>
      </Table>
      <Flex p={4} alignItems="center" justifyContent="flex-end">
        <Text mr={2} fontWeight="bold" fontSize="sm">
          Page {pageIndex + 1} of {pageCount}
        </Text>
        <ButtonGroup
          isAttached
          size="sm"
          variant="ghost"
          colorScheme="yellow"
          mr={2}
        >
          <Tooltip label="Previous Page">
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="Previous Page"
              icon={<Icon as={FaAngleLeft} />}
              onClick={previousPage}
            />
          </Tooltip>
          <Tooltip label="Next Page">
            <IconButton
              isDisabled={!canNextPage}
              aria-label="Next Page"
              icon={<Icon as={FaAngleRight} />}
              onClick={nextPage}
            />
          </Tooltip>
        </ButtonGroup>
        <Box>
          <Select
            size="sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
