import React from "react";
import ReactJson from "react-json-view";
import {useMaticoSelector} from "../../Hooks/redux";

export const MaticoStateViewer: React.FC = () => {
  const  state = useMaticoSelector(state=>state.variables);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        textAlign: "left",
        overflowY: "auto",
      }}
    >
      <ReactJson
        style={{ fontSize: 15, maxHeight: "1300px", overflowY: "auto" }}
        collapsed={3}
        src={state}
      />
    </div>
  );
};
