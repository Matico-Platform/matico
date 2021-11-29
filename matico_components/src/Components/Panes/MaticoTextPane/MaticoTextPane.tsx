import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContnet } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "matico_spec";
import { Box } from "grommet";
import {useIsEditable} from "../../../Hooks/useIsEditable";
import {EditButton} from "../../MaticoEditor/EditButton";

interface MaticoTextPaneInterface extends MaticoPaneInterface {
  font?: string;
  content: string;
  editPath?:string;
}

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
  content,
  font,
  editPath
}) => {
  const edit = useIsEditable()
  return (
    <Box elevation={"large"} fill={true} overflow={{vertical:'auto'}}>
      {edit && 
      <Box style={{position:'relative', top:"-20px", left:"-20px", zIndex:20, width:"48px", height:"48px"}}>
        <EditButton editPath={`${editPath}.Text`} editType={"Text"} />
      </Box>
      }
      <MarkdownContnet>{content}</MarkdownContnet>
    </Box>
  );
};
