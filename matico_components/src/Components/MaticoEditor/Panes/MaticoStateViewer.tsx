import React from "react";
import ReactJson from "react-json-view";
import { useMaticoSelector } from "Hooks/redux";
import { Flex } from "@adobe/react-spectrum";

export const MaticoStateViewer: React.FC = () => {
  const state = useMaticoSelector((state) => state.variables);
  return (
    <Flex>
      <ReactJson
        style={{ fontSize: 15 }}
        collapsed={3}
        src={state}
      />
    </Flex>
  );
};
