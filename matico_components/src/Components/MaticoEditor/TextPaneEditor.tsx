import React, { useState} from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { Box, Button,  Text } from "grommet";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "../../Stores/MaticoSpecSlice";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "./Utils";
import MDEditor from "@uiw/react-md-editor";

export interface PaneEditorProps {
  editPath: string;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const deletePane = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const updateContent = (content: string) =>
    dispatch(setSpecAtPath({ editPath: editPath, update: { content } }));


  const updatePane = (change: any) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          ...textPane,
          ...change,
        },
      })
    );
  };

  // const editPane = (index) => {
  //   console.log("SECTION is ",index)
  //   dispatch(
  //     setCurrentEditPath({
  //       editPath: `${editPath}.${index}`,
  //       editType: "Pane",
  //     })
  //   );
  // };

  const textPane= _.get(spec, editPath);

  if (!textPane) {
    return (
      <Box background={"white"}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box pad="medium" background={"white"}>
      <SectionHeading>Pane Details</SectionHeading>
      <PaneEditor
        position={textPane.position}
        name={textPane.name}
        background={textPane.background}
        onChange={(change) => updatePane(change)}
      />

      <SectionHeading>Content</SectionHeading>
      <SectionHeading>Content</SectionHeading>
      <MDEditor preview="edit" value={textPane.content} onChange={updateContent} />

      <SectionHeading>Danger Zone</SectionHeading>
      {confirmDelete ? (
        <Box direction="row">
          <Button primary label="DO IT!" onClick={deletePane} />
          <Button
            secondary
            label="Nah I changed my mind"
            onClick={() => setConfirmDelete(false)}
          />
        </Box>
      ) : (
        <Button
          color="neutral-4"
          label="Delete textPane"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
