import { useEffect, useState } from "react";
import {
  TableView,
  TableHeader,
  TableBoy,
  Cell,
  Column,
  Row,
  TableBody,
  Flex,
  ActionButton,
} from "@adobe/react-spectrum";
import { Source, useTableData, Page, Sort } from "../hooks/useTableData";
import { ColumnDetails } from "./ColumnDetails";
import MapView from "@spectrum-icons/workflow/MapView";

export interface DataTableProps {
  source: Source;
  filters: Array<any>;
  onError?: (error: string) => void;
  onVizualizeCol?: (col: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  source,
  filters,
  onError,
  onVizualizeCol
}) => {
  const [sort, setSort] = useState<null | any>(null);

  const {
    data: tableData,
    error,
    mutate: updateTableData,
  } = useTableData(source, filters, sort, { limit: 15, offset: null });

  useEffect(()=>{
    updateTableData()
  },[source,filters,sort])

  console.log("sort desc ", sort);

  const columns = tableData
    ? Object.keys(tableData[0]).map((item) => ({ id: item, name: item }))
    : [];

  console.log("data ", tableData, error, source, filters, null);

  const setVisCol = (column: string)=>{
    if(onVizualizeCol){
      onVizualizeCol(column)
    }
  }

  useEffect(() => {
    if (onError) {
      onError(error);
    }
  });

  if (!tableData) {
    return <div>Loading</div>;
  }
  return (
    <TableView
      id={`table-${JSON.stringify(source)}`}
      key={"table"}
      gridArea="table"
      sortDescriptor={sort}
      onSortChange={(sort) => setSort(sort)}
      selectionMode="single"
      selectionStyle="highlight"
    >
      <TableHeader columns={columns}>
        {(col) => (
          <Column allowsSorting key={col.id} width={200}>
            <Flex direction="row" alignItems="center">
              {col.name}
              <ColumnDetails  source={source} colName={col.name} />
              <ActionButton onPress={setVisCol} isQuiet>
                <MapView size="XXS" />
              </ActionButton>
            </Flex>
          </Column>
        )}
      </TableHeader>
      <TableBody items={tableData}>
        {(param: { [key: string]: any }) => (
          <Row key={JSON.stringify(param)}>
            {(columnKey) => (
              <Cell>
                {typeof param[columnKey] === "object"
                  ? "Geometry"
                  : param[columnKey]}
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
};

