import React from "react";
import {
    Text,
} from "@adobe/react-spectrum";
import { IconForPaneType } from "../../Utils/PaneDetails";
import { DraggableContainer } from "./Styled";

export const DraggablePane: React.FC<{
    activeItem: any;
}> = ({ activeItem }) => {
    const pane = activeItem?.data?.current?.pane;
    return (
        <DraggableContainer>
            {IconForPaneType(pane.type)}
            <Text
                UNSAFE_style={{
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    whiteSpace: "nowrap"
                }}
            >
                {pane.name}
            </Text>
        </DraggableContainer>
    );
};