import React from "react";
import { View } from "@adobe/react-spectrum";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { SortableContext } from "@dnd-kit/sortable";
import { PaneRow } from "./PaneRow";
import { ContainerPaneRow } from "./ContainerPaneRow";

export const PaneList: React.FC<{
    panes: PaneRef[];
    depth?: number;
}> = ({ panes, depth = 1 }) => {
    const items = panes.map((pane) => pane.id);

    return (
        <View
            borderStartColor={"gray-500"}
            borderStartWidth={"thick"}
            marginStart="size-50"
            UNSAFE_style={{
                paddingTop: depth === 0 ? "2em" : 0
            }}
        >
            <SortableContext
                items={items}
                // strategy={verticalListSortingStrategy}
            >
                {panes.map((pane, i) => {
                    if (pane.type === "container") {
                        return (
                            <ContainerPaneRow
                                key={pane.id + i}
                                rowPane={pane}
                                depth={depth}
                            />
                        );
                    } else {
                        return (
                            <PaneRow
                                key={pane.id + i}
                                rowPane={pane}
                                depth={depth}
                            />
                        );
                    }
                })}
            </SortableContext>
        </View>
    );
};
