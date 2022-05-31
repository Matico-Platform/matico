import React from "react";
import _ from "lodash";
import { PaneEditor } from "./PaneEditor";
import ReactMde from "react-mde";
import { View, Flex, Well, Text, Heading } from "@adobe/react-spectrum";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "Hooks/useSpecActions";
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";

export interface PaneEditorProps {
    editPath: string;
}

export const TextPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
    const [textPane, parentLayout] = useMaticoSpec(editPath);
    const { remove: deletePane, update: updatePane } = useSpecActions(
        editPath,
        "Text"
    );

    const handleContent = (content: string) => updatePane({ content });
    const handleUpdate = (change: any) => updatePane({ ...textPane, ...change });

    if (!textPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    const { position, name, background, content } = textPane;

    return (
        <Flex direction="column">
            <PaneEditor
                position={position}
                name={name}
                background={background}
                onChange={(change) => handleUpdate(change)}
                parentLayout={parentLayout}
            />

            <Well>
                <Heading>Content</Heading>
                <ReactMde value={content} onChange={handleContent} />
            </Well>

            <RemovePaneDialog deletePane={deletePane} />
        </Flex>
    );
};
