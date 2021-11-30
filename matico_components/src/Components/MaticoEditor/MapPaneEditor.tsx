import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
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
} from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "../../Stores/MaticoSpecSlice";
import { SketchPicker } from "react-color";
import { DatasetSelector } from "./DatasetSelector";
import { DatasetColumnSelector } from "./DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "./Utils";
import { BaseMapSelector } from "./BaseMapSelector";

export interface PaneEditorProps {
  editPath: string;
}

export const MapPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  const otherMapPanes = useMaticoSelector((state)=> Object.keys(state.variables.autoVariables).filter(k=>k.includes("loc")).map(k=>k.split("_")[0]))

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
          <Tabs >
            <Tab title="Manual">
              <Form
                value={mapPane?.view}
                onChange={(value) => updateView(value)}
              >
                <Grid pad={'medium'} columns={{ size: "small", count: 2 }} fill gap={"medium"}>
                  <FormField label="latitude" name="lat" htmlFor={"lat"}>
                    <TextInput name="lat" id="lat" type="number" />
                  </FormField>
                  <FormField label="longitude" name="lng" htmlFor={"lng"}>
                    <TextInput name="lng" id="lng" type="number" />
                  </FormField>
                  <FormField label="zoom" name="zoom" htmlFor={"zoom"}>
                    <TextInput name="zoom" id="zoom" type="number" />
                  </FormField>
                  <FormField
                    label="bearing"
                    bearing="bearing"
                    htmlFor={"bearing"}
                  >
                    <TextInput name="bearing" id="bearing" type="numner" />
                  </FormField>
                  <FormField label="pitch" pitch="pitch" htmlFor={"pitch"}>
                    <TextInput name="pitch" id="pitch" type="number" />
                  </FormField>
                </Grid>
                <Button label="Set From Map" onClick={setViewFromMap} />
              </Form>
            </Tab>
            <Tab title="Syced">
              <Box>
                <Text>Select another map to sync this map with</Text>
                <Select options={otherMapPanes} onChange={(value)=>{console.log("selected map",value)}} value={mapPane.view.var ? mapPane.view.var : undefined} />
              </Box>
            </Tab>
          </Tabs>
        </AccordionPanel>

        <AccordionPanel label="layers"></AccordionPanel>
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
