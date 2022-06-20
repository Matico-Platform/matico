import React from "react";
import {
    Flex,
    Item,
    Text,
    Section,
    ComboBox,
} from "@adobe/react-spectrum";
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import ColorFill from '@spectrum-icons/workflow/ColorFill';
import Abc from '@spectrum-icons/workflow/ABC';
import OneTwoThree from '@spectrum-icons/workflow/123';
import { ManualVariableComboBoxProps } from "./types";

export const ManualVariableComboBox: React.FC<ManualVariableComboBoxProps> = ({
    label,
    columns,
    onChange,
    manualIcon,
    style,
    isManual,
    isDataDriven,
    isNone
}) => {
    return (<ComboBox
        onSelectionChange={onChange}
        label={label}
        width="100%"
        // @ts-ignore
        defaultInputValue={isDataDriven ? style?.variable : isNone  ? `No ${label}` : isManual ? `Manual ${label}` : ""}
    >
        <Section title="Manual">
            <Item textValue={`Select ${label}`} key={`manual${label}`}>
                <Flex gridArea={"text"} alignItems="center" gap=".25em">
                    {!!manualIcon && manualIcon}
                    <Text flexGrow={1}>
                        Manual {label}
                    </Text>
                </Flex>
            </Item>
            <Item textValue={`No ${label}`} key={`no${label}`}>
                <Flex gridArea={"text"} alignItems="center" gap=".25em">
                    <RemoveCircle size="S" />
                    <Text flexGrow={1}>
                        No {label}
                    </Text>
                </Flex>
            </Item>
        </Section>
        <Section title="Data Driven">
            {columns.map(({ name, type }, i) => (
                <Item key={`datadriven-${name}`} textValue={name}>
                    <Flex gridArea={"text"} alignItems="center" gap=".25em">
                        {type === "number" ? <OneTwoThree size="S" /> : <Abc size="S" />}
                        <Text flexGrow={1}>
                            {name}
                        </Text>
                    </Flex>
                </Item>
            ))}
        </Section>
    </ComboBox>)
}