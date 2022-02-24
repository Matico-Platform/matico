import React, { useEffect, useState } from "react";
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
import { ColorPaletteSelector } from "./ColorPaletteSelector";
import { ColorPickerDialog } from "./ColorPickerDialog";
import { colors } from "../../../Utils/colors";
import _ from "lodash";

type RangeType = "color" | "value";

interface DataDrivenModalProps {
  spec: any;
  rangeType: RangeType;
  onUpdateSpec: (spec: any) => void;
}

type Color = string | [Number, Number, Number, Number];

const ContinuousDomain: React.FC<{
  column: Column;
  dataset: DatasetSummary;
  rangeType: RangeType;
  filters: Array<Filter>;
  mapping: any;
  onUpdateMapping: (newMapping: any) => void;
}> = ({ dataset, mapping, column, filters, rangeType, onUpdateMapping }) => {
  const domain = mapping.domain;
  const range = mapping.range;

  const [metric, metricParams] = Array.isArray(domain)
    ? ["Manual", { bins: domain.length }]
    : Object.entries(domain.metric)[0];

  //@ts-ignore
  const noBins = metricParams.bins;

  let selectedPaletteName =
    typeof range === "string" ? range.split(".")[0] : null;

  let selectedPalette = selectedPaletteName
    ? //@ts-ignore
      colors[selectedPaletteName]
    : null;

  let rangeValues = Array.isArray(range)
    ? range
    : //@ts-ignore
      colors[selectedPaletteName][range.split(".")[1]];

  const [domainValues, setDomainValues] = useState<Array<number> | null>(
    Array.isArray(domain) ? domain : []
  );

  const histogram = useRequestColumnStat({
    datasetName: dataset.name,
    column: domain.column,
    metric: "Histogram",
    parameters: { bins: 20 },
    filters: filters,
  });

  const quantiles = useRequestColumnStat({
    datasetName: dataset.name,
    column: column.name,
    metric: "Quantile",
    parameters: { bins: noBins },
    filters: filters,
  });

  const equalInterval = useRequestColumnStat({
    datasetName: dataset.name,
    column: column.name,
    metric: "EqualInterval",
    parameters: { bins: noBins },
    filters: filters,
  });

  useEffect(() => {
    if (metric === "Quantile" && quantiles && quantiles.state === "Done") {
      setDomainValues(quantiles.result);
    }
    if (
      metric === "EqualInterval" &&
      equalInterval &&
      equalInterval.state === "Done"
    ) {
      setDomainValues(equalInterval.result);
    }
    if (metric === "Manual") {
      setDomainValues(domain);
    }
  }, [metric, noBins, quantiles, equalInterval, column]);

  const extent =
    histogram && histogram.state === "Done"
      ? [
          histogram.result[0].binStart -
            (histogram.result[0].binEnd - histogram.result[0].binStart),
          histogram.result[histogram.result.length - 1].binEnd,
        ]
      : [];

  const updateQuantization = (quantization: string) => {
    if (quantization === "Manual") {
      onUpdateMapping({ ...mapping, domain: domainValues });
    }
    if (quantization === "Quantile") {
      onUpdateMapping({
        ...mapping,
        domain: {
          dataset: dataset.name,
          column: column.name,
          metric: { Quantile: { bins: noBins } },
        },
      });
    }
    if (quantization === "EqualInterval") {
      onUpdateMapping({
        ...mapping,
        domain: {
          dataset: dataset.name,
          variable: column.name,
          metric: { EqualInterval: { bins: noBins } },
        },
      });
    }
    console.warn("Trying to set an unknown quantization method ", quantization);
  };

  const updateBins = (bins: number) => {
    let newRange;
    if (Array.isArray(range)) {
      _.range(bins).map((index) => (range[index] ? range[index] : [0, 0, 0]));
    } else {
      newRange = `${selectedPaletteName}.${bins}`;
    }
    if (metric === "Manual") {
      onUpdateMapping({
        ...mapping,
        range: newRange,
        domain: _.range(noBins).map((index: number) =>
          domainValues[index] ? domainValues[index] : 0
        ),
      });
    }
    if (metric === "Quantile") {
      const newMapping = {
        ...mapping,
        range: newRange,
        domain: { ...domain, metric: { Quantile: { bins } } },
      };
      onUpdateMapping(newMapping);
    }
    if (metric === "EqualInterval") {
      onUpdateMapping({
        ...mapping,
        range: newRange,
        domain: { ...domain, metric: { EqualInterval: { bins } } },
      });
    }
  };

  const updatePalette = (
    palette: { colors: Array<Color>; name: string },
    bins: number
  ) => {
    onUpdateMapping({ ...mapping, range: `${palette.name}.${bins}` });
  };

  const updateRangeValForBin = (newVal: Color | number, binNo: Number) => {
    const newRange = rangeValues.map((val: Color | number, index: number) =>
      index === binNo ? newVal : val
    );
    console.log("Mapping ", mapping, " range ", newRange)
    onUpdateMapping({ ...mapping, range: newRange });
  };

  const updateValueForBin = (newVal: number, binNo: number) => {
    onUpdateMapping({
      ...mapping,
      domain: mapping.domain.map((val: number, index: number) =>
        index === binNo ? newVal : val
      ),
    });
  };

  return (
    <Flex direction="column">
      {histogram && histogram.state === "Done" && (
        <MaticoChart
          width={300}
          height={200}
          xExtent={extent}
          xCol="binStart"
          xLabel={column.name}
          yLabel={"count"}
          yCol="count"
          data={histogram.result}
          xAxis={{
            scaleType: "linear",
            position: "bottom",
          }}
          grid={{ rows: true, columns: false }}
          layers={[
            {
              type: "bar",
              color: "red",
              scale: 1,
              xAccessor: (d: any) => d.binEnd,
            },
          ]}
        />
      )}

      <Flex direction="row" gap="size-200" alignItems="end">
        <Picker
          selectedKey={metric}
          onSelectionChange={(quant) => updateQuantization(quant as string)}
          label="Quantization"
        >
          <Item key="Quantile">Quantiles</Item>
          <Item key="Continuous">Continuous</Item>
          <Item key="EqualInterval">Equal</Item>
          <Item key="Manual">Manual</Item>
        </Picker>

        <NumberField
          value={noBins}
          onChange={updateBins}
          label="Number of breaks"
          maxValue={9}
          minValue={2}
          step={1}
        />
        {rangeType === "color" && (
          <ColorPaletteSelector
            selectedPalette={{
              name: selectedPaletteName,
              colors: selectedPalette,
            }}
            onSelectPalette={(palette) => updatePalette(palette, noBins)}
          />
        )}
      </Flex>

      {["Quantile", "EqualInterval", "Manual"].includes(metric) && (
        <Flex direction="column" gap="size-200">
          {domainValues &&
            domainValues.map((bin: number, index: number) => (
              <Flex>
                <NumberField
                  width="size-2000"
                  label={`Bin ${index}`}
                  key={index}
                  value={bin}
                  labelPosition="side"
                  isDisabled={metric !== "Manual"}
                  onChange={(newVal) => updateValueForBin(newVal, index)}
                />
                {rangeType === "color" && rangeValues && (
                  <ColorPickerDialog
                    color={rangeValues[index]}
                    onColorChange={(color) =>
                      updateRangeValForBin(color, index)
                    }
                  />
                )}

                {rangeType === "value" && rangeValues && (
                  <NumberField
                    width="size-2000"
                    key={`values ${index}`}
                    value={rangeValues[index]}
                    onChange={(newVal) => updateRangeValForBin(newVal, index)}
                  />
                )}
              </Flex>
            ))}
        </Flex>
      )}
    </Flex>
  );
};

