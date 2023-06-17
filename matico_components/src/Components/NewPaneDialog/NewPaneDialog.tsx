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
    Tabs,
    TabPanels,
    TabList,
    Item
} from "@adobe/react-spectrum";
import { DefaultGrid } from "Components/DefaultGrid/DefaultGrid";
import { v4 as uuidv4 } from "uuid";

import { PaneDefs } from "Panes"

import RailRightIcon from "@spectrum-icons/workflow/RailRight";
import ViewSingle from "@spectrum-icons/workflow/ViewSingle";
import ViewRow from "@spectrum-icons/workflow/ViewRow";
import ViewColumn from "@spectrum-icons/workflow/ViewColumn";
import WebPages from "@spectrum-icons/workflow/WebPages";
import { useAddPaneToContainer } from "Stores/SpecAtoms";
import { containerPresetForType, ContainerPresetTypes } from "Panes/MaticoContainerPane";
import { PaneParts } from "Panes/PaneParts";

interface NewPaneDialogProps {
    containerId: string
}

export const NewPaneDialog: React.FC<NewPaneDialogProps> = ({
    containerId
}) => {
    const addPane = useAddPaneToContainer(containerId)

    const [newPaneName, setNewPaneName] = useState("New Pane");
    const [errorText, setErrorText] = useState<string | null>(null);

    const [showContainerPresets, setShowContainerPresets] =
        useState<boolean>(false);

    const addContainerPaneType = (
        type: ContainerPresetTypes,
        close: () => void
    ) => {
        const { container, additionalPanes } = containerPresetForType(
            newPaneName,
            type
        );
        additionalPanes.forEach((p) => {
            addPane(p);
        });
        addPane(container);
        close();
    };

    const attemptToAddPane = (paneType: string, paneDetails: PaneParts, close: () => void) => {
        if (newPaneName.length === 0) {
            setErrorText("Please provide a name");
        }
        if (paneType === "container") {
            setShowContainerPresets(true);
            return;
        }
        addPane({
            ...paneDetails.defaults,
            id: uuidv4(),
            name: newPaneName,
            //@ts-ignore
            type: paneType
        });
        close();
    };


    return (
        <DialogTrigger type="popover" isDismissable>
            <ActionButton isQuiet>Add</ActionButton>
            {(close: any) => (
                <Dialog>
                    <Heading>Select pane to add</Heading>
                    <Content>
                        <Flex direction="column" gap="size-150">
                            <TextField
                                label="New pane name"
                                value={newPaneName}
                                onChange={setNewPaneName}
                                errorMessage={errorText}
                                width="100%"
                            ></TextField>
                            <Tabs>
                                <TabList>
                                    <Item key="vis">Vis</Item>
                                    <Item key="controls">Controls</Item>
                                    <Item key="layout">Layout</Item>
                                </TabList>
                                <TabPanels>
                                    <Item key="vis">
                                        <DefaultGrid
                                            columns={repeat(2, "1fr")}
                                            columnGap={"size-150"}
                                            rowGap={"size-150"}
                                            autoRows="fit-content"
                                            marginBottom="size-200"
                                        >
                                            {Object.entries(PaneDefs).filter(([, details]) => details.section === "Vis").map(([paneType, details]) =>
                                                <ActionButton
                                                    key={paneType}
                                                    onPress={() =>
                                                        attemptToAddPane(
                                                            paneType,
                                                            details,
                                                            close
                                                        )
                                                    }
                                                >
                                                    {details.icon}
                                                    <Text>{details.label}</Text>
                                                </ActionButton>
                                            )}
                                        </DefaultGrid>
                                    </Item>
                                    <Item key="controls">
                                        <DefaultGrid
                                            columns={repeat(2, "1fr")}
                                            columnGap={"size-150"}
                                            rowGap={"size-150"}
                                            autoRows="fit-content"
                                            marginBottom="size-200"
                                        >
                                            {Object.entries(PaneDefs).filter(([, details]) => details.section === "Control").map(([paneType, details]) =>
                                                <ActionButton
                                                    key={paneType}
                                                    onPress={() =>
                                                        attemptToAddPane(
                                                            paneType,
                                                            details,
                                                            close
                                                        )
                                                    }
                                                >
                                                    {details.icon}
                                                    <Text>{details.label}</Text>
                                                </ActionButton>
                                            )}
                                        </DefaultGrid>
                                    </Item>
                                    <Item key="layout">
                                        <DefaultGrid
                                            columns={repeat(2, "1fr")}
                                            columnGap={"size-150"}
                                            rowGap={"size-150"}
                                            autoRows="fit-content"
                                            marginBottom="size-200"
                                        >
                                            <ActionButton
                                                key={"sidebarHorizontal"}
                                                onPress={() =>
                                                    addContainerPaneType(
                                                        "mainSideBar",
                                                        close
                                                    )
                                                }
                                            >
                                                <RailRightIcon />
                                                <Text>Main Sidebar</Text>
                                            </ActionButton>
                                            <ActionButton
                                                key={"free"}
                                                onPress={() =>
                                                    addContainerPaneType(
                                                        "full",
                                                        close
                                                    )
                                                }
                                            >
                                                <ViewSingle />{" "}
                                                <Text>Free Layout</Text>{" "}
                                            </ActionButton>
                                            <ActionButton
                                                key={"linearHorizontal"}
                                                onPress={() =>
                                                    addContainerPaneType(
                                                        "row",
                                                        close
                                                    )
                                                }
                                            >
                                                <ViewRow />
                                                <Text>Row</Text>
                                            </ActionButton>
                                            <ActionButton
                                                key={"linearVertical"}
                                                onPress={() =>
                                                    addContainerPaneType(
                                                        "column",
                                                        close
                                                    )
                                                }
                                            >
                                                <ViewColumn />
                                                <Text>Column</Text>
                                            </ActionButton>
                                            <ActionButton
                                                key={"tabs"}
                                                onPress={() =>
                                                    addContainerPaneType(
                                                        "tabs",
                                                        close
                                                    )
                                                }
                                            >
                                                <WebPages />
                                                <Text>Tabs</Text>
                                            </ActionButton>
                                        </DefaultGrid>

                                    </Item>
                                </TabPanels>
                            </Tabs>
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
