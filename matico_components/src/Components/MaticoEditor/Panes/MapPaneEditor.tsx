import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Tab,
  Tabs,
  Text,
  TextInput,
  Accordion,
  AccordionPanel,
  Select,
  CheckBox,
  List,
} from "grommet";
import { Edit, Add } from "grommet-icons";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "../Utils/Utils";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { PaneDefaults } from "Components/MaticoEditor/PaneDefaults";
import { MaticoDataContext } from "Contexts/MaticoDataContext/MaticoDataContext";

export interface PaneEditorProps {
  editPath: string;
}

export const MapPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bindBothWays, setBindBothWays] = useState(false);
  const [newLayerName, setNewLayerName] = useState<string>("");
  const [newLayerDataset, setNewLayerDataset] = useState<string | null>(null);
  const dispatch = useMaticoDispatch();

  const { state: datasetState } = useContext(MaticoDataContext);
  const { datasets } = datasetState;

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
    const view = {
      lat: parseFloat(viewUpdate.lat),
      lng: parseFloat(viewUpdate.lng),
      zoom: parseFloat(viewUpdate.zoom),
      bearing: parseFloat(viewUpdate.bearing),
      pitch: parseFloat(viewUpdate.pitch),
    };
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          view,
        },
      })
    );
  };

  const mapPane = _.get(spec, editPath);
  const mapPaneCurrentView = useMaticoSelector(
    (state) => state.variables.autoVariables[`${mapPane.name}_map_loc`]
  );

  const updateSyncedView = (view) => {
    console.log("View is ", view);
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
      .filter((k) => k.includes("loc"))
      .map((k) => k.split("_")[0])
      .filter((k) => k !== mapPane.name)
  );

  const syncedMapPaneView = useMaticoSelector((state) =>
    mapPane.view.var ? state.variables.autoVariables[mapPane.view.var] : null
  );

  const setViewFromMap = () => {
    updateView(mapPaneCurrentView.value);
  };

  if (!mapPane) {
    return (
      <Box>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }

  const setLayerEdit = (index: number) => {
    console.log("setting layer edit ", index);
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.layers.${index}`,
        editType: "Layer",
      })
    );
  };

  const addLayer = () => {
    const newLayer = {
      ...PaneDefaults.Layer,
      source: { name: newLayerDataset },
      name: newLayerName,
    };
    setNewLayerName("");
    setNewLayerDataset(null);
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

  return (
    <Box fill gap={"medium"} background={"white"} pad="medium">
      <Accordion multiple={true}>
        <AccordionPanel label={"Pane Details"}>
          <PaneEditor
            position={mapPane.position}
            name={mapPane.name}
            background={mapPane.background}
            onChange={(change) => updatePane(change)}
          />
        </AccordionPanel>
        <AccordionPanel label={"Base Map"}>
          <BaseMapSelector
            baseMap={mapPane?.base_map?.Named}
            onChange={(baseMap) => updateBaseMap(baseMap)}
          />
        </AccordionPanel>

        <AccordionPanel label="View">
          <Box gap={"medium"}>
            <Form
              value={
                mapPane?.view.var ? syncedMapPaneView?.value : mapPane?.view
              }
              onChange={(value) => updateView(value)}
            >
              <Grid
                pad={"medium"}
                columns={{ size: "fill", count: 2 }}
                fill
                gap={"medium"}
              >
                <FormField
                  label="latitude"
                  name="lat"
                  htmlFor={"lat"}
                  width={"small"}
                  disabled={isSynced}
                >
                  <TextInput name="lat" id="lat" type="number" />
                </FormField>
                <FormField
                  label="longitude"
                  name="lng"
                  width="small"
                  htmlFor={"lng"}
                  disabled={isSynced}
                >
                  <TextInput name="lng" id="lng" type="number" />
                </FormField>
                <FormField
                  label="zoom"
                  name="zoom"
                  htmlFor={"zoom"}
                  width={"small"}
                  disabled={isSynced}
                >
                  <TextInput name="zoom" id="zoom" type="number" />
                </FormField>
                <FormField
                  label="bearing"
                  bearing="bearing"
                  htmlFor={"bearing"}
                  width={"small"}
                  disabled={isSynced}
                >
                  <TextInput name="bearing" id="bearing" type="numner" />
                </FormField>
                <FormField
                  label="pitch"
                  pitch="pitch"
                  htmlFor={"pitch"}
                  disabled={isSynced}
                  width={"small"}
                >
                  <TextInput name="pitch" id="pitch" type="number" />
                </FormField>
              </Grid>
            </Form>
            <Button
              label="Set From Map"
              onClick={setViewFromMap}
              disabled={isSynced}
            />
            <Box>
              {isSynced ? (
                <>
                  <Text>Currently </Text>
                  <Button
                    label={`Stop syncing with ${mapPane.view.var}`}
                    onClick={stopSyncing}
                  />
                </>
              ) : (
                <Form
                  onSubmit={({ value }) => {
                    updateSyncedView(value);
                  }}
                >
                  <Box direction="row">
                    <FormField name={"var"}>
                      <Select
                        name={"var"}
                        placeholder="Or select another map to sync this map with"
                        options={otherMapPanes}
                      />
                    </FormField>
                    <FormField name={"bind"}>
                      <CheckBox id="bind" name="bind" label="Bind two ways" />
                    </FormField>
                  </Box>
                  <Button type="submit" primary label="Start Syncing" />
                </Form>
              )}
            </Box>
          </Box>
        </AccordionPanel>

        <AccordionPanel label="layers">
          <List data={mapPane.layers}>
            {(layer, index) => {
              return (
                <Box direction={"row"} justify={"between"} align={"center"}>
                  <Box flex>
                    <Text textAlign="start">{layer.name}</Text>
                  </Box>
                  <Button icon={<Edit />} onClick={() => setLayerEdit(index)} />
                </Box>
              );
            }}
          </List>

          <Box>
            <Text>New Layer</Text>
            <DatasetSelector
              selectedDataset={newLayerDataset}
              onDatasetSelected={setNewLayerDataset}
            />
            <TextInput
              name="name"
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="Layer name"
              id="LayerName"
            />
            <Button plain={false} label="Add Layer" onClick={addLayer} type="submit" />
          </Box>
        </AccordionPanel>
      </Accordion>

      <SectionHeading>Danger Zone</SectionHeading>
      {confirmDelete ? (
        <Box direction="row">
          <Button primary label="DO IT!" onClick={deletePane} />
          <Button
            plain={false}
            secondary
            label="Nah I changed my mind"
            onClick={() => setConfirmDelete(false)}
          />
        </Box>
      ) : (
        <Button
          plain={false}
          color="neutral-4"
          label="Delete mapPane"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
