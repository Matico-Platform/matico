import React from "react";
import { PaneEditor } from "Components/MaticoEditor/Panes/PaneEditor";
import { View, Flex, Text, TextField } from "@adobe/react-spectrum";
import { RemovePaneDialog } from "Components/MaticoEditor//Utils/RemovePaneDialog";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";
import { CollapsibleSection } from "Components/MaticoEditor/EditorComponents/CollapsibleSection";
import { ColorPickerDialog } from "Components/MaticoEditor/Utils/ColorPickerDialog";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, parent, removePane } =
        usePane(paneRef);

    const textPane = pane.type === "text" ? pane : null;

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
                <Text>Background Color</Text>
                <ColorPickerDialog
                    color={textPane.background || { hex: "#FFFFFF" }}
                    onColorChange={(newColor) =>
                        updatePane({ background: newColor })
                    }
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

            <RemovePaneDialog deletePane={removePane} />
        </Flex>
    );
};
