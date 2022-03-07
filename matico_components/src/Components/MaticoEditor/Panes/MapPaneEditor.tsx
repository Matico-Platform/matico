import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";

import { DatasetSelector } from "../Utils/DatasetSelector";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { PaneEditor } from "./PaneEditor";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { DefaultGrid } from "../Utils/DefaultGrid";
import { PaneDefaults } from "Components/MaticoEditor/PaneDefaults";
import {
  Flex,
  Heading,
  Well,
  Grid,
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

  const startSyncing = (pane) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          view: { var: `${pane}_map_loc`, bind: true },
        },
      })
    );
  };

  const stopSyncing = () => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          view: { ...syncedMapPaneView.value, var: "", bind: null }
        }
      })
    );
  };

  const isSynced = syncedMapPaneView ? true : false;
  const isBound = mapPane?.view?.bind ? true : false;
  const mapView = isSynced ? syncedMapPaneView.value : mapPane.view;

  const toggleBind = () => {
    updateView({
      bind: !isBound,
    });
  };

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
        <Flex direction="column">
          <TwoUpCollapsableGrid>
            <NumberField
              width="100%"
              label="lat"
              step={0.001}
              value={mapView.lat}
              isDisabled={isSynced}
              onChange={(lat) => updateView({ lat })}
            />
            <NumberField
              width="100%"
              label="lng"
              step={0.001}
              value={mapView.lng}
              isDisabled={isSynced}
              onChange={(lng) => updateView({ lng })}
            />
          </TwoUpCollapsableGrid>
          <TwoUpCollapsableGrid>
            <NumberField
              width="100%"
              label="bearing"
              step={1}
              value={mapView.bearing}
              isDisabled={isSynced}
              onChange={(bearing) => updateView({ bearing })}
            />
            <NumberField
              width="100%"
              label="pitch"
              step={1}
              value={mapView.pitch}
              isDisabled={isSynced}
              onChange={(pitch) => updateView({ pitch })}
            />
          </TwoUpCollapsableGrid>
          <NumberField
            width={{L: "50%", M: "100%", S: "100%", base: "100%"}}
            label="zoom"
            step={1}
            value={mapView.zoom}
            isDisabled={isSynced}
            onChange={(zoom) => updateView({ zoom })}
          />
          {!isSynced && <ActionButton
            width="100%"
            onPress={setViewFromMap}
            marginTop="size-200"
            marginBottom="size-200"
          >
            Set from current view
          </ActionButton>}
          {otherMapPanes && otherMapPanes.length > 0 && (
            <Picker
              width="100%"
              label="Sync Map View"
              items={otherMapPanes}
              selectedKey={
                mapPane?.view?.var && mapPane.view.var.split("_map_loc")[0]
              }
              onSelectionChange={startSyncing}
            >
              {(pane) => <Item key={pane.name}>{pane.name}</Item>}
            </Picker>
          )}
          {isSynced && (
            <>
              <Checkbox isSelected={isBound} onChange={toggleBind}>
                Sync both maps
              </Checkbox>
              <ActionButton
                width="100%"
                onPress={stopSyncing}
                marginTop="size-200"
                marginBottom="size-200"
                isDisabled
              >
                Stop Syncing Map View
              </ActionButton>
            </>
          )}
        </Flex>
      </Well>
      <Well>
        <Heading>
          <Flex direction="row" justifyContent="space-between" alignItems="end">
            <Text>Layers</Text>
            <AddPaneModal onAddLayer={addLayer} />
          </Flex>
        </Heading>
        <Flex marginBottom={"size-200"} direction="column">
          {mapPane.layers.map((layer, index) => 
            <RowEntryMultiButton
              key={layer.name}
              entryName={layer.name}
              editPath={`${editPath}.layers.${index}`}
              editType="Layer"
              />
          )}
        </Flex>
        <BaseMapSelector
          baseMap={mapPane?.base_map?.Named}
          onChange={(baseMap) => updateBaseMap(baseMap)}
        />
      </Well>
    </Flex>
  );
};
