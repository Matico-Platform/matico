import React, { useState } from "react";
import _, { rangeRight } from "lodash";

import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { DefaultGrid } from "../Utils/DefaultGrid";
import {
    Flex,
    Heading,
    NumberField,
    ActionButton,
    DialogTrigger,
    Dialog,
    Content,
    TextField,
    Text,
    repeat,
    Switch,
    Radio,
    RadioGroup
} from "@adobe/react-spectrum";

import SwitchIcon from "@spectrum-icons/workflow/Switch";
import MenuIcon from "@spectrum-icons/workflow/Menu";
import { usePane } from "Hooks/usePane";
import {
    Control,
    ControlsPane,
    PaneRef,
    RangeControl,
    SelectControl
} from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { DetailsEditor } from "./DetailsEditor";

interface AddControlModalProps {
    onAddControl: (name: string, controlType: string) => void;
    validateControlName?: (name: string) => boolean;
}

const avaliableControls = [
    { name: "range", label: "Range" },
    { name: "select", label: "Select" }
];

const IconForControlType = (ControlType: string) => {
    switch (ControlType) {
        case "range":
            return <SwitchIcon />;
        case "select":
            return <MenuIcon />;
    }
};

const DefaultForControl: Record<"range" | "select", any> = {
    range: {
        type: "range",
        name: "RangeControl",
        max: 100,
        min: 0,
        step: 1,
        default_value: 50
    },
    select: {
        type: "select",
        name: "SelectControl",
        options: []
    }
};

const EditSelectModal: React.FC<{
    selectProps: SelectControl;
    onUpdate: (update: any) => void;
}> = ({ selectProps, onUpdate }) => {
    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton isQuiet>
                {IconForControlType("Select")}
                <Text>{selectProps.name}</Text>
            </ActionButton>
            <Dialog>
                <Content>
                    <Flex direction="column" gap="size-150">
                        <TextField
                            description={"Name to use for the variable"}
                            label="name"
                            value={selectProps.name}
                        />
                        <TextField
                            description={"Comma seperated list of options"}
                            label="options"
                            value={selectProps.options.join(",")}
                            onChange={(newOptions: string) =>
                                onUpdate({
                                    options: newOptions
                                        .split(",")
                                        .map((o) => o.trim())
                                })
                            }
                        />
                    </Flex>
                </Content>
            </Dialog>
        </DialogTrigger>
    );
};

const EditRangeModal: React.FC<{
    rangeProps: RangeControl;
    onUpdate: (update: Partial<RangeControl>) => void;
}> = ({ rangeProps, onUpdate }) => {
    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton isQuiet>
                {IconForControlType("Range")}
                <Text>{rangeProps.name}</Text>
            </ActionButton>
            <Dialog>
                <Content>
                    <Flex direction="column" gap="size-150">
                        <TextField
                            width="100%"
                            description={"Name to use for the variable"}
                            label="name"
                            value={rangeProps.name}
                            onChange={(name) => onUpdate({ name })}
                        />
                        <Flex direction="row" justifyContent={"space-between"}>
                            <NumberField
                                description={"Min value this variable can take"}
                                label="minVal"
                                value={rangeProps.min}
                                onChange={(min) => onUpdate({ min })}
                            ></NumberField>
                            <NumberField
                                description={"Max value this variable can take"}
                                label="maxVal"
                                value={rangeProps.max}
                                onChange={(max) => onUpdate({ max })}
                            ></NumberField>
                        </Flex>
                        <RadioGroup
                            label='Event Trigger'
                            labelPosition="side"
                            orientation="horizontal"
                            value={rangeProps.changeEvent || "onChange"}
                            onChange={(changeEvent) => onUpdate({ changeEvent })}
                        >
                            <Radio value="onChange">On Change</Radio>
                            <Radio value="onEnd">On End</Radio>
                        </RadioGroup>
                    </Flex>
                </Content>
            </Dialog>
        </DialogTrigger>
    );
};

