import React, { useState} from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { PaneEditor } from "./PaneEditor";
import ReactMde from "react-mde";
import {View,Flex,Well,Text,Heading} from "@adobe/react-spectrum"
import "react-mde/lib/styles/css/react-mde-all.css";


export interface PaneEditorProps {
  editPath: string;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  console.log('EDITTYPE', editPath)
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

  const textPane= _.get(spec, editPath);

  if (!textPane) {
    return (
      <View>
        <Text>Failed to find component</Text>
      </View>
    );
  }
  return (
    <Flex direction='column'>

      <PaneEditor
        position={textPane.position}
        name={textPane.name}
        background={textPane.background}
        onChange={(change) => updatePane(change)}
      />

      <Well>
        <Heading>Content</Heading>
        
        <ReactMde value={textPane.content} onChange={updateContent} />
      </Well>

    </Flex>
  )
};
