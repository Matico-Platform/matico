import React from "react";
import { GatedActionProps } from "./types";
import {
    DialogTrigger,
    ActionButton,
    View,
    Flex,
    Text,
    Button
} from '@adobe/react-spectrum'
import { ParentSize } from "@visx/responsive";
import { OptionsPopper } from "../OptionsPopper";

export const GatedAction: React.FC<GatedActionProps> = ({
    buttonText,
    confirmText,
    confirmButtonText,
    onConfirm,
    confirmBackgroundColor = "informative",
    children
}) => {
    return (<OptionsPopper
        title={buttonText}
    >
        <Text>{confirmText}</Text>
        {children}
        <View
            width="100%"
            backgroundColor={confirmBackgroundColor}
        >
            <ActionButton
                onPress={onConfirm}
                width="100%"
                isQuiet>
                {confirmButtonText}
            </ActionButton>
        </View>
    </OptionsPopper>)
}