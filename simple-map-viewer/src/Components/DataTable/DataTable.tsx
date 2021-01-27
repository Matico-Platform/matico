import React, {useState} from 'react'
import {useDatasetPagedResults} from '../../Hooks/useDataset'
import ReactTable from "react-table";
import "react-table/react-table.css";
import {Styles} from './DataTableStyles'
import {Dataset, Page} from '../../api'

interface DataTableProps{
    dataset: Dataset
}

export const DataTable: React.FC<DataTableProps> = ({dataset})=>{
    const [page, setPage] = useState(0);
    const perPage = 20;
    const {loading, data,error} = useDatasetPagedResults(dataset.id,{
        limit:perPage,
        offset:page*perPage
    })

    const columns = Object.keys(data[0]).map(c=> ({Header: c, accessor: c}))

    return (
        <Styles.DataTable>
            <ReactTable 
                data={data}
                       pages={100}
                       columns={columns}
                     defaultPageSize={perPage}
                     className="-striped -highlight"
                     loading={loading}
                     showPagination={true}
                     showPaginationTop={false}
                     showPaginationBottom={true}
                     pageSizeOptions={[20]}
                     manual // this would indicate that server side pagination has been enabled 
                     onFetchData={(state: any, instance: any) => {
                            setPage(state.page)
                     }}
            />
        </Styles.DataTable>
    )
}