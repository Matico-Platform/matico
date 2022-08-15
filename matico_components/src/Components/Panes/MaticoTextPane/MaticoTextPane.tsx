import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContent } from "../../MarkdownContent/MarkdownContent";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content, View } from "@adobe/react-spectrum";
import {
    EditorComposer,
    Editor,
    ToolbarPlugin,
    AlignDropdown,
    BackgroundColorPicker,
    BoldButton,
    CodeFormatButton,
    FloatingLinkEditor,
    FontFamilyDropdown,
    FontSizeDropdown,
    InsertDropdown,
    InsertLinkButton,
    ItalicButton,
    TextColorPicker,
    TextFormatDropdown,
    UnderlineButton,
    Divider
} from "verbum";
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
                {/* <MarkdownContent>{content}</MarkdownContent> */}
                <EditorComposer>
                    <Editor hashtagsEnabled={true}>
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
                    </Editor>
                </EditorComposer>
            </Content>
        </View>
    );
};
