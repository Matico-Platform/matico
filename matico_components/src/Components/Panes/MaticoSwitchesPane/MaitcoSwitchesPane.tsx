import React, { useEffect, useState } from "react";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { SwitchesPane } from "@maticoapp/matico_types/spec";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    Grid,
    Header,
    Heading,
    repeat,
    SearchField,
    View,
    Switch,
    Text
} from "@adobe/react-spectrum";
import { LoadingSpinner } from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";

export interface MaticoSwitchesInterface
    extends MaticoPaneInterface,
        SwitchesPane {}

export const MaticoSwitchesPane: React.FC<MaticoSwitchesInterface> = ({
    label,
    id,
    options = [],
    description,
    initalSelection,
    orientation,
    name
}) => {
    console.log("options are ", options);

    let initalValues: Record<string, boolean> = {};
    options.forEach(
        (o: string) => (initalValues[o] = initalSelection === "all")
    );

    const [switchStates, setSwitchStates] = useAutoVariable({
        variable: {
            id: id + "_switches",
            paneId: id,
            name: name,
            value: {
                type: "booleans",
                value: initalValues
            }
        },
        bind: true
    });

    useEffect(() => {
        if (!switchStates) return;
        let newSettings: Record<string, boolean> = {};
        Object.entries(switchStates.value).forEach(
            ([name, state]: [string, boolean]) => {
                if (options.includes(name)) {
                    newSettings[name] = state;
                }
            }
        );

        options.forEach((o: string) => {
            if (!(o in newSettings)) {
                newSettings[o] = false;
            }
        });

        setSwitchStates({
            ...switchStates,
            value: newSettings
        });
    }, [options]);

    const setSelected = (name: string, state: boolean) => {
        setSwitchStates({
            ...switchStates,
            value: { ...switchStates.value, [name]: state }
        });
    };

    return (
        <View
            width="100%"
            height="100%"
            position="relative"
            backgroundColor={"gray-200"}
            overflow="hidden"
        >
            {switchStates ? (
                <View padding="20px" width={"100%"} height={"100%"}>
                    <Flex direction="column">
                        <Header>{name}</Header>
                        <Flex
                            direction={orientation === "row" ? "row" : "column"}
                        >
                            {options.map((name: string) => (
                                <Switch
                                    isSelected={switchStates.value[name]}
                                    onChange={(state: boolean) =>
                                        setSelected(name, state)
                                    }
                                >
                                    {name}
                                </Switch>
                            ))}
                        </Flex>
                        {description && <Text>{description}</Text>}
                    </Flex>
                </View>
            ) : (
                <LoadingSpinner />
            )}
        </View>
    );
};
