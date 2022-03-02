import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "@maticoapp/matico_spec";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { ControlButton } from "Components/MaticoEditor/Utils/MaticoControlButton";
import { Content, View } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";

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
      width="100%"
      height="100%"
      >
      <ControlActionBar editPath={`${editPath}.Text`} editType={"Text"} />
      <Content>
        <MarkdownContent>{content}</MarkdownContent>
      </Content>
    </View>
  );
};
