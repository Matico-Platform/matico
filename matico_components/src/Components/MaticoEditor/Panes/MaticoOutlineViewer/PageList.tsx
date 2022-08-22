import React, { useEffect } from "react";
import {
    ActionButton,
    Button,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Text,
    View
} from "@adobe/react-spectrum";
import { Page } from "@maticoapp/matico_types/spec";
import { usePage } from "Hooks/usePage";
import Delete from "@spectrum-icons/workflow/Delete";
import { useDroppable } from "@dnd-kit/core";
import { NewPaneDialog } from "../../EditorComponents/NewPaneDialog/NewPaneDialog";
import {
    HoverableRow,
    HoverableItem,
    DragButton,
    DraggableContainer,
    DragContainer
} from "./Styled";
import { useDraggingContext } from "./DraggingContext";
import { ContainerDropTarget } from "./Styled";
import { PaneList } from "./PaneList";
import { useSortable } from "@dnd-kit/sortable";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import styled from "styled-components";
import { RouteComponentProps } from "react-router-dom";
import { PageProvider } from "./PageContext";
interface PageListProps {
    page: Page;
    children?: React.ReactNode;
    route?: RouteComponentProps;
}

// const PageListOuter: React.FC<PageListProps> = ({ page, children }) => {

//     return (
//             {children}
//         </HoverableRow>
//     );
// };
// div style={{ position: "relative", marginTop: "2em", ...style }}

export const PageList: React.FC<PageListProps> = ({ page, route }) => {
    const { panes, id, name: pageName } = page;
    const { addPaneToPage, selectPage, removePage } = usePage(id);
    const activeItem = useDraggingContext();
    const depth = 0;
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            targetId: id,
            type: "page",
            depth
        }
    });
    const {
        attributes,
        listeners,
        setActivatorNodeRef,
        setNodeRef: setSortableNodeRef,
        transform,
        transition
    } = useSortable({
        id: page.id,
        data: {
            type: "page",
            name: page.name
        }
    });

    const style = transform
        ? {
              transform: `translate(${transform?.x}px, ${transform?.y}px)`,
              transition
          }
        : {};

    const showDropZone = // @ts-ignore
        !!activeItem && activeItem?.data?.current?.type !== "page";

    const navigateToPage = () => {
        const onPage = route?.location?.path === page.path;
        !onPage && route?.history.push(page.path);
    };
    const handlePageButtonClick = () => {
        navigateToPage();
        selectPage();
    };
    useEffect(() => {
        isOver && showDropZone && navigateToPage();
    }, [isOver]);

    return (
        <PageProvider navigateToPage={navigateToPage}>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
                depth={depth}
            >
                <HoverableRow
                    ref={setSortableNodeRef}
                    style={{ ...style, marginTop: "1em", color:"white" }}
                >
                    <DragContainer onClick={handlePageButtonClick}>
                        <Flex direction="row" justifyContent="space-between">
                            <Flex direction="row" alignItems="center">
                                <HoverableItem>
                                    <DragButton
                                        ref={setActivatorNodeRef}
                                        {...attributes}
                                        {...listeners}
                                    >
                                        <DragHandle color="positive" />
                                    </DragButton>
                                </HoverableItem>
                                {/* <Button
                                variant="primary"
                                onPress={handlePageButtonClick}
                                isQuiet
                            > */}
                                <Text
                                    UNSAFE_style={{
                                        padding: "0 .5em",
                                        fontWeight: "bold",
                                        color:"white"
                                    }}
                                >
                                    {pageName}
                                </Text>
                                {/* </Button> */}
                            </Flex>
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
                                                <Heading>
                                                    Delete {name}?
                                                </Heading>
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
                    </DragContainer>
                </HoverableRow>
                <PaneList panes={panes} />
            </ContainerDropTarget>
        </PageProvider>
    );
};
