import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { Styles } from './DataTableStyles';

interface DataTableProps {
    data: any[];
    onSelect?: (row: any) => void;
    selectedID?: any;
}

export const DataTable: React.FC<DataTableProps> = ({
    data,
    onSelect,
    selectedID,
}) => {
    const selectRow = (row: any) => {
        if (onSelect) {
            onSelect(row.values);
        }
    };

    const renderCell = (props: any) => {
        if (!props.value) {
            return 'Nan';
        }
        switch (typeof props.value) {
            case 'undefined':
                return 'NAN';
            case 'object':
                return props.value.type;
            default:
                return props.value;
        }
        return 'data';
    };

    const columns = useMemo(
        () =>
            data.length > 0
                ? Object.keys(data[0]).map((c) => ({
                      Header: c,
                      accessor: c,
                      Cell: renderCell,
                  }))
                : [],
        [data],
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <Styles.DataTable>
            {data.length > 0 ? (
                <Styles.Table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr
                                {...headerGroup.getHeaderGroupProps()}
                            >
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <Styles.TableRow
                                    selected={row.id === selectedID}
                                    onClick={() => selectRow(row)}
                                    {...row.getRowProps()}
                                >
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </Styles.TableRow>
                            );
                        })}
                    </tbody>
                </Styles.Table>
            ) : (
                <h1>No Data</h1>
            )}
        </Styles.DataTable>
    );
};
