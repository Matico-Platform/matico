import React, { useState } from "react";
import {
    ActionButton,
    ActionGroup,
    Button,
    ButtonGroup,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Item,
    Text,
    View
} from "@adobe/react-spectrum";
import { useAppSpec } from "Hooks/useAppSpec";
import {
    RowEntryMultiButton,
    RowEntryMultiButtonProps
} from "../Utils/RowEntryMultiButton";
import { isArray, isObject, remove } from "lodash";
import { useApp } from "Hooks/useApp";
import {
    ContainerPane,
    Page,
    Pane,
    PaneRef
} from "@maticoapp/matico_types/spec";
import { usePage } from "Hooks/usePage";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Settings from "@spectrum-icons/workflow/Settings";
import Duplicate from "@spectrum-icons/workflow/Duplicate";
import { GatedAction } from "../EditorComponents/GatedAction";
import Delete from "@spectrum-icons/workflow/Delete";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { usePane } from "Hooks/usePane";
import { Container } from "react-dom";
import { useContainer } from "Hooks/useContainer";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import {
    restrictToVerticalAxis,
    restrictToWindowEdges
} from "@dnd-kit/modifiers";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { NewPaneDialog } from "../EditorComponents/NewPaneDialog/NewPaneDialog";

// function addForContainer(container: ContainerPane, inset: number) {
//   let containerPanes: Array<RowEntryMultiButtonProps> = [];

//   rowComponents.push(
//     {
//       entryName: page.name,
//       inset: inset,
//       compact: true,
//       onSelect: () => setEditPage(page.id),
//       onRemove: () => removePage(page.id),
//       onRaise: () => { },
//       onLower: () => { },
//       onDuplicate: () => { }
//     }

//   )
//   inset += 1
// }

const HoverableItem = styled.span`
    opacity: 0;
    transition: 125ms opacity;
`;

const HoverableRow = styled.span`
    :hover {
        background: #cc00007f;
    }
    &:hover ${HoverableItem} {
        opacity: 1;
    }
`;

const DragButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
`;

const DragContainer = styled.div`
    transition: 250ms box-shadow;
