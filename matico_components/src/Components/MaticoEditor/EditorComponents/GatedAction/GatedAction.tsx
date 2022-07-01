import React from "react";
import { GatedActionProps } from "./types";
import { ActionButton, View, Text } from "@adobe/react-spectrum";
import { OptionsPopper } from "../OptionsPopper";

export const GatedAction: React.FC<GatedActionProps> = ({
    buttonText,
    confirmText,
    confirmButtonText,
    onConfirm,
    confirmBackgroundColor = "informative",
    children
}) => {
    return (
        <OptionsPopper title={buttonText}>
            <Text>{confirmText}</Text>
            {children}
            <View width="100%" backgroundColor={confirmBackgroundColor}>
                <ActionButton onPress={onConfirm} width="100%" isQuiet>
                    {confirmButtonText}
                </ActionButton>
            </View>
        </OptionsPopper>
    );
};
