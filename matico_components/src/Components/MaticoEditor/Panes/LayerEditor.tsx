import React from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Box } from "grommet";
import { setSpecAtPath } from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { PaneDefaults } from "../PaneDefaults";
import { DataDrivenModal} from "../Utils/DataDrivenModal";
import {ColorPickerDialog} from '../Utils/ColorPickerDialog'
import {
  Flex,
  Heading,
  NumberField,
  Picker,
  Slider,
  Item,
  Text,
  Well,
} from "@adobe/react-spectrum";

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
    console.log("Variable is ", variable);

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
  console.log("style is ,", style, fillDataDriven, lineDataDriven);
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
        <Flex
          direction="row"
          gap="size-125"
          alignItems="start"
          justifyContent="space-between"
        >
          <Slider
            label="Line width"
            value={style.lineWidth}
            onChange={(val) => updateStyle("lineWidth", val)}
            flex={1}
            maxValue={2000}
            minValue={0}
            showValueLabel={false}
          />
          <NumberField
            value={style.lineWidth}
            width="size-1200"
            onChange={(val) => updateStyle("lineWidth", val)}
          />
          <Picker
            width="size-1200"
            selectedKey={style.lineUnits}
            onSelectionChange={(units) => updateStyle("lineUnits", units as string)}
          >
            <Item key="meters">Meters</Item>
            <Item key="pixels">Pixels</Item>
          </Picker>
        </Flex>
        <ColorPickerDialog color={style.fillColor} onColorChange={(color)=> updateStyle("fillColor", color)}/>
        <DataDrivenModal datasetName={dataset?.name} />
      </Well>
    </Flex>
  );
  // return (
  //   <Box background={"white"} pad="medium">
  //     <Accordion>
  //       <AccordionPanel label="Datasource"></AccordionPanel>
  //       <DatasetSelector
  //         selectedDataset={dataset.name}
  //         onDatasetSelected={updateDataset}
  //       />

  //       <AccordionPanel label={"Style"}>
  //         <Grid
  //           align="center"
  //           justify="start"
  //           columns={["small", "small", "1fr"]}
  //           gap="medium"
  //         >
  //           <Text>Line Width</Text>
  //           <Box />
  //           <RangeInput
  //             value={style.lineWidth}
  //             max={3000}
  //             min={1}
  //             step={1}
  //             onChange={(e) =>
  //               updateStyle("lineWidth", parseFloat(e.target.value))
  //             }
  //           />
  //           <Text>Fill Color</Text>
  //           <RadioButtonGroup
  //             name="fillData"
  //             direction="row"
  //             value={fillDataDriven}
  //             options={["Simple", "Data Driven"]}
  //             onChange={(e) => {
  //               toggleDataDriven(
  //                 "fillColor",
  //                 e.target.value === "Data Driven",
  //                 "color"
  //               );
  //             }}
  //           >
  //             {(option, { checked, focus, hover }) => (
  //               <Text color={checked ? "brand" : "lightGrey"}>{option}</Text>
  //             )}
  //           </RadioButtonGroup>
  //           {fillDataDriven === "Data Driven" ? (
  //             <DataDrivenEditor
  //               spec={style.fillColor}
  //               type="color"
  //               dataset={dataset.name}
  //               onChange={(newSpec) => updateDataDriven(newSpec, "fillColor")}
  //             />
  //           ) : (
  //             <ColorPicker
  //               color={style.fillColor}
  //               onChange={(value) => updateStyle("fillColor", value)}
  //               outFormat={"rgba"}
  //             />
  //           )}
  //           <Text>Line Color</Text>
  //           <RadioButtonGroup
  //             name="lineData"
  //             direction="row"
  //             value={lineDataDriven}
  //             options={["Simple", "Data Driven"]}
  //             onChange={(e) => {
  //               toggleDataDriven(
  //                 "lineColor",
  //                 e.target.value === "Data Driven",
  //                 "color"
  //               );
  //             }}
  //           >
  //             {(option, { checked, focus, hover }) => (
  //               <Text color={checked ? "brand" : "lightGrey"}>{option}</Text>
  //             )}
  //           </RadioButtonGroup>
  //           {lineDataDriven === "Data Driven" ? (
  //             <DataDrivenEditor
  //               spec={style.lineColor}
  //               type="color"
  //               dataset={dataset.name}
  //               onChange={(newSpec) => updateDataDriven(newSpec, "lineColor")}
  //             />
  //           ) : (
  //             <ColorPicker
  //               color={style.lineColor}
  //               onChange={(value) => updateStyle("lineColor", value)}
  //               outFormat={"rgba"}
  //             />
  //           )}
  //         </Grid>
  //       </AccordionPanel>
  //     </Accordion>
  //   </Box>
  // );
};
