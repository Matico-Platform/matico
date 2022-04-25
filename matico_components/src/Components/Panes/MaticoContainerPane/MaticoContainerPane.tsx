import React from "react";
import { MaticoPaneInterface, Pane } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content, Grid, Heading, View } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { selectPane } from "Utils/paneEngine";
import { selectLayout } from "Utils/layoutEngine";

export interface MaticoContainerPaneInterface extends MaticoPaneInterface {
    title?: string;
    editPath?: string;
    panes: Pane[];
    layout: string;
}

const LinearContainer: React.FC = ({ children, ...rest }) => {
    return (
        <View overflow="hidden auto" width="100%" height="100%" {...rest}>
            {children}
        </View>
    );
};

const GridContainer: React.FC = ({ children, ...rest }) => {
    return (
        <Grid width="100%" height="100%" {...rest}>
            {children}
        </Grid>
    );
};

const FreeContainer: React.FC = ({ children, ...rest }) => {
    return (
        <View position="relative" width="100%" height="100%" {...rest}>
            {children}
        </View>
    );
};

const containers = {
    linear: LinearContainer,
    grid: GridContainer,
    free: FreeContainer
};

export const MaticoContainerPane: React.FC<MaticoContainerPaneInterface> = ({
    editPath,
    title,
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
                editPath={`${editPath}.Container`}
                editType={"Container"}
            />
            <Content width="100%" height="100%">
                <LayoutEngine>
                    {panes
                        .filter((p: Pane) => p)
                        .map((pane: Pane, index: number) =>
                            selectPane(pane, `${editPath}.Container.panes.${index}`)
                        )}
                </LayoutEngine>
            </Content>
        </View>
    );
};
