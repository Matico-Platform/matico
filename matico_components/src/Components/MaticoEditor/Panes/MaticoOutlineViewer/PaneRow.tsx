import React, { useEffect } from "react";
import { ActionButton, Flex, Text, View } from "@adobe/react-spectrum";
import { Pane, PaneRef } from "@maticoapp/matico_types/spec";
import Delete from "@spectrum-icons/workflow/Delete";
import { usePane } from "Hooks/usePane";
import { useSortable } from "@dnd-kit/sortable";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { NewPaneDialog } from "../../EditorComponents/NewPaneDialog/NewPaneDialog";
import { IconForPaneType } from "../../Utils/PaneDetails";
import { HoverableItem, HoverableRow } from "./Styled";
import { DragContainer, DragButton } from "./Styled";
import { useMaticoSelector } from "Hooks/redux";
import { usePageContext } from "./PageContext";
import { useEditorActions } from "Hooks/useEditorActions";

export const PaneRow: React.FC<{
    rowPane: PaneRef;
    depth: number;
    children?: React.ReactNode;
    addPaneToContainer?: (p: Pane) => void;
}> = ({ rowPane, addPaneToContainer, children }) => {
    const { pane, removePaneFromParent, parent, selectPane } = usePane(rowPane);
    const { setHovered } = useEditorActions(rowPane.id);
    const { currentEditElement } = useMaticoSelector((state) => state.spec);
    const currentHoveredRef = useMaticoSelector(
        (state) => state.editor.hoveredRef
    );
    const navigateToPage = usePageContext();
    const isActiveRef = currentEditElement?.id === rowPane.id;
    const isHoveredRef = currentHoveredRef === rowPane.id;

    const handleHover = () => {
        !isActiveRef && setHovered();
    };
    const handleMouseLeave = () => {
        setHovered(null);
    };
    const handleClick = () => {
        selectPane();
    };

    useEffect(() => {
        // @ts-ignore
        isActiveRef && navigateToPage();
    }, [isActiveRef]);

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: rowPane.id,
        data: {
            paneRefId: rowPane.id,
            paneId: pane.id,
            pane,
            parent
        }
    });

    const transformStyle = transform
        ? {
              transform: `translate(${transform?.x}px, ${transform?.y}px)`,
              transition
          }
        : {};
    const backgroundStyle = {
        background: isActiveRef
            ? "var(--spectrum-global-color-gray-200)"
            : isHoveredRef
            ? "var(--spectrum-global-color-gray-300)"
            : "rgba(0,0,0,0)"
    };

    return (
        <HoverableRow
            ref={setNodeRef}
            style={{
                ...transformStyle,
                ...backgroundStyle
            }}
            {...attributes}
        >
            <DragContainer
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <View position="relative" width="100%">
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="start"
                        wrap="nowrap"
                    >
                        <DragButton {...listeners} ref={setActivatorNodeRef}>
                            <DragHandle color="positive" />
                        </DragButton>
                        {IconForPaneType(pane.type, {
                            color: isActiveRef ? "positive" : undefined
                        })}
                        <Text
                            UNSAFE_style={{
                                textOverflow: "ellipsis",
                                overflowX: "hidden",
                                whiteSpace: "nowrap",
                                paddingLeft: ".5em",
                                fontWeight: "bold"
                            }}
                        >
                            {pane.name}
                        </Text>
                        {/* </Button> */}
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
