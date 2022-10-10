import {
    NumberField,
    TextField,
    ToggleButton,
    Flex
} from "@adobe/react-spectrum";
import React from "react";
import { VariableSelector } from "./VariableSelector";
import FunctionIcon from "@spectrum-icons/workflow/Function";

type StateVariableReference = { var: string };

interface ValueOrVariableInputProps {
    value: number | string | StateVariableReference;
    defaultValue: number | string;
    label?: string;
    onChange: (newVal: number | string | StateVariableReference) => void;
}
export const ValueOrVariableInput: React.FC<ValueOrVariableInputProps> = ({
    value,
    onChange,
    defaultValue,
    label
}) => {
    const isVariable = typeof value === "object" && "var" in value;

    const toggleIsVariable = () => {
        if (isVariable) {
            onChange(defaultValue);
        } else {
            onChange({ var: null });
        }
    };

    return (
        <Flex
            direction="row"
            gap="size-100"
            justifyContent="start"
            alignItems="end"
        >
            {isVariable && (
                <VariableSelector
                    variable={value.var}
                    onSelectVariable={(variableName: string) =>
                        onChange({ var: variableName })
                    }
                />
            )}
            {value && typeof value === "string" && (
                <TextField
                    value={value}
                    label={label}
                    onChange={(newVal: string) => onChange(newVal)}
                />
            )}
            {value && typeof value === "number" && (
                <NumberField
                    key="min_val"
                    value={value}
                    label={label}
                    onChange={(newVal: number) => onChange(newVal)}
                />
            )}
            <ToggleButton
                isEmphasized
                isSelected={isVariable}
                onPress={toggleIsVariable}
            >
                <FunctionIcon />
            </ToggleButton>
        </Flex>
    );
};
