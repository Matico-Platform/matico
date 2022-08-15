import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { Content, View } from "@adobe/react-spectrum";
import {
    EditorComposer,
    Editor,
} from "verbum";
export interface MaticoTextPaneInterface extends MaticoPaneInterface {
    content: string;
    handleContent?: (content: string) => void;
    isReadOnly?: boolean;
    children?: React.ReactNode;
}


export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
    content,
    handleContent=()=>{},
    isReadOnly=true,
    children
}) => {

    return (
        <View
            position="relative"
            overflow="hidden auto"
            width="100%"
            height="100%"
            backgroundColor={isReadOnly ? "transparent" : "default"}
        >
            <Content>
                <EditorComposer>
                    <Editor
                        hashtagsEnabled={true}
                        onChange={handleContent}
                        initialEditorState={content}
                        isReadOnly={isReadOnly}
                    >
                        {children}
                    </Editor>
                </EditorComposer>
            </Content>
        </View>
    );
};
