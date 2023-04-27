import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { ActionButton } from "@adobe/react-spectrum";
import { debounce } from "lodash";
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
import { useMaticoSelector } from "Hooks/redux";
import "react-quill/dist/quill.snow.css";

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
            display: none;
        }
    }
`;

const fontSizeOptions: [string, string][] = [
    ["10px", "10px"],
    ["11px", "11px"],
    ["12px", "12px"],
    ["13px", "13px"],
    ["14px", "14px"],
    ["15px", "15px"],
    ["16px", "16px"],
    ["17px", "17px"],
    ["18px", "18px"],
    ["19px", "19px"],
    ["20px", "20px"],
    ["24px", "24px"],
    ["28px", "28px"],
    ["32px", "32px"],
    ["40px", "40px"],
    ["48px", "48px"],
    ["72px", "72px"]
];

export const EditableMaticoTextPane: React.FC<
    EditableMaticoTextPaneInterface
> = ({ content, updatePane, ...rest }) => {
    const edit = useIsEditable();
    // const [formattedText] = useFormattedText(content);
    // console.log("edit ", edit, " contnet ", content, " ", formattedText);
    //
    // const [toolbarExpanded, setToolbarExpanded] = React.useState(false);
    // const displayContent = edit ? content : formattedText;
    //
    const handleContent = debounce((content: string) => {
        updatePane({ content });
    }, 500);
    // const handleToggleExpanded = () => setToolbarExpanded((prev) => !prev);
    console.log("Loaded content is ", content);

    return (
        <MaticoTextPane
            key={`matico_edit_text_pane_${rest.id}`}
            content={content}
            handleContent={handleContent}
            isReadOnly={!edit}
            id={rest.id}
            position={rest.position}
            name={rest.name}
            background={{ rgb: [0, 0, 0] }}
        />
    );
};
