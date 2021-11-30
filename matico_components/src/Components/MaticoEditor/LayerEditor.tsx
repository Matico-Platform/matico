import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import {
  Accordion,
  AccordionPanel,
  Box,
  Button,
  Heading,
  RangeInput,
  Text,
} from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "../../Stores/MaticoSpecSlice";
import { SketchPicker } from "react-color";
import { DatasetSelector } from "./DatasetSelector";
import { DatasetColumnSelector } from "./DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "./Utils";
import { ColorPicker } from "./ColorPicker";

export interface LayerEditorProps {
  editPath: string;
}

export const LayerEditor: React.FC<LayerEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const dispatch = useMaticoDispatch();

  const layer = _.get(spec, editPath);

  const updateDataset = (dataset: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          dataset: { ...layer.dataset, name: dataset },
        },
      })
    );
  };

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
  return (
    <Box background={"white"} pad="medium">
      <Accordion>
        <AccordionPanel label="Datasource"></AccordionPanel>

        <AccordionPanel label={"Style"}>
          <Box direction="row" fill="horizontal" gap="medium">
            <Text>Line Width</Text>
            <RangeInput
              value={style.lineWidth}
              max={3000}
              min={1}
              step={1}
              onChange={(e) =>
                updateStyle("lineWidth", parseFloat(e.target.value))
              }
            />
          </Box>
          <Box direction="row" fill="horizontal" gap="medium">
            <Text>Fill Color</Text>
            <ColorPicker
              color={style.fillColor}
              onChange={(value) => updateStyle("fillColor", value)}
              outFormat={"rgba"}
            />
          </Box>
          <Box direction="row" fill="horizontal" gap="medium">
            <Text>Line Color</Text>
            <ColorPicker
              color={style.lineColor}
              onChange={(value) => updateStyle("lineColor", value)}
              outFormat={"rgba"}
            />
          </Box>
        </AccordionPanel>
      </Accordion>
    </Box>
  );
};