const AddControlModal: React.FC<AddControlModalProps> = ({
    onAddControl,
    validateControlName
}) => {
    const [newControlName, setNewControlName] = useState("New Control");
    const [errorText, setErrorText] = useState<string | null>(null);

    const attemptToAddControl = (controlType: string, close: () => void) => {
        if (newControlName.length === 0) {
            setErrorText("Please provide a name");
        }
        if (validateControlName) {
            if (validateControlName(newControlName)) {
                onAddControl(newControlName, controlType);
                close();
            } else {
                setErrorText(
                    "Another pane with the same name exists, pick something else"
                );
            }
        } else {
            onAddControl(newControlName, controlType);
            close();
        }
    };
    return (
        <DialogTrigger type="popover" isDismissable>
            <ActionButton width="100%">Add New Control</ActionButton>
            {(close: any) => (
                <Dialog>
                    <Heading>Select control to add</Heading>
                    <Content>
                        <Flex direction="column" gap="size-150">
                            <TextField
                                label="New pane name"
                                value={newControlName}
                                onChange={setNewControlName}
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
                                {avaliableControls.map((control) => (
                                    <ActionButton
                                        key={control.label}
                                        onPress={() => {
                                            attemptToAddControl(
                                                control.name,
                                                close
                                            );
                                        }}
                                    >
                                        {IconForControlType(control.name)}
                                        <Text>{control.label}</Text>
                                    </ActionButton>
                                ))}
                            </DefaultGrid>
                            {errorText && <Text>${errorText}</Text>}
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export interface PaneEditorProps {
    paneRef: PaneRef;
}
export const ControlsPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, parent } = usePane(paneRef);
    const controlsPane = pane as ControlsPane;

    const handleAddControl = (
        controlName: string,
        controlType: "range" | "select"
    ) => {
        const newControl = {
            ...DefaultForControl[controlType],
            name: controlName
        };
        updatePane({
            controls: [...controlsPane.controls, newControl]
        });
    };

    const handleChangeOrder = (index: number, direction: "up" | "down") => {
        if (
            (index === 0 && direction === "up") ||
            (index === controlsPane.controls.length - 1 && direction === "down")
        ) {
            return;
        }

        let controls = [...controlsPane.controls];
        const changedControl = controls.splice(index, 1)[0];
        controls.splice(
            direction === "up" ? index - 1 : index + 1,
            0,
            changedControl
        );
        updatePane({ controls });
    };

    const duplicateControl = (index: number) => {
        const controls = [
            ...controlsPane.controls.slice(0, index),
            controlsPane.controls[index],
            ...controlsPane.controls.slice(index)
        ];

        updatePane({ controls });
    };

    const deleteControl = (index: number) => {
        const controls = [
            ...controlsPane.controls.slice(0, index),
            ...controlsPane.controls.slice(index + 1)
        ];

        updatePane({ controls });
    };

    const updateControlAtIndex = (update: Partial<Control>, index: number) => {
        const controls = controlsPane.controls.map(
            (control: Control, i: number) =>
                index === i ? { ...control, ...update } : control
        );
        updatePane({ controls });
    };

    return (
        <Flex direction="column">
            <CollapsibleSection title="Details" isOpen={true}>
                <DetailsEditor pane={pane} updatePane={updatePane} />
            </CollapsibleSection>
            <CollapsibleSection title="Sizing" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={pane.name}
                    background={"white"}
                    onChange={updatePanePosition}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Controls" isOpen={true}>
                <AddControlModal onAddControl={handleAddControl} />
                {controlsPane.controls.map(
                    (control: Control, index: number) => {
                        return (
                            <Flex
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                {control.type === "range" ? (
                                    <EditRangeModal
                                        rangeProps={control}
                                        onUpdate={(update) =>
                                            updateControlAtIndex(update, index)
                                        }
                                    />
                                ) : (
                                    <EditSelectModal
                                        selectProps={control}
                                        onUpdate={(update) =>
                                            updateControlAtIndex(update, index)
                                        }
                                    />
                                )}
                            </Flex>
                        );
                    }
                )}
            </CollapsibleSection>
        </Flex>
    );
};
