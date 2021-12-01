import { MaticoDataContext } from "../../Contexts/MaticoDataContext/MaticoDataContext";
import React, { useContext } from "react";
import ReactJson from "react-json-view";

export const MaticoDatasetsViewer: React.FC = () => {
  const { state } = useContext(MaticoDataContext);
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
