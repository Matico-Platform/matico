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

import HistogramIcon from "@spectrum-icons/workflow/Histogram";
import TextIcon from "@spectrum-icons/workflow/Text";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";
import MapIcon from "@spectrum-icons/workflow/MapView";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";
import PropertiesIcon from "@spectrum-icons/workflow/Properties";
import Border from "@spectrum-icons/workflow/Border";
import { DefaultGrid } from "Components/MaticoEditor/Utils/DefaultGrid";

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
            { name: "map", label: "Map" },
            { name: "histogram", label: "Histogram" },
            { name: "pieChart", label: "Pie Chart" },
            { name: "text", label: "Text" },
            { name: "scatterplot", label: "Scatter Plot" },
            { name: "controls", label: "Controls" },
            { name: "container", label: "Container" }
        ]
    }
];

interface NewPaneDialogProps {
    validatePaneName?: (name: string) => boolean;
    onAddPane: (name: string, paneType: String) => void;
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
