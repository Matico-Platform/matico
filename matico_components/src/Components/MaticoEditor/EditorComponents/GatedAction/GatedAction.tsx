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

export const GatedAction: React.FC<GatedActionProps> = ({
    buttonText,
    confirmText,
    confirmButtonText,
    onConfirm,
    confirmBackgroundColor = "informative"
}) => {
    return (<ParentSize>
        {({ width }) => (
            <DialogTrigger
                type="popover"
                containerPadding={0}
                hideArrow
                isDismissable={true}
            >
                <ActionButton
                    width={"100%"}
                    marginTop="size-50"
                >
                    {buttonText}
                </ActionButton>
                <View
                    width={width}
                    backgroundColor="gray-75"
                    borderColor="informative"
                    borderWidth="thin"
                    UNSAFE_style={{
                        boxShadow: "0px 0px 8px 4px rgba(0,0,0,0.5)"
                    }}
                    padding="size-150"
                >
                    <Text>{confirmText}</Text>
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

                </View>
            </DialogTrigger>
        )}
    </ParentSize>
    )
}