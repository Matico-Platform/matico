import React, { useState, useMemo } from 'react';
import { useDatasetPagedResults } from '../../Hooks/useDataset';
import { useTable } from 'react-table';
import { Styles } from './DataTableStyles';
import { Dataset, Page } from '../../api';

interface DataTableProps {
    dataset: Dataset;
    onSelect?: (row:any)=>void;
    selectedID?: any 
}

export const DataTable: React.FC<DataTableProps> = ({ dataset, onSelect,selectedID }) => {
    const [page, setPage] = useState(0);
    const perPage = 100;
    const { loading, data, error } = useDatasetPagedResults(
        dataset.id,
        {
            limit: perPage,
            offset: page * perPage,
        },
    );

    const selectRow = (row: any)=>{
        console.log('row ', row)
        if(onSelect){
            onSelect(row.values)
        }
    }

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
            data
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

    if (!data) {
        return <h2>Loading</h2>;
    }
    if (error) {
        return <h2>Error :-(</h2>;
    }

    return (
        <Styles.DataTable>
            <Styles.Table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <Styles.TableRow selected={row.id === selectedID} onClick={()=>selectRow(row)} {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </Styles.TableRow>
                        );
                    })}
                </tbody>
            </Styles.Table>
        </Styles.DataTable>
    );
};
