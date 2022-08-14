import React from "react";
import { PaneEditor } from "./PaneEditor";
import ReactMde from "react-mde";
import { View, Flex, Well, Text, Heading, TextField } from "@adobe/react-spectrum";
import "react-mde/lib/styles/css/react-mde-all.css";
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";
import {CollapsibleSection} from "../EditorComponents/CollapsibleSection";

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
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={textPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={textPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Content" isOpen={true}>
                <ReactMde value={textPane.content} onChange={handleContent} />
            </CollapsibleSection>


            <RemovePaneDialog deletePane={removePane} />
        </Flex>
    );
};
