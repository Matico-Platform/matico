import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  Accordion,
  Box,
  Button,
  Grid,
  Heading,
  RangeInput,
  Text,
  TextInput,
  AccordionPanel,
} from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { ColorPicker } from "../Utils/ColorPicker";

export interface PaneEditorProps {
  editPath: string;
}

export const ScatterplotPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const updateDotSize = (e: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: { dot_size: parseInt(e.target.value) },
      })
    );
  };
  const updateDotColor = (color: any) => {
    dispatch(setSpecAtPath({ editPath, update: { dot_color: color } }));
  };

  const updateLabels = (change: { [name: string]: string }) => {
    const labels = scatterPlotPane.labels ?? {};
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          labels: { ...labels, ...change },
        },
      })
    );
  };

  const updateDataset = (dataset: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          dataset: { ...scatterPlotPane.dataset, name: dataset },
          x_column: null,
          y_column: null,
        },
      })
    );
  };

  const updateXColumn = (column: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          x_column: column,
        },
      })
    );
  };

  const updateYColumn = (column: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          y_column: column,
        },
      })
    );
  };

  const updatePane = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          ...scatterPlotPane,
          ...change,
        },
      })
    );
  };

  const scatterPlotPane = _.get(spec, editPath);

  if (!scatterPlotPane) {
    return (
      <Box background={"white"}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box background={"white"} pad="medium">
      <Accordion>
        <AccordionPanel label="Pane Details">
          <PaneEditor
            position={scatterPlotPane.position}
            name={scatterPlotPane.name}
            background={scatterPlotPane.background}
            onChange={(change) => updatePane(change)}
          />
        </AccordionPanel>

        <AccordionPanel label="Source">
          <DatasetSelector
            selectedDataset={scatterPlotPane.dataset.name}
            onDatasetSelected={updateDataset}
          />

          <DatasetColumnSelector
            dataset={scatterPlotPane.dataset.name}
            selectedColumn={scatterPlotPane.x_column}
            label="X Column"
            onColumnSelected={(column) => updateXColumn(column)}
          />
          <DatasetColumnSelector
            dataset={scatterPlotPane.dataset.name}
            selectedColumn={scatterPlotPane.y_column}
            label="Y Column"
            onColumnSelected={(column) => updateYColumn(column)}
          />
        </AccordionPanel>

        <AccordionPanel label="Style">
          <Grid columns={["small", "1fr"]}>
            <Text>Dot Size</Text>
            <RangeInput
              value={scatterPlotPane.dot_size}
              max={30}
              min={1}
              step={1}
              onChange={updateDotSize}
            />
            <Text>Dot Color</Text>
            <ColorPicker
              color={scatterPlotPane.dot_color}
              onChange={updateDotColor}
              outFormat="hex"
            />
          </Grid>
        </AccordionPanel>

        <AccordionPanel label="Labels">
          <Grid columns={["small", "1fr"]} gap="medium">
            <Text>Title</Text>
            <TextInput
              placeholder={"Title"}
              value={scatterPlotPane.labels?.title}
              onChange={(e) => updateLabels({ title: e.target.value })}
            />

            <Text>Sub-title</Text>
            <TextInput
              placeholder={"Sub title"}
              value={scatterPlotPane.labels?.sub_title}
              onChange={(e) => updateLabels({ sub_title: e.target.value })}
            />

            <Text>X label</Text>
            <TextInput
              placeholder={"X Label"}
              value={scatterPlotPane.labels?.x_label}
              onChange={(e) => updateLabels({ x_label: e.target.value })}
            />

            <Text>Y label</Text>
            <TextInput
              placeholder={"Y Label"}
              value={scatterPlotPane.labels?.y_label}
              onChange={(e) => updateLabels({ y_label: e.target.value })}
            />

            <Text>Attribution</Text>
            <TextInput
              placeholder={"Attribution"}
              value={scatterPlotPane.labels?.attribution}
              onChange={(e) => updateLabels({ attribution: e.target.value })}
            />
          </Grid>
        </AccordionPanel>

        <AccordionPanel label="Danger Zone">
          {confirmDelete ? (
            <Box direction="row">
              <Button primary label="DO IT!" onClick={deletePane} />
              <Button
                secondary
                label="Nah I changed my mind"
                onClick={() => setConfirmDelete(false)}
              />
            </Box>
          ) : (
            <Button
              color="neutral-4"
              label="Delete scatterPlotPane"
              onClick={() => setConfirmDelete(true)}
            />
          )}
        </AccordionPanel>
      </Accordion>
    </Box>
  );
};
