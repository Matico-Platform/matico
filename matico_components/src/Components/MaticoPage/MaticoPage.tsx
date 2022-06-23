import React from "react";
import {Page, PaneRef, Layout} from '@maticoapp/matico_types/spec'
import { selectPane } from "Utils/paneEngine";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import {
  View,
  Flex
} from "@adobe/react-spectrum";
import {selectLayout} from "Utils/layoutEngine";

interface MaticoPageInterface {
  page: Page;
  editPath?: string;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({
  page,
  editPath,
}) =>{

  let layout : Layout = page.layout;
  let LayoutEngine = selectLayout(layout)

  console.log("rendering page ", page)

  return(
    <View overflow="none auto" width="100%" height="100%">
      <Flex direction="column" width={"100%"} height={"100%"} >
        <LayoutEngine paneRefs={page.panes} />
      </Flex>
    </View>
  )
}
