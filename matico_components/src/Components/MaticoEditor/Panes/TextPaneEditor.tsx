import React from "react";
import _ from "lodash";
import { PaneEditor } from "./PaneEditor";
import ReactMde from "react-mde";
import { View, Flex, Well, Text, Heading } from "@adobe/react-spectrum";
import "react-mde/lib/styles/css/react-mde-all.css";
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, parent, removePane } =
        usePane(paneRef);

    const textPane = pane.type === "text" ? pane : null;

    const handleContent = (content: string) => updatePane({ content });

    if (!textPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    return (
        <Flex direction="column">
            <PaneEditor
                position={paneRef.position}
                name={pane.name}
                background={"white"}
                onChange={updatePanePosition}
                parentLayout={parent.layout}
                id={paneRef.id}
            />

            <Well>
                <Heading>Content</Heading>
                <ReactMde value={textPane.content} onChange={handleContent} />
            </Well>

            <RemovePaneDialog deletePane={removePane} />
        </Flex>
    );
};
