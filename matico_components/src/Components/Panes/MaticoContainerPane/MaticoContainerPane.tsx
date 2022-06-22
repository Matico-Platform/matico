import React from "react";
import { MaticoPaneInterface, Pane } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content, Grid, Heading, View } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { selectPane } from "Utils/paneEngine";
import { selectLayout } from "Utils/layoutEngine";
import {Layout, PaneRef} from "@maticoapp/matico_types/spec";

export interface MaticoContainerPaneInterface extends MaticoPaneInterface {
    id:string;
    title?: string;
    panes: PaneRef[];
    layout: Layout;
}

export const MaticoContainerPane: React.FC<MaticoContainerPaneInterface> = ({
    id,
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
            <ControlActionBar
                targetId={id}
            />
            <Content width="100%" height="100%">
                <LayoutEngine>
                    {panes
                        .map((pane: PaneRef) =>
                            selectPane(pane)
                        )}
                </LayoutEngine>
            </Content>
        </View>
    );
};
