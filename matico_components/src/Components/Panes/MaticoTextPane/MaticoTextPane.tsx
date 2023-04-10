import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { Content, View } from "@adobe/react-spectrum";
import {
    EditorComposer,
    Editor,
    BackgroundColorPicker,
    FontFamilyDropdown,
    FontSizeDropdown,
    Divider,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeFormatButton,
    InsertLinkButton,
    TextColorPicker,
    TextFormatDropdown,
    InsertDropdown,
    AlignDropdown,
    ToolbarPlugin
} from "verbum";
import styled from "styled-components";
export interface MaticoTextPaneInterface extends MaticoPaneInterface {
    content: string;
    handleContent?: (content: string) => void;
    isReadOnly?: boolean;
    children?: React.ReactNode;
}

const TextPaneContainer = styled.section<{ isReadOnly?: boolean }>`
    height: 100%;
    div.editor-shell {
        margin: 0;
        max-width: initial;
    }
    div.editor-shell,
    div.editor-container {
        height: 100%;
        overflow-y: auto;
        border-radius: 0;
    }
    .ContentEditable__root {
        resize: none;
    }
    iframe,
    img,
    iframe div {
        max-width: 100%;
    }
`;

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
    content,
    handleContent = () => {},
    isReadOnly = true,
    children
}) => {
    const parsedContent = useMemo(() => {
        try {
            JSON.parse(content);
            return content;
        } catch {
            const parsedContent = `{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"${content}\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}`;
            return parsedContent;
        }
    }, []);

    return (
        <View
            position="relative"
            overflow="hidden auto"
            width="100%"
            height="100%"
            backgroundColor={isReadOnly ? "transparent" : "default"}
        >
            <TextPaneContainer isReadOnly={isReadOnly}>
                <EditorComposer>
                    <Editor
                        hashtagsEnabled={true}
                        onChange={handleContent}
                        initialEditorState={parsedContent}
                        isReadOnly={isReadOnly}
                    >
                        <>
                            <ToolbarPlugin defaultFontSize="20px">
                                <FontFamilyDropdown />
                                <FontSizeDropdown />
                                <Divider />
                                <BoldButton />
                                <ItalicButton />
                                <UnderlineButton />
                                <CodeFormatButton />
                                <InsertLinkButton />
                                <TextColorPicker />
                                <BackgroundColorPicker />
                                <TextFormatDropdown />
                                <Divider />
                                <InsertDropdown enablePoll={true} />
                                <Divider />
                                <AlignDropdown />
                            </ToolbarPlugin>
                            {children}
                        </>
                    </Editor>
                </EditorComposer>
            </TextPaneContainer>
        </View>
    );
};
