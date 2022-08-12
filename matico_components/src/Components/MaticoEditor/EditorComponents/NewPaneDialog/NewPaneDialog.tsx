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
    repeat
} from "@adobe/react-spectrum";
import { DefaultGrid } from "Components/MaticoEditor/Utils/DefaultGrid";
import { Pane } from "@maticoapp/matico_types/spec";
import { v4 as uuidv4 } from "uuid";
import {
    PaneDefaults,
    IconForPaneType,
    AvaliablePanes,
    ContainerPresetTypes,
    containerPreset
} from "Components/MaticoEditor/Utils/PaneDetails";

import RailRightIcon from "@spectrum-icons/workflow/RailRight";
import ViewSingle from "@spectrum-icons/workflow/ViewSingle";
import ViewRow from "@spectrum-icons/workflow/ViewRow";
import ViewColumn from "@spectrum-icons/workflow/ViewColumn";
import WebPages from "@spectrum-icons/workflow/WebPages";
import {useApp} from "Hooks/useApp";

interface NewPaneDialogProps {
    validatePaneName?: (name: string) => boolean;
    onAddPane: (pane: Pane) => void;
}

export const NewPaneDialog: React.FC<NewPaneDialogProps> = ({
    validatePaneName,
    onAddPane
}) => {
    const {addPane} = useApp();
    const [newPaneName, setNewPaneName] = useState("New Pane");
    const [errorText, setErrorText] = useState<string | null>(null);
    const [showContainerPresets, setShowContainerPresets] =
        useState<boolean>(false);


    const addContainerPaneType =( type: ContainerPresetTypes, close:()=>void)=>{
      const {container,additionalPanes} = containerPreset(newPaneName, type) 
      additionalPanes.forEach((p)=>{
          addPane(p);
      })
      onAddPane(container)
      close()
    }

    const attemptToAddPane = (paneType: string, close: () => void) => {
        if (newPaneName.length === 0) {
            setErrorText("Please provide a name");
        }
        if (paneType === "container") {
            setShowContainerPresets(true);
            return;
        }
        if (validatePaneName) {
            if (validatePaneName(newPaneName)) {
            } else {
                setErrorText(
                    "Another pane with the same name exists, pick something else"
                );
            }
        } else {
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
                        <Flex
                            direction="column"
                            gap="size-150"
                        >
                            <TextField
                                label="New pane name"
                                value={newPaneName}
                                onChange={setNewPaneName}
                                errorMessage={errorText}
                                width="100%"
                            ></TextField>
                            {showContainerPresets ? (
                                <>
                                    <DefaultGrid
                                        columns={repeat(2, "1fr")}
                                        columnGap={"size-150"}
                                        rowGap={"size-150"}
                                        autoRows="fit-content"
                                        marginBottom="size-200"
                                    >
                                      <ActionButton key={"sidebarHorizontal"}
                                          onPress={()=>addContainerPaneType("mainSideBar", close)}
                                        >
                                            <RailRightIcon />
                                            <Text>Main Sidebar</Text>
                                        </ActionButton>
                                        <ActionButton key={"free"}
                                          onPress={()=>addContainerPaneType("full", close)}
                                        >
                                            <ViewSingle /> <Text>Free Layout</Text> </ActionButton>
                                        <ActionButton key={"linearHorizontal"}
                                                    
                                          onPress={()=>addContainerPaneType("row",close)}
                                        >
                                            <ViewRow />
                                            <Text>Row</Text>
                                        </ActionButton>
                                        <ActionButton key={"linearVertical"}
                                          onPress={()=>addContainerPaneType("column",close)}

                                        >
                                            <ViewColumn />
                                            <Text>Column</Text>
                                        </ActionButton>
                                        <ActionButton key={"tabs"}
                                          onPress={()=>addContainerPaneType("tabs",close)}

                                        >
                                            <WebPages/>
                                            <Text>Tabs</Text>
                                        </ActionButton>
                                    </DefaultGrid>
                                    <ActionButton
                                        onPress={() =>
                                            setShowContainerPresets(false)
                                        }
                                    >
                                        Back to panes
                                    </ActionButton>
                                </>
                            ) : (
                                AvaliablePanes.map((section) => (
                                    <DefaultGrid
                                        columns={repeat(2, "1fr")}
                                        columnGap={"size-150"}
                                        rowGap={"size-150"}
                                        autoRows="fit-content"
                                        marginBottom="size-200"
                                        key={section.sectionTitle}
                                    >
                                        {section.panes.map(
                                            (pane: {
                                                name: string;
                                                label: string;
                                            }) => (
                                                <ActionButton
                                                    key={pane.name}
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
                                ))
                            )}
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
