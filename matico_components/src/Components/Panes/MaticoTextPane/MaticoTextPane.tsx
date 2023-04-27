import React, { useMemo, useRef } from "react";
import { MaticoPaneInterface } from "../Pane";
import ReactQuill, { Quill } from "react-quill";
import ResizeModule from "@ssumo/quill-resize-module";

Quill.register("modules/resize", ResizeModule);

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
import { ColorSpecification } from "@maticoapp/matico_types/spec";
import { chromaColorFromColorSpecification } from "../MaticoMapPane/LayerUtils";
import chroma from "chroma-js";
export interface MaticoTextPaneInterface extends MaticoPaneInterface {
    content: string;
    handleContent?: (content: string) => void;
    isReadOnly?: boolean;
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

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
];

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
    content,
    handleContent = () => {},
    isReadOnly = true,
    id
}) => {
    const quillRef = useRef(null);

    const imageHandler = () => {
        if (!quillRef.current) return;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const value = prompt("Please enter the image URL");

        if (value && range) {
            editor.insertEmbed(range.index, "image", value, "user");
        }
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" }
                    ],
                    [
                        { align: "left" },
                        { align: "center" },
                        { align: "right" }
                    ],
                    ["link", "image"],
                    ["clean"]
                ],
                handlers: {
                    image: imageHandler,
                    resize: {}
                }
            }
        }),
        []
    );

    return (
        <div
            id={`text_container_${id}`}
            style={{ width: "100%", height: "100%", overflowY: "auto" }}
        >
            <ReactQuill
                ref={quillRef}
                formats={formats}
                key={`text_pane_${id}`}
                theme={"snow"}
                modules={modules}
                bounds={`text_container_${id}`}
                id={`text_pane_${id}`}
                defaultValue={content}
                readOnly={isReadOnly}
                onChange={handleContent}
            />
        </div>
    );
};
