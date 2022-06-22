import React, { useState } from "react";
import _ from "lodash";
import { PaneDefaults } from "../PaneDefaults";
import {
    Heading,
    Flex,
    TextField,
    Well,
    View,
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
import { DefaultGrid } from "../Utils/DefaultGrid";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { SectionLayoutEditor } from "./SectionLayoutEditor";
import { useContainer} from "Hooks/useContainer"
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";
import {v4 as uuidv4} from 'uuid'
import {Pane, PaneRef} from "@maticoapp/matico_types/spec";

export interface SectionEditorProps {
    paneRef: PaneRef;
}

const IconForPaneType = (PaneType: string) => {
    switch (PaneType) {
        case "histogram":
            return <HistogramIcon />;
        case "pieChart":
            return <PieChartIcon />;
        case "text":
            return <TextIcon />;
        case "map":
            return <MapIcon />;
        case "scatterplot":
            return <ScatterIcon />;
        case "controls":
            return <PropertiesIcon />;
        case "container":
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
    onAddPane: (pane:Pane) => void;
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
                const pane = {
                  type:paneType,
                  id: uuidv4(),
                  ...PaneDefaults[paneType]
                }
                onAddPane(pane);
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
   paneRef 
}) => {

    const {container ,removePane, updatePane, updatePanePosition, parent, addPaneToContainer, removePaneFromContainer, subPanes, selectSubPane} = useContainer(paneRef)
    

    return (
        <Flex width="100%" height="100%" direction="column">
            <PaneEditor
              position={paneRef.position}
              name={container.name}
              background={"white"}
              onChange={updatePanePosition}
              parentLayout={parent.layout} 
              id={paneRef.id}      
            />
            <SectionLayoutEditor
                name={container.name}
                layout={container.layout}
                updateSection={updatePane}
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
                            onAddPane={addPaneToContainer}
                        />
                    </Flex>
                </Heading>
                <Flex gap={"size-200"} direction="column">
                    {subPanes.map((pane:Pane, index:number) => {
                        return (
                            <RowEntryMultiButton
                            // @ts-ignore
                            key={pane.name}
                            entryName={<Flex
                              direction="row"
                              alignItems="center"
                              gap="size-100"
                            >
                              {IconForPaneType(pane.type)}
                              {/* @ts-ignore */}
                              <Text>{pane.name}</Text>
                            </Flex>}
                            onRemove={() => removePaneFromContainer(container.panes[index]) }
                            onRaise={() => {} }
                            onLower={() => {} }
                            onDuplicate={() => {} } 
                            onSelect={()=> selectSubPane( container.panes[index]) }
                            />
                        );
                    })}
                </Flex>
            </Well>
            <RemovePaneDialog deletePane={removePane} />
        </Flex>
    );
};
