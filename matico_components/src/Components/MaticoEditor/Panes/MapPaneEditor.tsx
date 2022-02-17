import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";

import { DatasetSelector } from "../Utils/DatasetSelector";
import { PaneEditor } from "./PaneEditor";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { DefaultGrid } from "../Utils/DefaultGrid";
import { PaneDefaults } from "Components/MaticoEditor/PaneDefaults";
import {
  Flex,
  Heading,
  Well,
  // Grid,
  NumberField,
  ActionButton,
  Text,
  Item,
  Picker,
  Checkbox,
  DialogTrigger,
  Dialog,
  Content,
  TextField,
  View,
  ButtonGroup,
  // repeat,
} from "@adobe/react-spectrum";

interface AddPaneModalProps {
  onAddLayer: (name: string, dataset: string) => void;
}

const AddPaneModal: React.FC<AddPaneModalProps> = ({ onAddLayer }) => {
  const [dataset, setDataset] = useState<string | null>(null);
  const [layerName, setLayerName] = useState<string>("New layer name");

  return (
    <DialogTrigger isDismissable type="popover">
      <ActionButton>Add</ActionButton>
      {(close) => (
        <Dialog>
          <Heading>Add layer</Heading>
          <Content>
            <TextField
              width="100%"
              label="Layer name"
              value={layerName}
              onChange={setLayerName}
            />
            <DatasetSelector
              selectedDataset={dataset}
              onDatasetSelected={setDataset}
            />
          </Content>
          <ButtonGroup>
            <ActionButton
              onPress={() => {
                onAddLayer(dataset, layerName);
                close();
              }}
            >
              Add
            </ActionButton>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

export interface PaneEditorProps {
  editPath: string;
}
export const MapPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bindBothWays, setBindBothWays] = useState(false);
  const dispatch = useMaticoDispatch();

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const updatePane = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          ...mapPane,
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
          ...mapPane,
          name: change.name,
          position:{...mapPane.position, ...change.position}
        }
      })
    )
  }

  const updateBaseMap = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          base_map: {
            Named: change,
          },
        },
      })
    );
  };

  const updateView = (viewUpdate: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          view: { ...mapPane.view, ...viewUpdate },
        },
      })
    );
  };

  const mapPane = _.get(spec, editPath);
  const mapPaneCurrentView = useMaticoSelector(
    (state) => state.variables.autoVariables[`${mapPane.name}_map_loc`]
  );

  const updateSyncedView = (view) => {
    if (view.var) {
      dispatch(
        setSpecAtPath({
          editPath,
          update: {
            view: {
              var: `${view.var}_map_loc`,
              bind: view.bind,
            },
          },
        })
      );
    }
  };

  const otherMapPanes = useMaticoSelector((state) =>
    Object.keys(state.variables.autoVariables)
      .filter((k) => k.includes("_map_loc"))
      .map((k) => ({ name: k.replace("_map_loc", "") }))
      .filter((k) => k.name !== mapPane.name)
  );

  const syncedMapPaneView = useMaticoSelector((state) =>
    mapPane.view.var ? state.variables.autoVariables[mapPane.view.var] : null
  );

  const setViewFromMap = () => {
    updateView(mapPaneCurrentView.value);
  };

  if (!mapPane) {
    return (
      <View>
        <Text color="status-error">Failed to find component</Text>
      </View>
    );
  }

  const setLayerEdit = (index: number) => {
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.layers.${index}`,
        editType: "Layer",
      })
    );
  };

  const addLayer = (dataset: string, layerName: string) => {
    const newLayer = {
      ...PaneDefaults.Layer,
      source: { name: dataset },
      name: layerName,
    };
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          layers: [...mapPane.layers, newLayer],
        },
      })
    );
  };

  const stopSyncing = () => {
    updateView(syncedMapPaneView.value);
  };

  const isSynced = syncedMapPaneView ? true : false;

  const mapView = isSynced ? syncedMapPaneView.view : mapPane.view;

  return (
    <Flex direction="column">
      <PaneEditor
        position={mapPane.position}
        name={mapPane.name}
        background={mapPane.background}
        onChange={updatePaneDetails}
      />

      <Well>
        <Heading>
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="bottom"
          >
            <Text>Map Bounds</Text>
          </Flex>
        </Heading>
        <DefaultGrid>
          <NumberField
            width="size-2400"
            label="lat"
            step={0.001}
            value={mapView.lat}
            isDisabled={isSynced}
            onChange={(lat) => updateView({ lat })}
          />
          <NumberField
            width="size-2400"
            label="lng"
            step={0.001}
            value={mapView.lng}
            isDisabled={isSynced}
            onChange={(lng) => updateView({ lng })}
          />
          <NumberField
            width="size-2400"
            label="bearing"
            step={1}
            value={mapView.bearing}
            isDisabled={isSynced}
            onChange={(bearing) => updateView({ bearing })}
          />
          <NumberField
            width="size-2400"
            label="pitch"
            step={1}
            value={mapView.pitch}
            isDisabled={isSynced}
            onChange={(pitch) => updateView({ pitch })}
          />
          <NumberField
            width="size-2400"
            label="zoom"
            step={1}
            value={mapView.zoom}
            isDisabled={isSynced}
            onChange={(zoom) => updateView({ zoom })}
          />
          <ActionButton width="size-2400" onPress={setViewFromMap}>
            Set from current view
          </ActionButton>
          {otherMapPanes && otherMapPanes.length > 0 && (
            <>
              <Picker width="size-2400" items={otherMapPanes}>
                {(pane) => <Item key={pane.name}>{pane.name}</Item>}
              </Picker>
              <Checkbox name="Bind two ways" />
              <ActionButton>Start Syncing</ActionButton>
            </>
          )}
        </DefaultGrid>
      </Well>
      <Well>
        <Heading>
          <Flex direction="row" justifyContent="space-between" alignItems="end">
            <Text>Layers</Text>
            <AddPaneModal onAddLayer={addLayer} />
          </Flex>
        </Heading>
          <BaseMapSelector
            baseMap={mapPane?.base_map?.Named}
            onChange={(baseMap) => updateBaseMap(baseMap)}
          />
        <Flex marginTop={"size-200"} direction="column">
          {mapPane.layers.map((layer, index) => (
            <ActionButton onPress={()=>setLayerEdit(index)}>{layer.name}</ActionButton>
          ))}
        </Flex>
      </Well>
    </Flex>
  );
};
