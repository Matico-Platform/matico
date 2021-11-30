import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { Box, Button, Grid, Heading, RangeInput, Text } from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "../../Stores/MaticoSpecSlice";
import { DatasetSelector } from "./DatasetSelector";
import { DatasetColumnSelector } from "./DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "./Utils";
import { ColorPicker } from "./ColorPicker";

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
      <SectionHeading>Pane Details</SectionHeading>
      <PaneEditor
        position={histogramPane.position}
        name={histogramPane.name}
        background={histogramPane.background}
        onChange={(change) => updatePane(change)}
      />

      <SectionHeading>Source</SectionHeading>
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

      <SectionHeading>Style</SectionHeading>
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

      <SectionHeading>Danger Zone</SectionHeading>
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
    </Box>
  );
};
