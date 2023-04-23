import React, { useEffect } from "react";
import { DatasetProvider } from "Datasets/DatasetProvider";
import { View } from "@adobe/react-spectrum";
import { AppEditor } from "./Panes/AppEditor";
import { PageEditor } from "./Panes/PageEditor";
import {
    App,
} from "@maticoapp/matico_types/spec";
import { LayerEditor } from "./Panes/LayerEditor";
import { PaneEditor } from './Editors'
import { useRecoilState, useRecoilValue } from "recoil";
import { editTargetAtom, isEditingAtom } from "Stores/StateAtoms";

export interface MaticoEditorProps {
    editActive: boolean;
    onSpecChange?: (app: App) => void;
    datasetProviders?: Array<DatasetProvider>;
}

const EditPane: React.FC = () => {
    const editTarget = useRecoilValue(editTargetAtom)

    if (!editTarget) {
        return <AppEditor />;
    }

    const { type, id, parentId } = editTarget;

    switch (type) {
        case "page":
            return <PageEditor />;
        case "pane":
            return <PaneEditor />;
        case "layer":
            return <LayerEditor layerId={id} mapId={parentId} />
        default:
            return <AppEditor />
    }
};

export const MaticoEditor: React.FC<MaticoEditorProps> = ({
    editActive,
    onSpecChange
}) => {

    const [isEditActive, setIsEditActive] = useRecoilState(isEditingAtom)

    useEffect(() => {
        setIsEditActive(editActive)
    }, [editActive])

    if (!isEditActive) return null;

    const height = {
        L: "100%",
        M: "100%",
        S: "35vh",
        base: "35vh"
    };

    return (
        <View
            overflow={"hidden auto"}
            height={height}
            paddingTop="3em"
            UNSAFE_style={{ boxSizing: "border-box" }}
        >
            <EditPane />
        </View>
    );
};
