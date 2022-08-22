import React from "react";
import { Text } from "@adobe/react-spectrum";
import { IconForPaneType } from "../../Utils/PaneDetails";
import { DraggableContainer } from "./Styled";

export const DraggablePane: React.FC<{
    activeItem: any;
}> = ({ activeItem }) => {
    const isPage = activeItem?.data?.current?.type === "page";
    const data = activeItem?.data?.current;
    const name = isPage ? data.name : data.pane.name;

    return (
        <DraggableContainer>
            {!isPage && IconForPaneType(data.pane.type)}
            <Text
                UNSAFE_style={{
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    color:"white"
                }}
            >
                {name}
            </Text>
        </DraggableContainer>
    );
};
