import React from "react";
import { Text, Flex } from "@adobe/react-spectrum";
import Alert from "@spectrum-icons/workflow/Alert";

export const MissingParamsPlaceholder: React.FC<{ paneName: string }> = ({
    paneName
}) => {
    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            UNSAFE_style={{ background: "white" }}
        >
            <Text
                UNSAFE_style={{
                    color: "var(--spectrum-global-color-magenta-400)"
                }}
            >
                <Alert size="L" />
                <br />
                {paneName} missing parameters
                <br />
                <i>Click to open editor</i>
            </Text>
        </Flex>
    );
};
