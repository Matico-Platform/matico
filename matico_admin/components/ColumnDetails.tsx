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
import React from "react";
import { useColumnStat } from "../hooks/useColumnStat";
import { useDatasetColumn } from "../hooks/useDatasetColumns";
import { Source } from "../hooks/useTableData";
import { MaticoChart } from "@maticoapp/matico_charts";

interface ColumnDetailProps {
  source: Source;
  colName: string;
}

const statForDataType = (dataType: any) => {
  const histogram = { Histogram: { no_bins: 20 } };
  const categories = { ValueCounts: {} };
  switch (dataType) {
    case "INT4":
      return histogram;
    case "FLOAT":
      return histogram;
    case "VARCHAR":
      return categories;
    default:
      return null;
  }
};

const chartForSummary = (dataSummary: any, colName: string) => {
  switch (Object.keys(dataSummary)[0]) {
    case "ValueCounts":
      return (
        <Grid columns={["1fr", "1fr"]}>
          {dataSummary.ValueCounts.slice(0, 5).map((entry: any) => (
            <>
              <Text>{entry.name}</Text>
              <Text>{entry.count}</Text>
            </>
          ))}
          <Text>... and {dataSummary.ValueCounts.length - 5} others</Text>
        </Grid>
      );
    case "Histogram":
      const hist = dataSummary.Histogram;
      return (
        <MaticoChart
          xCol="bin_mid"
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
              xAccessor: (d: any) => d.bin_mid,
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
  console.log("attempting to get column data ", source, colName);
  const { data, error } = useDatasetColumn(source, colName);

  const stat = statForDataType(data?.col_type);
  const { data: dataSummary, error: dataSummaryError } = useColumnStat(
    source,
    colName,
    stat
  );

  console.log("datasummart ", dataSummary);

  return (
    <DialogTrigger type="popover">
      <ActionButton isQuiet>
        <MoreVertical size="XXS" />
      </ActionButton>
      <Dialog isDismissable>
        <Heading>{colName}</Heading>
        <Content>
          {dataSummary && chartForSummary(dataSummary, colName)}
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
