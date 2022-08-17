import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import {  Flex,Text } from "@adobe/react-spectrum";
import {SummaryItem} from "@maticoapp/matico_types/spec";
import React from "react";

export interface MaticoSummaryPaneInterface extends MaticoPaneInterface {
    font?: string;
    summaryItems: Array<SummaryItem>;
}

export const MaticoSummaryPane: React.FC<MaticoSummaryPaneInterface> = ({
    summaryItems,
    id,
}) => {
    const edit = useIsEditable();
    return (
      <Flex direction="column">
        {summaryItems  && summaryItems.map(item=>
          <Flex>
              <Text>{item.name}</Text>
          </Flex>
        )}
      </Flex>
    );
};
