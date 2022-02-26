import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MaticoRangeControl } from "./MaticoRangeControl";
import { MaticoSelectControl } from "./MaticoSelectControl";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { View, Flex, Heading, Provider, lightTheme } from "@adobe/react-spectrum";
import { useIsEditable } from "Hooks/useIsEditable";
import { EditButton } from "../../MaticoEditor/Utils/EditButton";

export interface MaticoControlsPaneInterface extends MaticoPaneInterface {
  controls: Array<any>;
  title?: string;
  editPath: string
}

export const MaticoControlsPane: React.FC<MaticoControlsPaneInterface> = ({
  controls,
  title,
  editPath
}) => {
  const [mappedControls, filtersReady, _] = useNormalizeSpec(controls);
  if (!filtersReady) return <h1>Loading</h1>;

  const edit = useIsEditable();

  return (
    <Flex direction="column" alignItems='stretch'>
      <View position="absolute" top="-20px" left="-20px">
        <EditButton editPath={`${editPath}.Controls`} editType={"Controls"} />
      </View>
      <Provider theme={lightTheme}>
        <View padding="size-200">
        <Heading>{title}</Heading>
          <Flex direction="column" gap="size-200">
            {mappedControls.map((controlSpec) => {
              const [type, params] = Object.entries(controlSpec)[0];
              //@ts-ignore
              const { name } = params;
              switch (type) {
                case "Range":
                  return <MaticoRangeControl {...params} />;
                case "Select":
                  //@ts-ignore
                  return <MaticoSelectControl {...params} />;
                default:
                  throw Error(`Unsupported fitler type ${type}`);
              }
            })}
          </Flex>          
        </View>
      </Provider>
    </Flex>
  );
};
