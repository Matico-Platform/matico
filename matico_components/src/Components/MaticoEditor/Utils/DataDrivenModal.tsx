import React, { useEffect, useState, useCallback } from "react";
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
  Text,
  Well,
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
import { TwoUpCollapsableGrid } from "./TwoUpCollapsableGrid";
import { scaleThreshold } from 'd3-scale';

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

  const sanitizedHistogramData = histogram?.result?.filter(f => f).map((result: any) => ({
    ...result,
    count: isNaN(result.count) ? 0 : result.count,
  }))||[]
  
  const colorFunc = quantiles?.result && rangeValues 
    ? scaleThreshold()
      .domain([...quantiles.result.slice(1,), Math.pow(10, 10)])
      .range(rangeValues) 
    : () => 'gray';
      
  return (
    <View overflow="hidden auto" marginTop="size-200">
      <TwoUpCollapsableGrid>
        <Flex direction="column" width="100%">
          <TwoUpCollapsableGrid>
            <Picker
              width="100%"
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
              width="100%"
              value={noBins}
              onChange={updateBins}
              label="Number of breaks"
              maxValue={9}
              minValue={2}
              step={1}
            />
          </TwoUpCollapsableGrid>
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
          <Well marginStart="size-300">
            <Flex direction="column">
              {domainValues &&
                domainValues.map((bin: number, index: number) => (
                  <Flex>
                    {rangeType === "color" && rangeValues && (
                      <ColorPickerDialog
                        color={rangeValues[index]}
                        onColorChange={(color) =>
                          updateRangeValForBin(color, index)
                        }
                        width="size-450"
                        height="size-350"
                      />
                    )}
                    {metric === "Manual" ? <NumberField
                      aria-label={`Bin ${index+1}`}
                      key={index}
                      value={bin}
                      labelPosition="side"
                      isDisabled={metric !== "Manual"}
                      onChange={(newVal) => updateValueForBin(newVal, index)}
                    /> : <Text key={index} marginX="size-200" marginTop="size-50">{bin && index === domainValues.length-1 ? `> ${bin && bin.toFixed(1)}` :`${domainValues[index] && domainValues[index].toFixed(1)} to ${domainValues[index+1] && domainValues[index+1].toFixed(1)}`}</Text>}
                    {rangeType === "value" && rangeValues && (
                      <NumberField
                        key={`values ${index}`}
                        value={rangeValues[index]}
                        onChange={(newVal) => updateRangeValForBin(newVal, index)}
                      />
                    )}
                  </Flex>
                ))}
            </Flex>
          </Well>
        )}
      </TwoUpCollapsableGrid>
      
      {histogram && histogram.state === "Done" && (
        <Well marginTop="size-200">
          <MaticoChart
            // width={300}
            height={200}
            xExtent={extent}
            xCol="binStart"
            xLabel={column.name}
            yLabel={"Count"}
            yCol="count"
            data={sanitizedHistogramData}
            xAxis={{
              scaleType: "linear",
              position: "bottom",
            }}
            yAxis={{
              scaleType: "linear",
              position: "left",
            }}
            // yExtent={[0,1500]}
            grid={{ rows: true, columns: false }}
            margin={{
              top: 10,
              bottom: 25,
              left:60,
              right:50
            }}
            layers={[
              {
                type: "bar",
                color: (d: any) => colorFunc(d.binStart),
                scale: 1,
                padding:0.1,
                xAccessor: (d: any) => (d.binEnd + d.binStart)/2,
              },
            ]}
          />
        </Well>
      )}
    </View>
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
            <Heading>Data Driven Styling</Heading>
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
