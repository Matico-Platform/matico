import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content,  View } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import {Layout, PaneRef} from "@maticoapp/matico_types/spec";

export interface MaticoContainerPaneInterface extends MaticoPaneInterface {
    paneRef:PaneRef;
    title?: string;
    panes: PaneRef[];
    layout: Layout;
}

export const MaticoContainerPane: React.FC<MaticoContainerPaneInterface> = ({
    paneRef,
    layout,
    panes
}) => {
    const edit = useIsEditable();
    let LayoutEngine = selectLayout(layout);
    return (
        <View
            position="relative"
            overflow="hidden auto"
            width="100%"
            height="100%"
            backgroundColor={edit ? "default" : "transparent"}
        >
            <Content width="100%" height="100%">
              <LayoutEngine paneRefs={panes} />
            </Content>
        </View>
    );
};
