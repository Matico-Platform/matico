import React from "react";
import {Page, PaneRef, Layout} from '@maticoapp/matico_types/spec'
import { selectPane } from "Utils/paneEngine";
import {
  View,
  Flex
} from "@adobe/react-spectrum";

interface MaticoPageInterface {
  page: Page;
  editPath?: string;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({
  page,
  editPath,
}) =>{

  let layout : Layout = page.layout;

  return(
    <View overflow="none auto" width="100%" height="100%">
      <Flex direction="column" width={"100%"} height={"100%"} >
            {page.panes
              .map((pane: PaneRef ) =>
                selectPane(pane)
              )}
      </Flex>
    </View>
  )
}
