import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Well, Text, Heading, Flex, View } from "@adobe/react-spectrum";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { LabelEditor } from "../Utils/LabelEditor";

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

  const updatePaneDetails = (change:any)=>{
    dispatch(
      setSpecAtPath({
        editPath,
        update:{
          ...histogramPane,
          name: change.name,
          position:{...histogramPane.position, ...change.position}
        }
      })
    )
  }
  const histogramPane = _.get(spec, editPath);

  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[histogramPane.dataset.name]
  );

  if (!histogramPane) {
    return (
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }

  return (
    <Flex direction="column">
      <PaneEditor
        position={histogramPane.position}
        name={histogramPane.name}
        background={histogramPane.background}
        onChange={(change) => updatePaneDetails(change)}
      />
      <Well>
        <Heading>Data Source</Heading>
        <DatasetSelector
          selectedDataset={histogramPane.dataset.name}
          onDatasetSelected={updateDataset}
        />
        <DatasetColumnSelector
          datasetName={histogramPane.dataset.name}
          selectedColumn={histogramPane.column}
          label="Column"
          onColumnSelected={(column) => updateColumn(column.name)}
        />
      </Well>
      {dataset && (
        <>
          <Well>
            <Heading>Style</Heading>
            <NumericVariableEditor
              label="Number of bins"
              minVal={2}
              maxVal={100}
              style={histogramPane.maxbins}
              datasetName={histogramPane.dataset.name}
              onUpdateStyle={(maxbins) => updatePane({ maxbins })}
            />

            <ColorVariableEditor
              label="Color"
              style={histogramPane.color}
              datasetName={histogramPane.dataset.name}
              onUpdateStyle={(color) => updatePane({ color })}
            />
          </Well>

          <LabelEditor
            labels={histogramPane.labels}
            onUpdateLabels={updateLabels}
          />
        </>
      )}
    </Flex>
  );
};
