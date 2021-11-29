import { Box } from "grommet";
import React from "react";
import ReactJson from "react-json-view";
import { useMaticoSelector } from "../../Hooks/redux";

export const MaticoStateViewer: React.FC = () => {
  const state = useMaticoSelector((state) => state.variables);
  return (
    <Box
      background={"white"}
      style={{ textAlign: "left" }}
      fill
      flex
      overflow={{ vertical: "auto" }}
    >
      <ReactJson
        style={{ fontSize: 15, maxHeight: "1300px", overflowY: "auto" }}
        collapsed={3}
        src={state}
      />
    </Box>
  );
};
