import React from "react";
import {
    Flex,
    TextField,
} from "@adobe/react-spectrum";

interface DetailsEditorProps {
    updatePane: (newName: string) => void;
    name: string;
    pane: any;
}

export const DetailsEditor: React.FC<DetailsEditorProps> = ({
    updatePane,
    pane,
    name
}) => {

    const updateName = (name: string) => {
        updatePane({
            ...pane,
            name,
        });
    };

    return (
        <Flex direction="column" width="100%" height="100%">
            <TextField
                width="100%"
                label="Pane Name"
                labelPosition="side"
                marginY={"size-150"}
                value={name}
                onChange={(name: string) => updateName(name)}
            />
        </Flex>
    );
};
