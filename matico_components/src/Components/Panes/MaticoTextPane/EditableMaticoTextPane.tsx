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
        span.text {
            display:none;
        }
    }
`;

const fontSizeOptions: [string, string][] = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
    ['24px', '24px'],
    ['28px', '28px'],
    ['32px', '32px'],
    ['40px', '40px'],
    ['48px', '48px'],
    ['72px', '72px'],
]

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
                    <FontSizeDropdown fontSizeOptions={fontSizeOptions} />
                    <AlignDropdown />
                    <Divider />
                    <InsertDropdown 
                        enableEquations
                        enableHorizontalRule
                        enableYoutube
                        enableImage
                        // enableTwitter
                         />
                    <Divider />
                    <BoldButton />
                    <ItalicButton />
                    <UnderlineButton />
                    <Divider />
                    <TextColorPicker />
                    <BackgroundColorPicker />
                    <TextFormatDropdown />
                    <FontFamilyDropdown />
                    <Divider />
                    <InsertLinkButton />
                    <CodeFormatButton />
                </ToolbarPlugin>
            </ToolbarWrapper>
        </MaticoTextPane>
    );
};
