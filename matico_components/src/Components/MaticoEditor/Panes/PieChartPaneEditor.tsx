import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Box, Button, Heading, RangeInput, Text } from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "../Utils/Utils";

export interface PaneEditorProps {
  editPath: string;
}

export const PieChartPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const updateDataset = (dataset: string) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          dataset: { ...piechartPane.dataset, name: dataset },
          column: null
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

  const updatePane = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          ...piechartPane,
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

  const piechartPane = _.get(spec, editPath);

  if (!piechartPane) {
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
        position={piechartPane.position}
        name={piechartPane.name}
        background={piechartPane.background}
        onChange={(change) => updatePane(change)}
      />

      <SectionHeading>Source</SectionHeading>
      <DatasetSelector
        selectedDataset={piechartPane.dataset.name}
        onDatasetSelected={updateDataset}
      />

      <DatasetColumnSelector
        dataset={piechartPane.dataset.name}
        selectedColumn={piechartPane.column}
        label="Column"
        onColumnSelected={(column) => updateColumn(column)}
      />

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
          label="Delete Pie Pie Chart"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
