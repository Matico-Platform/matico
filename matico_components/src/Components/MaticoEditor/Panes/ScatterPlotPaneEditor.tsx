import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  Well,
  Text,
  Heading,
  Flex,
  View,
  TextField,
} from "@adobe/react-spectrum";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { ColorPicker } from "../Utils/ColorPicker";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { DatasetSummary } from "Datasets/Dataset";
import { LabelEditor } from "../Utils/LabelEditor";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";

export interface PaneEditorProps {
  editPath: string;
}

export const ScatterplotPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const dispatch = useMaticoDispatch();

  const scatterPlotPane = _.get(spec, editPath);

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
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

  const updateSpec = (change: any) => {
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


  const updatePaneDetails = (change:any)=>{
    dispatch(
      setSpecAtPath({
        editPath,
        update:{
          ...scatterPlotPane,
          name: change.name,
          position:{...scatterPlotPane.position, ...change.position}
        }
      })
    )
  }

  const dataset: DatasetSummary = useMaticoSelector(
    (state) => state.datasets.datasets[scatterPlotPane.dataset.name]
  );
  console.log("Scatter plot pane is ", scatterPlotPane);

  if (!scatterPlotPane) {
    return (
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }

  return (
    <Flex direction="column">
      <PaneEditor
        position={scatterPlotPane.position}
        name={scatterPlotPane.name}
        background={scatterPlotPane.background}
        onChange={updatePaneDetails}
      />
      <Well>
        <Heading>Source</Heading>
        <DatasetSelector
          selectedDataset={scatterPlotPane.dataset.name}
          onDatasetSelected={updateDataset}
        />
        {dataset && (
          <TwoUpCollapsableGrid>
            <DatasetColumnSelector
              label="X Column"
              datasetName={scatterPlotPane.dataset.name}
              selectedColumn={dataset?.columns.find(
                (c) => c.name === scatterPlotPane.x_column
              )}
              onColumnSelected={(x_column) =>
                updateSpec({ x_column: x_column.name })
              }
            />
            <DatasetColumnSelector
              label="Y Column"
              datasetName={scatterPlotPane.dataset.name}
              selectedColumn={dataset?.columns.find(
                (c) => c.name === scatterPlotPane.y_column
              )}
              onColumnSelected={(y_column) =>
                updateSpec({ y_column: y_column.name })
              }
            />
          </TwoUpCollapsableGrid>
        )}
      </Well>
      {dataset && (
        <>
          <Well>
            <Heading>Style</Heading>
            <NumericVariableEditor
              label="Dot Size"
              datasetName={scatterPlotPane.dataset.name}
              style={scatterPlotPane.dot_size}
              onUpdateStyle={(dot_size) => updateSpec({ dot_size })}
              minVal={0}
              maxVal={100}
            />

            <ColorVariableEditor
              label="Dot Color"
              datasetName={scatterPlotPane.dataset.name}
              style={scatterPlotPane.dot_color}
              onUpdateStyle={(dot_color) => updateSpec({ dot_color })}
            />
          </Well>
          <LabelEditor
            labels={scatterPlotPane.labels}
            onUpdateLabels={updateLabels}
          />
        </>
      )}
      <Well>
        <Heading>Interaction</Heading>
        {dataset && (
          <>
            <DatasetColumnSelector
              label="X Column"
              datasetName={scatterPlotPane.dataset.name}
              selectedColumn={dataset?.columns.find(
                (c) => c.name === scatterPlotPane.x_column
              )}
              onColumnSelected={(x_column) =>
                updateSpec({ x_column: x_column.name })
              }
            />
            <DatasetColumnSelector
              label="Y Column"
              datasetName={scatterPlotPane.dataset.name}
              selectedColumn={dataset?.columns.find(
                (c) => c.name === scatterPlotPane.y_column
              )}
              onColumnSelected={(y_column) =>
                updateSpec({ y_column: y_column.name })
              }
            />
          </>
        )}
      </Well>
    </Flex>
  );
};
