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
import { findParentContainer } from "../Utils/Utils";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "Hooks/useSpecActions";


export interface PaneEditorProps {
  editPath: string;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({
  editPath,
}) => {
  const [
    textPane,
    parentLayout
  ] = useMaticoSpec(editPath)

  const {
    remove: deletePane,
    update: updatePane
  } = useSpecActions(editPath, "Text")

  const handleContent = (content: string) => updatePane({content})
  const handleUpdate = (change: any) => updatePane({ ...textPane, ...change})
  
  const [confirmDelete, setConfirmDelete] = useState(false);

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
        onChange={(change) => handleUpdate(change)}
        parentLayout={parentLayout}
      />

      <Well>
        <Heading>Content</Heading>
        
        <ReactMde value={textPane.content} onChange={handleContent} />
      </Well>

    </Flex>
  )
};
