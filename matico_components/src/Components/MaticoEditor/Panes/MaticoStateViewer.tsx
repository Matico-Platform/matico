import React from "react";
import ReactJson from "react-json-view";
import { useMaticoSelector } from "Hooks/redux";
import { Flex, Heading, View } from "@adobe/react-spectrum";

export const MaticoStateViewer: React.FC = () => {
    const state = useMaticoSelector((state) => state.variables);
    return (
        <Flex direction="column">
            <Heading margin="size-150" alignSelf="start">
                Application State
            </Heading>
            <View
                backgroundColor="static-white"
                paddingX="medium"
                paddingY="medium"
            >
                <ReactJson
                    style={{ fontSize: 15, textAlign: "left" }}
                    theme="tomorrow"
                    src={state}
                    indentWidth={2}
                />
            </View>
        </Flex>
    );
};
