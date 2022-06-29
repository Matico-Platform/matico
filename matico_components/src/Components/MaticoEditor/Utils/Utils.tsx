import { Heading } from "@adobe/react-spectrum";
import { Ace } from "ace-builds";
import React from "react";

export const SectionHeading: React.FC = ({ children }) => (
    <Heading alignSelf={"start"} level={3}>
        {children}
    </Heading>
);

export function json_error_to_annotation(error: string) {
    const rg = /(.*)at line (\d+) column (\d+)/;
    const parts = error.match(rg);
    if (parts) {
        return [
            {
                row: parseInt(parts[2]) - 1,
                column: parseInt(parts[3]) - 1,
                type: "error",
                text: parts[1]
            }
        ] as Ace.Annotation[];
    }
    return [] as Ace.Annotation[];
}

export function findParentContainer(path: string) {
    // remove the last part, to prevent self from being identified as parent
    const parts = path.split(".").slice(0, -1);
    // find first container, either a section or container pane
    const containerIndex =
        parts.length -
        1 -
        [...parts]
            .reverse()
            .findIndex((part) => ["Container", "sections"].includes(part));

    // if container, slice to the container spec
    // if section, we need to slice to the section spec + the index of the section
    const parentPath =
        parts[containerIndex] === "Container"
            ? parts.slice(0, containerIndex + 1).join(".")
            : parts.slice(0, containerIndex + 2).join(".");

    return parentPath;
}
