import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Section } from "@maticoapp/matico_spec";
import { PaneDefaults } from "../PaneDefaults";
import {
    deleteSpecAtPath,
    setCurrentEditPath,
    setSpecAtPath
} from "Stores/MaticoSpecSlice";
import {
    Heading,
    Flex,
    Item,
    TextField,
    Well,
    View,
    Text,
    ActionButton,
    Picker,
    DialogTrigger,
    Dialog,
    Content,
    Header,
    repeat,
    Grid
} from "@adobe/react-spectrum";

import HistogramIcon from "@spectrum-icons/workflow/Histogram";
import TextIcon from "@spectrum-icons/workflow/Text";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";
import MapIcon from "@spectrum-icons/workflow/MapView";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";
import PropertiesIcon from "@spectrum-icons/workflow/Properties";
import Border from "@spectrum-icons/workflow/Border";
import { DefaultGrid } from "../Utils/DefaultGrid";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { SectionLayoutEditor } from "./SectionLayoutEditor";
import { findParentContainer } from "../Utils/Utils";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "Hooks/useSpecActions";
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";

export interface SectionEditorProps {
    editPath: string;
}

const IconForPaneType = (PaneType: string) => {
    switch (PaneType) {
        case "Histogram":
            return <HistogramIcon />;
        case "PieChart":
            return <PieChartIcon />;
        case "Text":
            return <TextIcon />;
        case "Map":
            return <MapIcon />;
        case "Scatterplot":
            return <ScatterIcon />;
        case "Controls":
            return <PropertiesIcon />;
        case "Container":
            return <Border />;
    }
};

const AvaliablePanes = [
    {
        sectionTitle: "Visualizations",
        panes: [
            { name: "Map", label: "Map" },
            { name: "Histogram", label: "Histogram" },
            { name: "PieChart", label: "Pie Chart" },
            { name: "Text", label: "Text" },
            { name: "Scatterplot", label: "Scatter Plot" },
            { name: "Controls", label: "Controls" },
            { name: "Container", label: "Container" }
        ]
    }
];

interface NewPaneDialogProps {
    validatePaneName?: (name: string) => boolean;
    onAddPane: (name: string, paneType: String) => void;
}
const NewPaneDialog: React.FC<NewPaneDialogProps> = ({
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
                onAddPane(newPaneName, paneType);
                close();
            } else {
                setErrorText(
                    "Another pane with the same name exists, pick something else"
                );
            }
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
                                    {section.panes.map((pane) => (
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
                                    ))}
                                </DefaultGrid>
                            </Flex>
                        ))}
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export const ContainerPaneEditor: React.FC<SectionEditorProps> = ({
    editPath
}) => {
    const [containerPane, parentLayout] = useMaticoSpec(editPath);
    const { remove: deletePane, update: updatePane } = useSpecActions(
        editPath,
        "Container"
    );
    const validateName = (name: string) => {
        const existingNames = containerPane.panes.map(
            // @ts-ignore
            (pane) => Object.values(pane)[0].name
        );
        return !existingNames.includes(name);
    };
    const handleUpdate = (change: Section) => updatePane({ ...change });
    const handleAddPane = (paneName: string, paneType: string) => {
        handleUpdate({
            ...containerPane,
            panes: [
                ...containerPane.panes,
                // @ts-ignore
                { [paneType]: { ...PaneDefaults[paneType], name: paneName } }
            ]
        });
    };
    const handleUpdateDetails = (change: any) => {
        handleUpdate({
            ...containerPane,
            name: change.name,
            position: { ...containerPane.position, ...change.position }
        });
    };

    if (!containerPane) {
        return <View>Failed to find section in specification</View>;
    }
    return (
        <Flex width="100%" height="100%" direction="column">
            <PaneEditor
                position={containerPane.position}
                name={containerPane.name}
                background={containerPane.background}
                onChange={handleUpdateDetails}
                parentLayout={parentLayout}
            />
            <SectionLayoutEditor
                name={containerPane.name}
                layout={containerPane.layout}
                updateSection={handleUpdate}
            />
            <Well>
                <Heading>
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Text>Panes</Text>

                        <NewPaneDialog
                            onAddPane={handleAddPane}
                            validatePaneName={validateName}
                        />
                    </Flex>
                </Heading>
                <Flex gap={"size-200"} direction="column">
                    {containerPane.panes.map((pane: any, index: number) => {
                        let [paneType, paneSpecs] = Object.entries(pane)[0];
                        return (
                            <RowEntryMultiButton
                                // @ts-ignore
                                key={paneSpecs.name}
                                entryName={
                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        gap="size-100"
                                    >
                                        {IconForPaneType(paneType)}
                                        {/* @ts-ignore */}
                                        <Text>{paneSpecs.name}</Text>
                                    </Flex>
                                }
                                editPath={`${editPath}.panes.${index}.${paneType}`}
                                editType={paneType}
                            />
                        );
                    })}
                </Flex>
            </Well>
            <RemovePaneDialog deletePane={deletePane} />
        </Flex>
    );
};
