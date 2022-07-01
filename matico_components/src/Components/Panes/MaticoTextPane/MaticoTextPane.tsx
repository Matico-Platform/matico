import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content, View } from "@adobe/react-spectrum";

export interface MaticoTextPaneInterface extends MaticoPaneInterface {
    font?: string;
    content: string;
}

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
    content,
    id,
    font
}) => {
    const edit = useIsEditable();
    return (
        <View
            position="relative"
            overflow="hidden auto"
            width="100%"
            height="100%"
            backgroundColor={edit ? "default" : "transparent"}
        >
            <Content>
                <MarkdownContent>{content}</MarkdownContent>
            </Content>
        </View>
    );
};
