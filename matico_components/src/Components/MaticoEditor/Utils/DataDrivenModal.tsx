import React, { useState } from "react";
import {
  DialogTrigger,
  Dialog,
  ActionButton,
  Content,
  Flex,
  View,
  Header,
  Heading,
  Picker,
  Item,
  NumberField,
} from "@adobe/react-spectrum";
import { DatasetColumnSelector } from "./DatasetColumnSelector";
import { DatasetSummary, Column, Filter } from "../../../Datasets/Dataset";
import { MaticoChart } from "@maticoapp/matico_charts";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import { useMaticoSelector } from "Hooks/redux";

interface DataDrivenModalProps {
  dataset: Dataset;
  column: Column;
  varType: "color" | "width" | "size" | "value";
}

const ContinuousDomain: React.FC<{
  column: Column;
  dataset: DatasetSummary;
  filters: Array<Filter>;
}> = ({ dataset, column, filters }) => {
  const [noBins, setNoBins] = useState(5);
  const [quantization, setQuantization] = useState("quantile");

  const histogram = useRequestColumnStat({
    datasetName: dataset.name,
    column: column.name,
    metric: "Histogram",
    parameters: { noBins: 20 },
    filters: filters,
  });

  const quantiles = useRequestColumnStat({
    datasetName: dataset.name,
    column: column.name,
    metric: "Quantile",
    parameters: { noBins },
    filters: filters,
  });

  const equalInterval = useRequestColumnStat({
    datasetName: dataset.name,
    column: column.name,
    metric: "EqualInterval",
    parameters: { noBins },
    filters: filters,
  });

  const bins = { equal: equalInterval, quantile: quantiles }[quantization];

  const extent = histogram && histogram.state==="Done" ?  [histogram.result[0].binStart - (histogram.result[0].binEnd - histogram.result[0].binStart), histogram.result[histogram.result.length-1].binEnd] : []

  console.log("Extent ", extent)
  console.log("Histogram ", histogram)

  return (
    <Flex direction="column">

      {histogram && histogram.state==="Done" &&
        (
        <MaticoChart
          width={500}
          height={300}
          xExtent={extent}
          xCol ="binStart"
          xLabel={column.name}
          yLabel={"count"}
          yCol="count"
          data={histogram.result}
          xAxis={{
            scaleType:"linear",
            position:"bottom"
          }}
          grid= { {rows:true, columns:false }}
          layers={[
            {
              type: "bar",
              color: 'white',
              scale:11,
              xAccessor:((d:any)=> d.binEnd),
            },
          ]}
        />
      )}

      <Flex direction='row' gap="size-200" alignItems='end'>
        <Picker
          selectedKey={quantization}
          onSelectionChange={(quant) => setQuantization(quant as string)}
          label="Quantization"
        >
          <Item key="quantile">Quantiles</Item>
          <Item key="continuous">Continuous</Item>
          <Item key="equal">Equal</Item>
          <Item key="manual">Manual</Item>
        </Picker>

        <NumberField
          value={noBins}
          onChange={setNoBins}
          label="Number of breaks"
          maxValue={9}
          minValue={2}
          step={1}
        />
        </Flex>

      {["quantile", "equal", "manual"].includes(quantization) && (
        <Flex direction="column" gap='size-200'>
          {bins &&
            bins.state === "Done" &&
            bins.result.map((bin: number, index: number) => (
              <NumberField
                width="size-2000"
                label={`Bin ${index}`}
                key={index}
                value={bin}
                labelPosition="side"
                isDisabled={quantization !== "manual"}
              />
            ))}
        </Flex>
      )}
    </Flex>
  );
};

export const DataDrivenModal: React.FC<DataDrivenModalProps> = ({
  datasetName,
}) => {
  const [column, setColumn] = useState<Column | null>(null);
  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[datasetName]
  );
  return (
    <DialogTrigger>
      <ActionButton>edit</ActionButton>
      <Dialog>
        <Content>
          <Flex direction="column">
            <View>
              <DatasetColumnSelector
                datasetName={datasetName}
                selectedColumn={column}
                onColumnSelected={setColumn}
              />
              {column && (
                <ContinuousDomain
                  column={column}
                  dataset={dataset}
                ></ContinuousDomain>
              )}
            </View>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
