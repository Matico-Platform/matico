import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import {
  Box,
  Button,
  Heading,
  RangeInput,
  Text,
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
import {SectionHeading} from "./Utils";
import {BaseMapSelector} from "./BaseMapSelector";

export interface PaneEditorProps {
  editPath: string;
}

export const MapPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
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

  const updateBaseMap= (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          base_map: {
            "Named": change
          }
        },
      })
    );
  };

  const mapPane = _.get(spec, editPath);

  if (!mapPane) {
    return (
      <Box>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box background={"white"} pad="medium">
      <SectionHeading>
        Pane Details
      </SectionHeading>
      <PaneEditor
        position={mapPane.position}
        name={mapPane.name}
        background={mapPane.background}
        onChange={(change) => updatePane(change)}
      />

      <SectionHeading>
        Basic
      </SectionHeading>

      <BaseMapSelector baseMap={mapPane?.base_map?.Named} onChange={(baseMap)=>updateBaseMap(baseMap)}/>

      <SectionHeading>
        Layers 
      </SectionHeading>

      <SectionHeading>
        Danger Zone
      </SectionHeading>
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
