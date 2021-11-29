import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { Box, Button, Heading, RangeInput, Text } from "grommet";
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
    dispatch(setSpecAtPath({ editPath, update: { dot_color: color.hex } }));
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

  // const editPane = (index) => {
  //   console.log("SECTION is ",index)
  //   dispatch(
  //     setCurrentEditPath({
  //       editPath: `${editPath}.${index}`,
  //       editType: "Pane",
  //     })
  //   );
  // };

  const scatterPlotPane = _.get(spec, editPath);

  if (!scatterPlotPane) {
    return (
      <Box background={'white'}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box background={'white'} pad="medium">
      <SectionHeading>Pane Details</SectionHeading>
      <PaneEditor
        position={scatterPlotPane.position}
        name={scatterPlotPane.name}
        background={scatterPlotPane.background}
        onChange={(change) => updatePane(change)}
      />

      <SectionHeading>Source</SectionHeading>
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

      <SectionHeading>Style</SectionHeading>
      <Box direction="row" fill="horizontal" gap="medium">
        <Text>Dot Size</Text>
        <RangeInput
          value={scatterPlotPane.dot_size}
          max={500}
          min={1}
          step={1}
          onChange={updateDotSize}
        />
      </Box>
      <Box direction="row" fill="horizontal" gap="medium">
        <Text>Dot Color</Text>
        <SketchPicker
          color={scatterPlotPane.dot_color}
          onChangeComplete={updateDotColor}
        />
      </Box>

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
          label="Delete scatterPlotPane"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
