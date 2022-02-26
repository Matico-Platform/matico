import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "@maticoapp/matico_spec";
import { Box } from "grommet";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";

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
    <Box elevation={"large"} fill={true} overflow={{ vertical: 'auto' }}>
      {edit &&
        <Box style={{ position: 'absolute', top: "-24px", left: "-25px", zIndex: 20, width: "48px", height: "48px" }}>
          <EditButton editPath={`${editPath}.Text`} editType={"Text"} />
        </Box>
      }
      <MarkdownContent>{content}</MarkdownContent>
    </Box>
  );
};
