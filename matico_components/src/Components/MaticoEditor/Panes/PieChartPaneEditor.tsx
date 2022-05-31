import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "../Utils/Utils";
import { Text, View } from "@adobe/react-spectrum";

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
  
  const updateSpec = (change: any) => {
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
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }
  return (
    <View>
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
        datasetName={piechartPane.dataset.name}
        selectedColumn={piechartPane.column}
        label="Column"
        onColumnSelected={(column) => updateSpec({ column: column.name })}
      />
    </View>
  );
};
