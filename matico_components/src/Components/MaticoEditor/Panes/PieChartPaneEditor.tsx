import React, { useState } from "react";
import _ from "lodash";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "../Utils/Utils";
import { Text, View } from "@adobe/react-spectrum";
import {usePane} from "Hooks/usePane";
import {PaneRef} from "@maticoapp/matico_types/spec";

export interface PaneEditorProps {
  paneRef:PaneRef
}

export const PieChartPaneEditor: React.FC<PaneEditorProps> = ({
  paneRef,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {id,position} = paneRef
  const {pane, updatePane, updatePanePosition} = usePane(paneRef) 

  const updateDataset = (dataset: string) => {
      updatePane({
          dataset: { ...pane.dataset, name: dataset },
          column: null
      })
  };

  const updateColumn = (column: string) => {
      updatePane({
          column: column,
      })
  };

  if (!pane) {
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
        id={pane.id}
        position={position}
        name={pane.name}
        background={pane.background}
        onChange={updatePanePosition} 
        parentLayout={""}      
      />

      <SectionHeading>Source</SectionHeading>
      <DatasetSelector
        selectedDataset={pane.dataset.name}
        onDatasetSelected={updateDataset}
      />

      <DatasetColumnSelector
        datasetName={pane.dataset.name}
        selectedColumn={pane.column}
        label="Column"
        onColumnSelected={(column) => updateColumn( column.name) }
      />
    </View>
  );
};
