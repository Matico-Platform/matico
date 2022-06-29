import React from "react";
import { OptionsPopperProps } from "./types";
import { DialogTrigger, ActionButton, View, Flex } from "@adobe/react-spectrum";
import { ParentSize } from "@visx/responsive";

export const OptionsPopper: React.FC<OptionsPopperProps> = ({
    title,
    children
}) => {
    return (
        <ParentSize>
            {({ width }) => (
                <DialogTrigger
                    type="popover"
                    containerPadding={0}
                    hideArrow
                    isDismissable={true}
                >
                    <ActionButton width={"100%"} marginTop="size-50">
                        {title}
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
                        <Flex direction="column">{children}</Flex>
                    </View>
                </DialogTrigger>
            )}
        </ParentSize>
    );
};
