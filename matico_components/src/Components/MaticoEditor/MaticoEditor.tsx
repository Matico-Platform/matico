import React, { useEffect, useState } from "react";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { EditElement, setEditing } from "../../Stores/MaticoSpecSlice";
import { Editors } from "./Editors";
import { DatasetProvider } from "Datasets/DatasetProvider";
import { View } from "@adobe/react-spectrum";
import { AppEditor } from "./Panes/AppEditor";
import { PageEditor } from "./Panes/PageEditor";
import {
    App,
    Page,
    Pane,
    PaneRef,
    ContainerPane,
    MapPane
} from "@maticoapp/matico_types/spec";
import {LayerEditor} from "./Panes/LayerEditor";

export interface MaticoEditorProps {
    editActive: boolean;
    onSpecChange?: (app: App) => void;
    datasetProviders?: Array<DatasetProvider>;
}

const EditPane: React.FC<{ element: EditElement | null }> = ({ element }) => {
    const pages = useMaticoSelector((state) => state.spec.spec.pages);
    const panes = useMaticoSelector((state) => state.spec.spec.panes);

    if (!element) {
        return <AppEditor />;
    }
    const { type, id, parentId } = element;


    if (type === "page") {
        return <PageEditor id={id} />;
    } else if (type === "pane") {
        const parent = parentId
            ? (panes.find((p: Pane) => p.id === parentId) as ContainerPane)
            : pages.find((p: Page) =>
                  p.panes.find((pane: PaneRef) => pane.id === id)
              );

        const paneRef = parent?.panes.find((p: PaneRef) => p.id === id);

        if (parent && paneRef) {
            //@ts-ignore
            const Editor = Editors[paneRef.type];
            return <Editor paneRef={paneRef} />;
        }
    }
    else if(type==='layer'){
      console.log("Attempting to get layer ")
      const maps: Array<MapPane>= panes.filter((p:Pane)=> ['map','staticMap'].includes(p.type)) as Array<MapPane>
      console.log("Maps ", maps)
      const map = maps.find(m=>m.layers.find(l=>l.id===element.id)) 
      console.log("Map ", map)
      return(<LayerEditor layerId={element.id} mapId={map.id}/>)
    }
    return <AppEditor />;
};

export const MaticoEditor: React.FC<MaticoEditorProps> = ({
    editActive,
    onSpecChange
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
            setTabKey("Components");
        }
    }, [editActive, currentEditElement]);

    if (!editActive) return null;

    const height = {
        L: "95vh",
        M: "95vh",
        S: "35vh",
        base: "35vh"
    };

    if(spec){
      return (
          //@ts-ignore

          <View overflow={"hidden auto"} height={height} paddingTop="3em">
              <EditPane element={currentEditElement} />
          </View>
      );

    }
    else{
      return(
          <View overflow={"hidden auto"} height={height} paddingTop="3em">
            <h1>Loading</h1>
          </View>
      )
    }

};
