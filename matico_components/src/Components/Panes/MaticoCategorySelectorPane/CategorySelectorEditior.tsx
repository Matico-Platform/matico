
import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, Flex, View, Divider, TextField } from "@adobe/react-spectrum";
import { usePane } from "Hooks/usePane";
import {
  CategorySelectorPane,
  PaneRef
} from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/MaticoEditor/EditorComponents/CollapsibleSection";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { PaneEditor } from "Components/MaticoEditor/Panes/PaneEditor";

export interface PaneEditorProps {
  paneRef: PaneRef;
}

export const CategorySelectorEditor: React.FC<PaneEditorProps> = ({
  paneRef
}) => {
  const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);


  console.log("redering editor for Category Selector ", paneRef, pane);
  const categorySelectorPane = pane as CategorySelectorPane;

  const updateDataset = (dataset: string) => {
    updatePane({
      dataset: { ...categorySelectorPane.dataset, name: dataset },
      column: null
    });
  };

  const updateColumn = (column: string) => {
    updatePane({
      column: column
    });
  };

  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[categorySelectorPane.dataset?.name]
  );

  console.log("dataset is ", dataset)

  if (!categorySelectorPane) {
    return (
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }

  const columns = dataset?.columns;
  return (
    <Flex direction="column">
      <CollapsibleSection title="Basic" isOpen={true}>
        <TextField
          width="100%"
          label="name"
          value={categorySelectorPane.name}
          onChange={(name) => updatePane({ name })}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Layout" isOpen={true}>
        <PaneEditor
          position={paneRef.position}
          name={categorySelectorPane.name}
          background={"white"}
          onChange={(change) => updatePanePosition(change)}
          parentLayout={parent.layout}
          id={paneRef.id}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Data Source" isOpen={true}>
        <DatasetSelector
          selectedDataset={categorySelectorPane.dataset.name}
          onDatasetSelected={updateDataset}
        />
        {dataset && (
          <DatasetColumnSelector
            datasetName={categorySelectorPane.dataset.name}
            selectedColumn={categorySelectorPane.column}
            label="Column"
            onColumnSelected={(column) => updateColumn(column.name)}
          />
        )}
      </CollapsibleSection>
    </Flex>
  );
};
