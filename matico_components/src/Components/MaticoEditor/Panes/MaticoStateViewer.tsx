import React from "react";
import ReactJson from "react-json-view";
import { useMaticoSelector } from "Hooks/redux";
import { Flex, View } from "@adobe/react-spectrum";

export const MaticoStateViewer: React.FC = () => {
  const state = useMaticoSelector((state) => state.variables);
  return (
    <Flex>
      <View backgroundColor="static-white" paddingX="medium" paddingY="medium">
        <ReactJson
          style={{ fontSize: 15, textAlign: "left" }}
          collapsed={3}
          src={state}

        />
      </View>
    </Flex>
  );
};
