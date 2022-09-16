import { Flex, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
export default function CheckTable(props: { columnsData: any; tableData: any }) {
	const { columnsData, tableData } = props;

	const columns = useMemo(() => columnsData, [ columnsData ]);
	const data = useMemo(() => tableData, [ tableData ]);

	let tableInstance = useTable(
		{
			columns,
			data
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, initialState } = tableInstance;
	initialState.pageSize = 11;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' justify='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Check Table
				</Text>
				<Menu />
			</Flex>
			<Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
				<Thead>
					{headerGroups.map((headerGroup: any, index: number) => (
						<Tr {...headerGroup.getHeaderGroupProps()} key={index}>
							{headerGroup.headers.map(
								(
									column: {
										render(a: string): JSX.Element;
										getHeaderProps(a: any): any;
										getSortByToggleProps(): any;
									},
									index: number
								) => (
									<Th
										{...column.getHeaderProps(column.getSortByToggleProps())}
										pe='10px'
										key={index}
										borderColor={borderColor}>
										<Flex
											justify='space-between'
											align='center'
											fontSize={{ sm: '10px', lg: '12px' }}
											color='gray.400'>
											{column.render('Header')}
										</Flex>
									</Th>
								)
							)}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{page.map((row: any, index: number) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()} key={index}>
								{row.cells.map((cell: any, index: number) => {
									let data;
									if (cell.column.Header === 'NAME') {
										data = (
											<Flex align='center'>
												<Checkbox
													defaultChecked={cell.value[1]}
													colorScheme='brandScheme'
													me='10px'
												/>
												<Text color={textColor} fontSize='sm' fontWeight='700'>
													{cell.value[0]}
												</Text>
											</Flex>
										);
									} else if (cell.column.Header === 'PROGRESS') {
										data = (
											<Flex align='center'>
												<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
													{cell.value}%
												</Text>
											</Flex>
										);
									} else if (cell.column.Header === 'QUANTITY') {
										data = (
											<Text color={textColor} fontSize='sm' fontWeight='700'>
												{cell.value}
											</Text>
										);
									} else if (cell.column.Header === 'DATE') {
										data = (
											<Text color={textColor} fontSize='sm' fontWeight='700'>
												{cell.value}
											</Text>
										);
									}
									return (
										<Td
											{...cell.getCellProps()}
											key={index}
											fontSize={{ sm: '14px' }}
											minW={{ sm: '150px', md: '200px', lg: 'auto' }}
											borderColor='transparent'>
											{data}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Card>
	);
}
