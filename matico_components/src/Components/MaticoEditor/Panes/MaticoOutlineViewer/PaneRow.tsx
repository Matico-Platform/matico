import React from "react";
import {
    ActionButton,
    Button,
    Flex,
    Text,
    View
} from "@adobe/react-spectrum";
import {
    Pane,
    PaneRef
} from "@maticoapp/matico_types/spec";
import Delete from "@spectrum-icons/workflow/Delete";
import { usePane } from "Hooks/usePane";
import {
    useSortable,
} from "@dnd-kit/sortable";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { NewPaneDialog } from "../../EditorComponents/NewPaneDialog/NewPaneDialog";
import { IconForPaneType } from "../../Utils/PaneDetails";
import { HoverableItem, HoverableRow } from "./Styled";
import { DragContainer, DragButton } from "./Styled";

export const PaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
    depth: number;
    children?: React.ReactNode;
    addPaneToContainer?: (p: Pane) => void;
}> = ({ rowPane, addPaneToContainer, index, children }) => {
    const { pane, removePaneFromParent, parent, selectPane } = usePane(rowPane);
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: rowPane.id,
            data: {
                paneRefId: rowPane.id,
                paneId: pane.id,
                pane,
                parent,
                index
            }
            // getNewIndex,
        });

    const style = transform
        ? {
              transform: `translate(${transform?.x}px, ${transform?.y}px)`,
              transition
          }
        : {};

    return (
        <HoverableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <DragContainer>
                <View position="relative" width="100%">
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="start"
                        wrap="nowrap"
                    >
                        <DragButton>
                            <DragHandle color="positive" />
                        </DragButton>
                        {IconForPaneType(pane.type)}
                        <Button variant="primary" onPress={selectPane} isQuiet>
                            <Text
                                UNSAFE_style={{
                                    textOverflow: "ellipsis",
                                    overflowX: "hidden",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {pane.name}
                            </Text>
                        </Button>
                    </Flex>
                    <HoverableItem
                        style={{
                            position: "absolute",
                            zIndex: 100,
                            right: 0,
                            top: 0,
                            backgroundColor:
                                "var(--spectrum-global-color-gray-100)"
                        }}
                    >
                        {!!addPaneToContainer && (
                            <NewPaneDialog onAddPane={addPaneToContainer} />
                        )}
                        <ActionButton isQuiet onPress={removePaneFromParent}>
                            <Delete />
                        </ActionButton>
                    </HoverableItem>
                </View>
            </DragContainer>
            {children}
        </HoverableRow>
    );
};

