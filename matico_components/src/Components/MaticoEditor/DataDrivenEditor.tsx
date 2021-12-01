import React from "react";
import { Box, RadioButtonGroup, Select, Text } from "grommet";
import { DatasetColumnSelector } from "./DatasetColumnSelector";
import { colors } from "../../Utils/colors";

interface DataDrivenEditor {
  type: "color" | "number";
  spec: any;
  dataset:string,
  onChange: (update: any) => void;
}

export const DataDrivenEditor: React.FC<DataDrivenEditor> = ({
  type,
  spec,
  dataset,
  onChange,
}) => {
  const column = spec.variable;
  const metric = spec.domain.metric;
  const [metricType,metricOptions] = Object.entries(metric)[0];
  const selectedColors = spec.range.split(".")[0]
  //@ts-ignore
  const bins = metricOptions.bins

  const updateMetric = (metric) => {
    onChange({
      ...spec,
      domain: {
        ...spec.domain,
        metric: {
          [metric]: metricOptions,
        },
      },
    });
  };

  const updateColumn = (column) => {
    onChange({
      ...spec,
      variable: column,
      domain: {
        ...spec.domain,
        column: column,
      },
    });
  };

  const updateColors = (colors) => {
    onChange({
      ...spec,
      range: `${colors}.${bins}`,
    });
  };

  const updateBins=(newBins)=>{
    onChange({
      ...spec,
      domain:{
        ...spec.domain,
        metric:{
          [metricType] :{bins:newBins}
        }
      },
      range:`${selectedColors}.${newBins}` 
    })
  }

  return (
    <Box>
      <Text color="lightGrey">Column</Text>
      <DatasetColumnSelector
        dataset={dataset}
        selectedColumn={column}
        onColumnSelected={updateColumn}
        label={""}
      />
      <Text color="lightGrey">Palette</Text>
      <Select
        placeholder="colors"
        options={Object.keys(colors)}
        value={selectedColors}
        onChange={({ option }) => updateColors(option)}
      />
      <Text color="lightGrey">Bins</Text>
      <Select
        placeholder="bins"
        options={[2,3,4,5,6,7,8,9]}
        value={bins}
        onChange={({ option }) => updateBins(option)}
      />
      <RadioButtonGroup
        name="lineData"
        direction="row"
        value={Object.keys(spec.domain.metric)[0]}
        options={["Quantile", "EqualInterval"]}
        onChange={(e) => {
          updateMetric(e.target.value);
        }}
      >
        {(option, { checked, focus, hover }) => (
          <Text color={checked ? "brand" : "lightGrey"}>{option}</Text>
        )}
      </RadioButtonGroup>
    </Box>
  );
};
