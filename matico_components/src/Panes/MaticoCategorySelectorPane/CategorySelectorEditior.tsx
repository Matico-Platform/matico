import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, Flex, View, } from "@adobe/react-spectrum";
import { CategorySelectorPane, PaneRef } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/CollapsibleSection";
import { DatasetSelector } from "Components/DatasetSelector/DatasetSelector";
import { DatasetColumnSelector } from "Components/DatasetColumnSelector/DatasetColumnSelector";
import { useRecoilState } from "recoil";
import { panesAtomFamily } from "Stores/SpecAtoms";

export interface PaneEditorProps {
  paneRef: PaneRef;
}

export const CategorySelectorEditor: React.FC<PaneEditorProps> = ({
  paneRef
}) => {

  const [pane, updatePane] = useRecoilState(panesAtomFamily(paneRef.paneId))
  if (pane.type !== 'categorySelector') { throw Error("Was expecting this pane to be a categorySelector") }

  const { type, ...categorySelectorPane } = pane as { type: "categorySelector" } & CategorySelectorPane;

  const updateDataset = (dataset: string) => {
    updatePane({
      ...categorySelectorPane,
      //@ts-ignore
      dataset: { ...categorySelectorPane.dataset, name: dataset },
      column: null
    });
  };

  const updateColumn = (column: string) => {
    updatePane({
      ...categorySelectorPane,
      //@ts-ignore
      column: column
    });
  };

  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[categorySelectorPane.dataset?.name]
  );

  if (!categorySelectorPane) {
    return (
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }

  return (
    <Flex direction="column">
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
