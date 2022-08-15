import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { Content, View } from "@adobe/react-spectrum";
import {
    EditorComposer,
    Editor,
} from "verbum";
import styled from "styled-components";
export interface MaticoTextPaneInterface extends MaticoPaneInterface {
    content: string;
    handleContent?: (content: string) => void;
    isReadOnly?: boolean;
    children?: React.ReactNode;
}

const TextPaneContainer = styled.section<{isReadOnly?:boolean}>`
    height: 100%;
    div.editor-shell {
        margin:0;
        /* margin:${({isReadOnly}) => isReadOnly ? "0" : "20px auto"}; */
    }
    div.editor-shell, div.editor-container {
        height: 100%;
        border-radius: 0;
    }
`

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
            <TextPaneContainer
                isReadOnly={isReadOnly}
            >
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
            </TextPaneContainer>
        </View>
    );
};
