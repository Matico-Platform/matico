import React from "react";
import { Box, Text } from "grommet";
import { MaticoPaneInterface } from "../Pane";
import { MaticoControl } from "../../Controls";
import { MaticoRangeControl } from "./MaticoRangeControl";
import { MaticoSelectControl } from "./MaticoSelectControl";
import {useSubVariables} from "../../../Hooks/useSubVariables";

interface MaticoControlPaneInterface extends MaticoPaneInterface {
  controls: Array<any>;
  title?: string;
}

export const MaticoControlsPane: React.FC<MaticoControlPaneInterface> = ({
  controls,
  title,
}) => {

  const [mappedControls, filtersReady, _] = useSubVariables(controls)
  if(!filtersReady) return <h1>Loading</h1>

  return (
    <Box
      pad={"small"}
      gap={"medium"}
      style={{ textAlign: "left", width: "100%", height: "100%" }}
    >
      <h2>{title}</h2>
      {mappedControls.map((controlSpec) => {
        const [type, params] = Object.entries(controlSpec)[0];
        //@ts-ignore
        const {name} = params
        switch (type) {
          case "Range":
            //@ts-ignore
            return (
              <Box direction="row" gap={"medium"} alignContent={"between"}>
                <Text>{name}</Text> 
                {/*
                // @ts-ignore */}
                <MaticoRangeControl {...params} />
              </Box>
            );
          case "Select":
            //@ts-ignore
            return (
              <Box direction="row" gap={"medium"} alignContent={"between"}>
                <Text>{name}</Text>
                {/*
                // @ts-ignore */}
                <MaticoSelectControl {...params} />
              </Box>
            );
        }
      })}
    </Box>
  );
};
