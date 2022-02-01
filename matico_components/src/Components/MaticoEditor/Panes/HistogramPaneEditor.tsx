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

export const HistogramPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const updateColor = (color: any) => {
    dispatch(setSpecAtPath({ editPath, update: { color } }));
  };

  const updateLabels = (change: { [name: string]: string }) => {
    const labels = histogramPane.labels ?? {};
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
          dataset: { ...histogramPane.dataset, name: dataset },
          column: null,
        },
      })
    );
  };

  const updateColumn = (column: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          column: column,
        },
      })
    );
  };

  const updateBins = (e: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: { maxbins: parseInt(e.target.value) },
      })
    );
  };

  const updatePane = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          ...histogramPane,
          ...change,
        },
      })
    );
  };

  // const editPane = (index) => {
  //   console.log("SECTION is ",index)
  //   dispatch(
  //     setCurrentEditPath({
  //       editPath: `${editPath}.${index}`,
  //       editType: "Pane",
  //     })
  //   );
  // };

  const histogramPane = _.get(spec, editPath);

  if (!histogramPane) {
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
            position={histogramPane.position}
            name={histogramPane.name}
            background={histogramPane.background}
            onChange={(change) => updatePane(change)}
          />
        </AccordionPanel>

        <AccordionPanel label="Data Source">
          <DatasetSelector
            selectedDataset={histogramPane.dataset.name}
            onDatasetSelected={updateDataset}
          />

          <DatasetColumnSelector
            dataset={histogramPane.dataset.name}
            selectedColumn={histogramPane.column}
            label="Column"
            onColumnSelected={(column) => updateColumn(column)}
          />
        </AccordionPanel>

        <AccordionPanel label="Style">
          <Grid columns={["small", "1fr"]} gap="medium">
            <Text>Max Number of Bins:{histogramPane.maxbins}</Text>
            <RangeInput
              value={histogramPane.maxbins}
              max={100}
              min={5}
              step={1}
              onChange={updateBins}
            />
            <Text>Color</Text>
            <ColorPicker
              color={histogramPane.color}
              onChange={updateColor}
              outFormat="hex"
            />
          </Grid>
        </AccordionPanel>

        <AccordionPanel label="Labels">
          <Grid columns={["small", "1fr"]} gap="medium">
            <Text>Title</Text>
            <TextInput
              placeholder={"Title"}
              value={histogramPane.labels?.title}
              onChange={(e) => updateLabels({ title: e.target.value })}
            />

            <Text>Sub-title</Text>
            <TextInput
              placeholder={"Sub title"}
              value={histogramPane.labels?.sub_title}
              onChange={(e) => updateLabels({ sub_title: e.target.value })}
            />

            <Text>X label</Text>
            <TextInput
              placeholder={"X Label"}
              value={histogramPane.labels?.x_label}
              onChange={(e) => updateLabels({ x_label: e.target.value })}
            />

            <Text>Y label</Text>
            <TextInput
              placeholder={"Y Label"}
              value={histogramPane.labels?.y_label}
              onChange={(e) => updateLabels({ y_label: e.target.value })}
            />

            <Text>Attribution</Text>
            <TextInput
              placeholder={"Attribution"}
              value={histogramPane.labels?.attribution}
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
              label="Delete Histogram"
              onClick={() => setConfirmDelete(true)}
            />
          )}
        </AccordionPanel>
      </Accordion>
    </Box>
  );
};
