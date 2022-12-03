import {
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Content,
  Text,
  Grid,
} from "@adobe/react-spectrum";
import MoreVertical from "@spectrum-icons/workflow/MoreSmallListVert";
import React, { useState } from "react";
import { useColumnStat } from "../hooks/useColumnStat";
import { useDatasetColumn } from "../hooks/useDatasetColumns";
import { Source } from "../hooks/useTableData";
import { MaticoChart } from "@maticoapp/matico_charts";

interface ColumnDetailProps {
  source: Source;
  colName: string;
}

const statForDataType = (dataType: any) => {
  const histogram = { type: "histogram", noBins: 20 };
  const categories = { type: "valueCounts" };

  switch (dataType) {
    case "INT4":
      return histogram;
    case "INT8":
      return histogram;
    case "FLOAT":
      return histogram;
    case "NUMERIC":
      return histogram;
    case "FLOAT8":
      return histogram;
    case "VARCHAR":
      return categories;
    default:
      return null;
  }
};

const chartForSummary = (dataSummary: any, colName: string) => {
  switch (Object.keys(dataSummary)[0]) {
    case "valueCounts":
      return (
        <Grid columns={["1fr", "1fr"]}>
          {dataSummary.valueCounts.slice(0, 5).map((entry: any) => (
            <>
              <Text>{entry.name}</Text>
              <Text>{entry.count}</Text>
            </>
          ))}
          <Text>... and {dataSummary.valueCounts.length - 5} others</Text>
        </Grid>
      );
    case "histogram":
      const hist = dataSummary.histogram;
      return (
        <MaticoChart
          xCol="binMid"
          xLabel={colName}
          yLabel={"counts"}
          yCol="freq"
          data={hist}
          height={150}
          width={300}
          xAxis={{
            scaleType: "linear",
            position: "bottom",
          }}
          grid={{ rows: true, columns: false }}
          layers={[
            {
              type: "bar",
              color: "steelblue",
              scale: 1,
              xAccessor: (d: any) => d.binMid,
            },
          ]}
        />
      );
    default:
      return <h2>Not implemented</h2>;
  }
};

export const ColumnDetails: React.FC<ColumnDetailProps> = ({
  source,
  colName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { column, columnError } = useDatasetColumn(source, colName);

  const stat = statForDataType(column?.colType);

  console.log("ATTEMPTING TO GET STAT ", stat, column?.colType, column);
  const { data: dataSummary, error: dataSummaryError } = useColumnStat(
    isOpen ? source : null,
    colName,
    stat
  );

  return (
    <DialogTrigger onOpenChange={setIsOpen} type="popover">
      <ActionButton isQuiet>
        <MoreVertical size="XXS" />
      </ActionButton>
      <Dialog isDismissable>
        <Heading>{colName}</Heading>
        <Content>
          {dataSummary && isOpen && chartForSummary(dataSummary, colName)}
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
