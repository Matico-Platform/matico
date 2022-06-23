import React, { useEffect, useState } from "react";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { EditElement, setEditing } from "../../Stores/MaticoSpecSlice";
import { Editors } from "./Editors";
import { DatasetProvider } from "Datasets/DatasetProvider";
import {
  View,
} from "@adobe/react-spectrum";
import { AppEditor } from "./Panes/AppEditor";
import {PageEditor} from "./Panes/PageEditor";
import {App, Page,PaneRef} from "@maticoapp/matico_types/spec";

export interface MaticoEditorProps {
  editActive: boolean;
  onSpecChange?: (app: App) => void;
}

const EditPane: React.FC<{element: EditElement | null}>= ({element})=>{

  const pages = useMaticoSelector(
    (state) => state.spec.spec.pages
  );

  console.log("Rendering edit pane for element ", element)

  if(element?.type==='page'){
    return(
      <PageEditor id={element.id} />
    )
  }
  else if(element?.type==='pane'){
    const page = pages.find((p:Page)=>p.panes.find(pane=>pane.id===element.id)) 
    const paneRef = page.panes.find((p:PaneRef)=>p.id===element.id)
    const Editor  = Editors[paneRef.type]
    return <Editor paneRef={paneRef} />
  }
  else{
    return <AppEditor/>
  }
}

export const MaticoEditor: React.FC<MaticoEditorProps> = ({
  editActive,
  onSpecChange,
}) => {
  const dispatch = useMaticoDispatch();

  const { spec, currentEditElement } = useMaticoSelector(
    (state) => state.spec
  );
  const [tabKey, setTabKey] = useState<string>("Components");

  useEffect(() => {
    if (spec) {
      localStorage.setItem("code", JSON.stringify(spec));
    }
    if (onSpecChange) {
      onSpecChange(spec);
    }
  }, [JSON.stringify(spec)]);

  useEffect(() => {
    dispatch(setEditing(editActive));
  }, [editActive]);


  useEffect(() => {
    if (editActive) {
      setTabKey("Components")
    }

  }, [editActive, currentEditElement])

  if (!editActive) return null;

  const height = {
    L: "95vh",
    M: "95vh",
    S: "35vh",
    base: "35vh",
  };

  return ( //@ts-ignore

    <View overflow={"hidden auto"} height={height} paddingTop="3em">
      <EditPane element={currentEditElement}/>
    </View>
  );
};
