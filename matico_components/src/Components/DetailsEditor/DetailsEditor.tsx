import React from "react";
import { Flex, TextField } from "@adobe/react-spectrum";
import { Pane } from "@maticoapp/matico_types/spec";

interface DetailsEditorProps {
    updatePane: (update: Partial<Pane>) => void;
    pane: Pane;
}

export const DetailsEditor: React.FC<DetailsEditorProps> = ({
    updatePane,
    pane
}) => {
    const updateName = (name: string) => {
        updatePane({
            name
        });
    };

    return (
        <Flex direction="column" width="100%" height="100%">
            <TextField
                width="100%"
                label="Pane Name"
                labelPosition="side"
                marginY={"size-150"}
                value={pane.name}
                onChange={(name: string) => updateName(name)}
            />
        </Flex>
    );
};
