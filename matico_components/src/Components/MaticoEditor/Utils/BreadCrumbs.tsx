import React, { Key } from "react";
import { setCurrentEditPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import styled from "styled-components";
import { Breadcrumbs, Item } from "@adobe/react-spectrum";

const editTypeMapping = {
    // todo: centralize
    pages: "Page",
    sections: "Section",
    Text: "Text",
    Map: "Map",
    Histogram: "Histogram",
    Scatterplot: "Scatterplot",
    PieChart: "PieChart",
    Controls: "Controls",
    Container: "Container"
};

// containers have an array of children panes, that are one index layer deeper than the container
// so, we just need to get the parent container, but other pane types are outer tagged with an index
// meaning we need different depth slicing for the parts of the path depending on pane type, for containers
// eg. someParentPath: {
//   Container: { <-- this is what we want
//     panes: [
//       ...
//    ]
// }
//
// someParentPath: {
//   panes: [
//     { Scatterplot:{}}, <-- this is what we want
//     ...
//   ]
// }
const getIndexSlice = (editItem: string, index: number) =>
    editItem === "Container" ? index + 1 : index + 2;

const BreadCrumbContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const BreadCrumbButton = styled.button`
    background-color: transparent;
    display: inline-block;
    width: auto;
    color: white;
    border: none;
    margin-right: 0.125em;
    margin-bottom: 0.25em;
    cursor: pointer;
    font-size: 1rem;
    &:after {
        content: "  >";
    }
`;

export const BreadCrumbs: React.FC<{ editPath: string }> = ({ editPath }) => {
    const dispatch = useMaticoDispatch();

    if (!editPath) {
        return <></>;
    }
    const breadCrumbPath = editPath.split(".");

    //@ts-ignore
    const setEditPath = ({ editPath, editType }) =>
        dispatch(setCurrentEditPath({ editPath, editType }));

    // console.log("breadCrumbPath ", breadCrumbPath);

    const pathSegments = breadCrumbPath
        .map((editItem, index) => ({
          // @ts-ignore
            label: editTypeMapping[editItem],
            editPath: breadCrumbPath
                .slice(0, getIndexSlice(editItem, index))
                .join("."),
            // @ts-ignore
            editType: editTypeMapping[editItem]
        })) //@ts-ignore
        .filter((a) => a.label);

    // console.log("pathSegments", pathSegments);

    if (pathSegments.length === 0) {
        return <></>;
    }

    console.log("path segments ", pathSegments);

    return (
        <Breadcrumbs
            onAction={(idx: number) => dispatch(setEditPath(pathSegments[idx]))}
        >
            {pathSegments.map((item: any, idx: number) => (
                <Item key={idx}>{item.label}</Item>
            ))}
        </Breadcrumbs>
    );
};
