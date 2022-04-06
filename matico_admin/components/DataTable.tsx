import { Key, useEffect, useState } from "react";
import {
  TableView,
  TableHeader,
  Cell,
  Column,
  Row,
  TableBody,
  Flex,
  ToggleButton,
  TooltipTrigger,
  Tooltip,
} from "@adobe/react-spectrum";
import { useTableData } from "../hooks/useTableData";
import { ColumnDetails } from "./ColumnDetails";
import MapView from "@spectrum-icons/workflow/MapView";
import {Source} from '../utils/api'

export interface DataTableProps {
  source: Source;
  filters: Array<any>;
  onError?: (error: string) => void;
  selection?:string | number | null | undefined;
  onSelectionChange?: (featureId : string | number | null) => void;
  onVizualizeCol?: (col: string | null) => void;
  visCol? : string | null,
  idCol : string  | null
}

export const DataTable: React.FC<DataTableProps> = ({
  source,
  filters,
  onError,
  onVizualizeCol,
  visCol,
  selection,
  onSelectionChange,
  idCol
}) => {
  const [sort, setSort] = useState<null | any>(null);

  const {
    data: tableData,
    error,
    mutate: updateTableData,
  } = useTableData(source, filters, sort, { limit: 15, offset: 0});

  const tData = tableData && tableData.data ? tableData.data : tableData

  // This insures we update the table whenever the various options change
  useEffect(()=>{
    updateTableData()
  },[source,filters,sort])

  const columns = tData
    ? Object.keys(tData[0]).map((item) => ({ id: item, name: item }))
    : [];

  const updateSelection = (selection : "all" | Set<Key>)=>{
    if(onSelectionChange){
      onSelectionChange(Array.from(selection)[0] as string)
    }
  }

  const setVisCol = (column: string)=>{
    console.log("setting on vis column ",column)
    if(onVizualizeCol){
      if(visCol === column){
        onVizualizeCol(null)
      }
      else{
        onVizualizeCol(column)
      }
    }
  }

  useEffect(() => {
    if (onError) {
      onError(error);
    }
  });


  if (!tData) {
    return <div>Loading</div>;
  }
  return (
    <TableView
      id={`table-${JSON.stringify(source)}`}
      key={"table"}
      gridArea="table"
      sortDescriptor={sort}
      onSortChange={(sort) => setSort(sort)}
      onSelectionChange={updateSelection}
      selectionMode="single"
      selectionStyle="highlight"
    >
      <TableHeader columns={columns}>
        {(col) => (
          <Column allowsSorting key={col.id} width={200}>
            <Flex direction="row" alignItems="center">
              {col.name}
              <TooltipTrigger delay={0}>
                <ColumnDetails  source={source} colName={col.name} />
                <Tooltip>Column stats and controls</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger delay={0}>
              <ToggleButton isEmphasized isSelected={visCol === col.name} onChange={()=> setVisCol(col.name)} isQuiet>
                <MapView size="XXS" />
              </ToggleButton>
                <Tooltip>Visualize on map</Tooltip>
              </TooltipTrigger>
            </Flex>
          </Column>
        )}
      </TableHeader>
      <TableBody items={tData}>
        {(param: { [key: string]: any }) => (
          <Row key={ idCol && param[idCol] ? param[idCol] : JSON.stringify(param)}>
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

