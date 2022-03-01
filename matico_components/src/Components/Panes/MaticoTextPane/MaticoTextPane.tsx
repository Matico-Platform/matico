import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "@maticoapp/matico_spec";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";
import { View } from "@adobe/react-spectrum";

export interface MaticoTextPaneInterface extends MaticoPaneInterface {
  font?: string;
  content: string;
  editPath?: string;
}

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
  content,
  font,
  editPath
}) => {
  const edit = useIsEditable()
  return (
    <View 
      position="relative"
      overflow="none auto"
      >
      {edit &&
        <View 
          position="absolute"
          top="-24px"
          left="-25px"
          zIndex={20}
          width="48px"
          height="48px"
          >
          <EditButton editPath={`${editPath}.Text`} editType={"Text"} />
        </View>
      }
      <MarkdownContent>{content}</MarkdownContent>
    </View>
  );
};
