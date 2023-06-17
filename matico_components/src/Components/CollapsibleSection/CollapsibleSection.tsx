import { Button, Flex, View, Text } from "@adobe/react-spectrum";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import React, { useState } from "react";
import { CollapsibleSectionProps } from "./types";

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title = "",
    children = null,
    icon = null,
    isOpen = false,
    onToggle = (isOpen: boolean) => { },
    titleStyle = {},
    viewStyle = {},
    outerStyle = {}
}) => {
    const [open, setOpen] = useState(isOpen);
    const handleToggle = () => {
        setOpen((prev) => {
            onToggle(!prev);
            return !prev;
        });
    };
    return (
        <View
            marginY="size-10"
            width="100%"
            minWidth="size-200"
            UNSAFE_style={outerStyle}
        >
            <Button
                variant="primary"
                isQuiet
                onPress={handleToggle}
                width={"100%"}
                // TODO refactor styles into something that makes typescript and spectrum happy
                UNSAFE_style={{
                    borderRadius: 0,
                    background: "var(--spectrum-global-color-gray-300)",
                    color: "var(--spectrum-global-color-gray-900)",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    border: "0px",
                    ...titleStyle
                }}
            >
                <Flex
                    direction="row"
                    gap="size-200"
                    justifyContent="start"
                    alignItems="center"
                >
                    {icon}
                    {title}
                </Flex>
                <ChevronDown
                    aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
                    size="XS"
                    UNSAFE_style={{
                        transform: `rotate(${open ? "0deg" : "90deg"})`,
                        transition: "125ms"
                    }}
                />
            </Button>
            <View
                height={open ? "auto" : 0}
                overflow="hidden hidden"
                padding="size-50"
                UNSAFE_style={{
                    display: open ? "block" : "none"
                    // ...viewStyle
                }}
            >
                <Flex
                    direction="column"
                    alignItems="start"
                    marginY="size-50"
                    marginX="size-25"
                // UNSAFE_style={{
                // ...viewStyle,
                // }}
                >
                    {children}
                </Flex>
            </View>
        </View>
    );
};