`;

const PaneRow: React.FC<{
    rowPane: PaneRef;
    addPaneToContainer?: (p: Pane) => void;
}> = ({ rowPane, addPaneToContainer }) => {
    const {
        pane,
        updatePane,
        removePane,
        removePaneFromParent,
        updatePanePosition,
        parent,
        raisePane,
        lowerPane,
        setPaneOrder,
        selectPane
    } = usePane(rowPane);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: pane.id,
        data: {
            paneRefId: pane.id
        }
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              background: "var(--spectrum-global-color-static-gray-900)",
              boxShadow:
                  "0px 0px 10px var(--spectrum-global-color-fuchsia-400)",
              cursor: "grabbing",
              zIndex: 500
          }
        : undefined;

    return (
        <HoverableRow>
            <DragContainer style={style} ref={setNodeRef}>
                <Flex direction="row" justifyContent="space-between">
                    <View>
                        <DragButton {...listeners} {...attributes}>
                            <DragHandle />
                        </DragButton>
                        <Button
                            variant="primary"
                            onPress={selectPane}
                            isQuiet
                            UNSAFE_style={{
                                borderRadius: 0,
                                color: "var(--spectrum-global-color-gray-900)",
                                textAlign: "left",
                                justifyContent: "flex-start",
                                padding: ".25em 0"
                            }}
                        >
                            {pane.name}
                        </Button>
                    </View>
                    <View>
                        <HoverableItem>
                            {!!addPaneToContainer && (
                                <NewPaneDialog onAddPane={addPaneToContainer} />
                            )}
                            <ActionButton isQuiet onPress={removePaneFromParent}>
                                <Delete />
                            </ActionButton>
                        </HoverableItem>
                    </View>
                </Flex>
            </DragContainer>
        </HoverableRow>
    );
};

const ContainerPaneRow: React.FC<{
    rowPane: PaneRef;
}> = ({ rowPane }) => {
    const { pane } = usePane(rowPane);
    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;
    const { isOver, setNodeRef } = useDroppable({
        id: pane.id,
        data: {
            targetId: pane.id,
        }
    });

    const style = {
        border: isOver
            ? "1px solid var(--spectrum-global-color-fuchsia-400)"
            : "1px solid rgba(0,0,0,0)",
        background: isOver
            ? "var(--spectrum-global-color-static-gray-800)"
            : undefined,
        transition: "250ms all"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <PaneRow
                rowPane={rowPane}
                addPaneToContainer={addPaneToContainer}
            />
            <PaneList panes={panes} />
        </div>
    );
};

const PaneList: React.FC<{
    panes: PaneRef[];
}> = ({ panes, addPaneToParent }) => {
    return (
        <View
            borderStartColor={"gray-500"}
            borderStartWidth={"thick"}
            marginStart="size-50"
        >
            {panes.map((pane) => {
                if (pane.type === "container") {
                    return <ContainerPaneRow rowPane={pane} />;
                } else {
                    return <PaneRow rowPane={pane} />;
                }
            })}
        </View>
    );
};

interface PageListProps {
    page: Page;
}

const PageList: React.FC<PageListProps> = ({ page }) => {
    const { panes, id, name: pageName } = page;
    const { addPaneToPage, selectPage, removePage } = usePage(id);
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            targetId: id
        }
    });

    const style = {
        border: isOver
            ? "1px solid var(--spectrum-global-color-fuchsia-400)"
            : "1px solid rgba(0,0,0,0)",
        background: isOver
            ? "var(--spectrum-global-color-static-gray-800)"
            : undefined,
        transition: "250ms all"
    };
    return (
        <div ref={setNodeRef} style={style}>
            <HoverableRow>
                <Flex direction="row" justifyContent="space-between">
                    <View>
                        <Button variant="primary" onPress={selectPage} isQuiet>
                            <Text UNSAFE_style={{ paddingRight: ".5em" }}>
                                {pageName}
                            </Text>
                        </Button>
                    </View>
                    <HoverableItem>
                        <Flex direction="row">
                            <NewPaneDialog onAddPane={addPaneToPage} />
                            <DialogTrigger
                                isDismissable
                                type="popover"
                                mobileType="tray"
                                placement="right top"
                                containerPadding={1}
                            >
                                <ActionButton isQuiet>
                                    <Delete />
                                </ActionButton>
                                {(close) => (
                                    <Dialog width="auto">
                                        <Heading>Delete {name}?</Heading>
                                        <Content marginTop="size-100">
                                            <Button
                                                variant="negative"
                                                onPress={() => {
                                                    removePage();
                                                    close();
                                                }}
                                            >
                                                <Delete /> Delete
                                            </Button>
                                        </Content>
                                    </Dialog>
                                )}
                            </DialogTrigger>
                        </Flex>
                    </HoverableItem>
                </Flex>
            </HoverableRow>
            <PaneList panes={panes} />
        </div>
    );
};

type MaticoOutlineViewerProps = RouteComponentProps & {};

type MutableList = {
    name: string;
    id: string;
    type: string;
    depth: number;
}[];

export const MaticoOutlineViewer: React.FC = withRouter(
    ({ history, location }: MaticoOutlineViewerProps) => {
        // list pages
        const {
            pages,
            reparentPane
        } = useApp();

        const handleDragEnd = (e: any) => {
            const {
                over: { id: targetId },
                active: { id: paneRefId }
            } = e;
            reparentPane(paneRefId, targetId);
        };

        return (
            <Flex direction="column">
                <Heading margin="size-150" alignSelf="start">
                    Page Outline
                </Heading>
                <DndContext
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                >
                    {pages.map((page) => (
                        <PageList page={page} />
                    ))}
                </DndContext>
            </Flex>
        );
    }
);
