import React from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { GeomType } from "../../../Datasets/Dataset";
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
  View,
  StatusLight,
  Divider,
  Checkbox,
} from "@adobe/react-spectrum";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { FilterEditor } from "../Utils/FilterEditor";
import { Filter } from "Datasets/Dataset";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";

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

  const isPoint = dataset?.geomType === GeomType.Point;

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
      <View>
        <StatusLight variant="negative">Failed to find component</StatusLight>
      </View>
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

  const updateFilters = (newFilters: Array<Filter>) => {
    console.log("Updating filters ", newFilters)
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          source: {
            ...layer.source,
            filters: newFilters
          }
        }
      })
    )
  }

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
        <FilterEditor
          datasetName={dataset.name}
          filters={layer.source.filters}
          onUpdateFilters={updateFilters}
        />
      </Well>
      <Well>
        <Flex direction="column" gap="size-200">
          <Heading margin="size-0">Style</Heading>
          {/* *** LINE SETTING *** */}
          <Flex gap="size-125" marginTop="size-200">
            <Divider orientation="vertical" />
            <Heading margin="size-0">Line</Heading>
          </Flex>
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
          // picker={true} TODO: add picker integrated into numberic editor
          // pickerKey={style.lineUnits}
          // pickerOptions={[{ label: "px", value: "px" }, { label: "pt", value: "pt" }]}
          // onPickerChange={(units) =>
          //   updateStyle("lineUnits", units as string)
          // }
          />
          <Flex
            alignContent={"end"}
            justifyContent={"space-between"}
          >
            <NumberField
              value={style.lineWidthScale}
              width="size-1200"
              label="Line Width Multiplier"
              maxValue={100}
              minValue={1}
              onChange={(val) => updateStyle("lineWidthScale", val)}
            />
            <Picker
              label="Line Width Units"
              alignSelf={"flex-end"}
              selectedKey={style.lineUnits}
              onSelectionChange={(units) => updateStyle("lineUnits", units)}
            >
              <Item key="meters">Meters</Item>
              <Item key="pixels">Pixels</Item>
            </Picker>
          </Flex>
          {/* *** POINT SETTINGS *** */}
          {dataset?.geomType === GeomType.Point && <>
            <Flex gap="size-125" marginTop="size-200">
              <Divider orientation="vertical" />
              <Heading margin="size-0" marginTop="size">Point Sizing</Heading>
            </Flex>
            <NumericVariableEditor
              label="Point Radius"
              datasetName={dataset.name}
              style={style.size}
              onUpdateStyle={(style) => updateStyle("size", style)}
              minVal={0}
              maxVal={2000}
            />
            <Flex
              alignContent={"end"}
              justifyContent={"space-between"}
            >
              <NumberField
                value={style.radiusScale}
                width="size-1200"
                label="Point Radius Multiplier"
                maxValue={100000}
                minValue={1}
                onChange={(val) => updateStyle("radiusScale", val)}
              />
              <Picker
                width="size-1200"
                alignSelf={"flex-end"}
                label="Point Radius Units"
                selectedKey={style.radiusUnits}
                onSelectionChange={(units) =>
                  updateStyle("radiusUnits", units as string)
                }
              >
                <Item key="meters">Meters</Item>
                <Item key="pixels">Pixels</Item>
              </Picker>
            </Flex>
          </>}

          {/* *** FILL *** */}
          {dataset?.geomType !== GeomType.Line && <>
            <Flex gap="size-125" marginTop="size-200">
              <Divider orientation="vertical" />
              <Heading margin="size-0" marginTop="size">Fill</Heading>
            </Flex>
            <ColorVariableEditor
              label="Fill Color"
              datasetName={dataset.name}
              style={style.fillColor}
              onUpdateStyle={(style) => {
                updateStyle("fillColor", style);
              }}
            />
          </>}
          {/* *** 3D *** */}
          {dataset?.geomType === GeomType.Polygon && <>
            <Flex gap="size-125" marginTop="size-200">
              <Divider orientation="vertical" />
              <Heading margin="size-0" marginTop="size">3D</Heading>
            </Flex>
            <NumericVariableEditor
              label="Elevation"
              datasetName={dataset.name}
              style={style.elevation}
              onUpdateStyle={(style) => updateStyle("elevation", style)}
              minVal={0}
              maxVal={10000}
            />
            <NumberField
              value={style.elevationScale}
              width="size-1200"
              label="Elevation Multiplier"
              maxValue={100000}
              minValue={1}
              onChange={(val) => updateStyle("elevationScale", val)}
            />
          </>}
          {/* *** VISIBILITY *** */}
          <Flex gap="size-125" marginTop="size-200">
            <Divider orientation="vertical" />
            <Heading margin="size-0" marginTop="size">Visibility</Heading>
          </Flex>

          <Flex
            alignContent={"end"}
            justifyContent={"space-between"}
          >
            <Slider
              value={style.opacity}
              label="Layer Opacity"
              onChange={(val) => updateStyle("opacity", val)}
              maxValue={1}
              minValue={0}
              step={.01}
              showValueLabel={true}
            />
            <Checkbox
              isSelected={!!style.visible}
              onChange={() => updateStyle("visible", !style.visible)}
            >
              Layer Visibility
            </Checkbox>
          </Flex>
        </Flex>
      </Well>
    </Flex>
  );
};
