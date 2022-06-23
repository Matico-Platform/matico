import React, { useState } from "react";
import {
    Heading,
    Flex,
    TextField,
    Text,
    ActionButton,
    DialogTrigger,
    Dialog,
    Content,
    repeat,
} from "@adobe/react-spectrum";
import { DefaultGrid } from "Components/MaticoEditor/Utils/DefaultGrid";
import {Pane} from "@maticoapp/matico_types/spec";
import {v4 as uuidv4} from 'uuid'
import {PaneDefaults, IconForPaneType, AvaliablePanes} from "Components/MaticoEditor/Utils/PaneDetails" 



interface NewPaneDialogProps {
    validatePaneName?: (name: string) => boolean;
    onAddPane: (pane: Pane) => void;
}

export const NewPaneDialog: React.FC<NewPaneDialogProps> = ({
    validatePaneName,
    onAddPane
}) => {
    const [newPaneName, setNewPaneName] = useState("New Pane");
    const [errorText, setErrorText] = useState<string | null>(null);

    const attemptToAddPane = (paneType: string, close: () => void) => {
        if (newPaneName.length === 0) {
            setErrorText("Please provide a name");
        }
        if (validatePaneName) {
            if (validatePaneName(newPaneName)) {
            } else {
                setErrorText(
                    "Another pane with the same name exists, pick something else"
                );
            }
        }
        else{
              onAddPane({
                id: uuidv4(),
                name: newPaneName,
                //@ts-ignore
                type: paneType,
                ...PaneDefaults[paneType]
              });
                close();
        }
    };

    return (
        <DialogTrigger type="popover" isDismissable>
            <ActionButton isQuiet>Add</ActionButton>
            {(close: any) => (
                <Dialog>
                    <Heading>Select pane to add</Heading>
                    <Content>
                        {AvaliablePanes.map((section) => (
                            <Flex direction="column" gap="size-150">
                                <TextField
                                    label="New pane name"
                                    value={newPaneName}
                                    onChange={setNewPaneName}
                                    errorMessage={errorText}
                                    width="100%"
                                ></TextField>
                                <DefaultGrid
                                    columns={repeat(2, "1fr")}
                                    columnGap={"size-150"}
                                    rowGap={"size-150"}
                                    autoRows="fit-content"
                                    marginBottom="size-200"
                                >
                                    {section.panes.map(
                                        (pane: {
                                            name: string;
                                            label: string;
                                        }) => (
                                            <ActionButton
                                                onPress={() => {
                                                    attemptToAddPane(
                                                        pane.name,
                                                        close
                                                    );
                                                }}
                                            >
                                                {IconForPaneType(pane.name)}
                                                <Text>{pane.label}</Text>
                                            </ActionButton>
                                        )
                                    )}
                                </DefaultGrid>
                            </Flex>
                        ))}
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
