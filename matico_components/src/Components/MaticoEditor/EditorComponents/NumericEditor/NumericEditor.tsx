import React from "react";
import {
    Flex,
    Grid,
    Item,
    NumberField,
    Picker,
    Text,
    View
} from "@adobe/react-spectrum";
import { NumericEditorProps } from "./types";

export const NumericEditor: React.FC<NumericEditorProps> = ({
    label,
    value,
    units,
    step = 1,
    unitsOptions = [],
    onValueChange,
    onUnitsChange,
    isDisabled = false
}) => {
    return (
        <Grid
            areas={["Label Interface"]}
            columns={["33.3%", "66.6%"]}
            gap="size-50"
        >
            <Text gridArea={"Label"} alignSelf="center" justifySelf="end">
                {label}
            </Text>
            <View gridArea={"Interface"} marginTop="size-100">
                <View
                    backgroundColor="gray-75"
                    borderColor="gray-400"
                    borderWidth="thin"
                >
                    <Flex direction="row" marginX="size-100">
                        <NumberField
                            value={value}
                            onChange={onValueChange}
                            step={step}
                            hideStepper
                            isQuiet
                            isDisabled={isDisabled}
                        />
                        {!!unitsOptions?.length && (
                            <Picker
                                selectedKey={units}
                                onSelectionChange={onUnitsChange}
                                aria-label={`${label} units`}
                                isQuiet
                            >
                                {unitsOptions.map(({ label, value }) => (
                                    <Item key={value}>{label}</Item>
                                ))}
                            </Picker>
                        )}
                    </Flex>
                </View>
            </View>
        </Grid>
    );
};
