import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
    deleteSpecAtPath,
    setCurrentEditPath,
    setSpecAtPath
} from "Stores/MaticoSpecSlice";

import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { DefaultGrid } from "../Utils/DefaultGrid";
import {
    Flex,
    Heading,
    Well,
    NumberField,
    ActionButton,
    DialogTrigger,
    Dialog,
    Content,
    TextField,
    Text,
    repeat
} from "@adobe/react-spectrum";

import SwitchIcon from "@spectrum-icons/workflow/Switch";
import MenuIcon from "@spectrum-icons/workflow/Menu";
import { findParentContainer } from "../Utils/Utils";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "../../../../dist/Hooks/useSpecActions";

interface AddControlModalProps {
    onAddControl: (name: string, controlType: string) => void;
    validateControlName?: (name: string) => boolean;
}

const avaliableControls = [
    { name: "Range", label: "Range" },
    { name: "Select", label: "Select" }
];

const IconForControlType = (ControlType: string) => {
    switch (ControlType) {
        case "Range":
            return <SwitchIcon />;
        case "Select":
            return <MenuIcon />;
    }
};

const DefaultForControl: Record<"Range" | "Select", any> = {
    Range: {
        name: "RangeControl",
        max: 100,
        min: 0,
        step: 1,
        default_value: 50
    },
    Select: {
        name: "Select Control",
        options: []
    }
};

const EditSelectModal: React.FC<{
    selectProps: any;
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
    rangeProps: any;
    onUpdate: (update: any) => void;
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
                            description={"Name to use for the variable"}
                            label="name"
                            value={rangeProps.name}
                            onChange={(name) => onUpdate({ name })}
                        />
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
                controls: [
                    ...controlsPane.controls.slice(0, index),
                    ...controlsPane.controls.slice(index + 1)
                ],
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
            <ActionButton isQuiet>Add</ActionButton>
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
    editPath: string;
}
export const ControlsPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
    const [controlsPane, parentLayout] = useMaticoSpec(editPath);

    const {
        remove: deletePane,
        update: updatePane,
        manuallySetSpec
    } = useSpecActions(editPath, "Controls");

    const handleUpdate = (change: any) => {
        updatePane({
            ...controlsPane,
            ...change
        });
    };

    const handleUpdateDetails = (change: any) =>
        updatePane({
            ...controlsPane,
            name: change.name,
            position: { ...controlsPane.position, ...change.position }
        });

    const handleAddControl = (
        controlName: string,
        controlType: "Range" | "Select"
    ) => {
        const newControl = {
            ...DefaultForControl[controlType],
            name: controlName
        };
        handleUpdate({
            controls: [...controlsPane.controls, { [controlType]: newControl }]
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
        handleUpdate({ controls });
    };

    const duplicateControl = (index: number) => {
        const controls = [
            ...controlsPane.controls.slice(0, index),
            controlsPane.controls[index],
            ...controlsPane.controls.slice(index)
        ];

        handleUpdate({ controls });
    };

    const deleteControl = (index: number) => {
        const controls = [
            ...controlsPane.controls.slice(0, index),
            ...controlsPane.controls.slice(index + 1)
        ];

        handleUpdate({ controls });
    };

    const updateControlAtIndex = (
        update: any,
        index: number,
        controlType: string
    ) => {
        manuallySetSpec({
            editPath: `${editPath}.controls.${index}.${controlType}`,
            update
        });
    };

    return (
        <Flex direction="column">
            <PaneEditor
                position={controlsPane.position}
                name={controlsPane.name}
                background={controlsPane.background}
                onChange={handleUpdateDetails}
            />
            <Well>
                <Heading>
                    <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="end"
                    >
                        <Text>Controls</Text>
                        <AddControlModal onAddControl={handleAddControl} />
                    </Flex>
                </Heading>

                {controlsPane.controls.map((control, index) => {
                    const [controlType, controlConfig] =
                        Object.entries(control)[0];
                    return (
                        // <RowEntryMultiButton
                        //   key={control.name}
                        //   entryName={control.name}
                        //   editPath={`${editPath}.controls.${index}.${controlType}`}
                        //   editType={controlType}
                        // />
                        <RowEntryMultiButton
                            index={index}
                            key={index}
                            entryName={
                                controlType === "Range" ? (
                                    <EditRangeModal
                                        rangeProps={controlConfig}
                                        onUpdate={(update) =>
                                            updateControlAtIndex(
                                                update,
                                                index,
                                                controlType
                                            )
                                        }
                                    />
                                ) : (
                                    <EditSelectModal
                                        selectProps={controlConfig}
                                        onUpdate={(update) =>
                                            updateControlAtIndex(
                                                update,
                                                index,
                                                controlType
                                            )
                                        }
                                    />
                                )
                            }
                            changeOrder={handleChangeOrder}
                            deleteEntry={deleteControl}
                            duplicateEntry={duplicateControl}
                        />
                    );
                })}
            </Well>
        </Flex>
    );
};
