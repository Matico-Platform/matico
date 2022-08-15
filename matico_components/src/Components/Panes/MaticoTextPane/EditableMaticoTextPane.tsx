import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { ActionButton } from "@adobe/react-spectrum";
import {
    ToolbarPlugin,
    AlignDropdown,
    BackgroundColorPicker,
    BoldButton,
    CodeFormatButton,
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
import styled from "styled-components";
import MoreCircle from "@spectrum-icons/workflow/MoreCircle";
import { useFormattedText } from "Hooks/useFormattedText";
import { MaticoTextPane } from "./MaticoTextPane";

export interface EditableMaticoTextPaneInterface extends MaticoPaneInterface {
    content: string;
    updatePane: (e: any) => void;
}

const ToolbarWrapper = styled.div<{ expanded?: boolean }>`
    position: relative;
    div.toolbar {
        flex-wrap: wrap;
        height: ${({ expanded }) => (expanded ? "auto" : "36px")};
    }
`;

export const EditableMaticoTextPane: React.FC<EditableMaticoTextPaneInterface> = ({
    content,
    updatePane,
    ...rest
}) => {
    const edit = useIsEditable();
    const [formattedText] = useFormattedText(content);

    const [toolbarExpanded, setToolbarExpanded] = React.useState(false);
    const displayContent = edit ? content : formattedText;

    const handleContent = (content: string) => updatePane({ content });
    const handleToggleExpanded = () => setToolbarExpanded((prev) => !prev);

    return (
        <MaticoTextPane
            content={displayContent}
            handleContent={handleContent}
            isReadOnly={!edit}
            {...rest}
            >
            <ToolbarWrapper expanded={toolbarExpanded}>
                <ActionButton
                    isQuiet
                    aria-label={
                        toolbarExpanded ? "Minimize toolbar" : "Expand toolbar"
                    }
                    onPress={handleToggleExpanded}
                    UNSAFE_style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                    }}
                >
                    <MoreCircle />
                </ActionButton>
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
                    <InsertDropdown />
                    <Divider />
                    <AlignDropdown />
                </ToolbarPlugin>
            </ToolbarWrapper>
        </MaticoTextPane>
    );
};
