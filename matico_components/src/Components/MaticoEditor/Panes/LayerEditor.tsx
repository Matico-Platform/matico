import React from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Box } from "grommet";
import { setSpecAtPath } from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { PaneDefaults } from "../PaneDefaults";
import {
  Flex,
  Heading,
  NumberField,
  Picker,
  Slider,
  Item,
  Text,
  Well,
  Header,
} from "@adobe/react-spectrum";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";

export interface LayerEditorProps {
  editPath: string;
}

export const LayerEditor: React.FC<LayerEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const dispatch = useMaticoDispatch();

  const layer = _.get(spec, editPath);

  const defaults = PaneDefaults.Layer;
  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[layer.source.name]
  );

  const updateStyle = (property: string, value: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          style: { ...layer.style, [property]: value },
        },
      })
    );
  };

  const { style } = layer;

  if (!layer) {
    return (
      <Box background={"white"}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  const updateDataDriven = (newVal: any, param: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          style: {
            ...layer.style,
            [param]: newVal,
          },
        },
      })
    );
  };

  const updateDataset = (dataset: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          source: { name: dataset, filters: [] },
          style: defaults.style,
        },
      })
    );
  };
  const toggleDataDriven = (
    param: string,
    dataDriven: boolean,
    type: "color" | "number"
  ) => {
    const variable = dataset.columns.find((c) => c["type"] === "number");

    if (dataDriven) {
      const dataSpecs = {
        variable: variable?.name,
        domain: {
          dataset: layer.source.name,
          metric: {
            Quantile: {
              bins: 5,
            },
          },
          column: variable?.name,
        },
        range: "Peach.5",
      };
      dispatch(
        setSpecAtPath({
          editPath,
          update: {
            style: {
              ...layer.style,
              [param]: dataSpecs,
            },
          },
        })
      );
    } else {
      dispatch(
        setSpecAtPath({
          editPath,
          update: {
            style: {
              ...layer.style,
              [param]: defaults.style[param],
            },
          },
        })
      );
    }
  };

  const fillDataDriven = style.fillColor.variable ? "Data Driven" : "Simple";
  const lineDataDriven = style.lineColor.variable ? "Data Driven" : "Simple";

  return (
    <Flex direction="column">
      <Well>
        <Heading>Datasource</Heading>
        <DatasetSelector
          selectedDataset={dataset.name}
          onDatasetSelected={updateDataset}
        />
      </Well>
      <Well>
        <Heading>Style</Heading>

        <ColorVariableEditor
          label="Line Color"
          datasetName={dataset.name}
          style={style.lineColor}
          onUpdateStyle={(style) => {
            updateStyle("lineColor", style);
          }}
        />

        <NumericVariableEditor
          label="Line Width"
          datasetName={dataset.name}
          style={style.lineWidth}
          onUpdateStyle={(style) => updateStyle("lineWidth", style)}
          minVal={0}
          maxVal={2000}
        />
        <Picker
          width="size-1200"
          selectedKey={style}
          onSelectionChange={(units) =>
            updateStyle("lineUnits", units as string)
          }
        >
          <Item key="meters">Meters</Item>
          <Item key="pixels">Pixels</Item>
        </Picker>

        <ColorVariableEditor
          label="Fill Color"
          datasetName={dataset.name}
          style={style.fillColor}
          onUpdateStyle={(style) => {
            updateStyle("fillColor", style);
          }}
        />

        <NumericVariableEditor
          label="Elevation"
          datasetName={dataset.name}
          style={style.elevation}
          onUpdateStyle={(style) => updateStyle("elevation", style)}
          minVal={0}
          maxVal={10000}
        />
        
      </Well>
    </Flex>
  );
};