interface DataDrivenModalProps {
  spec: any;
  label:string;
  rangeType: RangeType;
  datasetName: string;
  onUpdateSpec: (spec: any) => void;
}

const baseSpecForCol = (datasetName: string, column: Column) => {
  return {
    variable: column.name,
    domain: {
      metric: {
        Quantile: {
          bins: 5,
        },
      },
      dataset: datasetName,
      column: column.name,
  },
    range: "RedOr.5",
  };
};

export const DataDrivenModal: React.FC<DataDrivenModalProps> = ({
  spec,
  rangeType,
  datasetName,
  onUpdateSpec,
  label 
}) => {
  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[datasetName]
  );

  const column = dataset?.columns.find((col) => col.name === spec.variable);

  return (
    <DialogTrigger isDismissable>
      <ActionButton>{label}</ActionButton>
      <Dialog>
        <Content>
          <Flex direction="column">
            <View>
              <DatasetColumnSelector
                datasetName={datasetName}
                selectedColumn={column}
                onColumnSelected={(column) =>
                  onUpdateSpec(baseSpecForCol(datasetName, column))
                }
              />

              {column && spec && (
                <ContinuousDomain
                  column={column}
                  dataset={dataset}
                  rangeType={rangeType}
                  filters={[]}
                  mapping={spec}
                  onUpdateMapping={(newMapping) =>
                    onUpdateSpec({ ...spec, ...newMapping })
                  }
                ></ContinuousDomain>
              )}
            </View>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
