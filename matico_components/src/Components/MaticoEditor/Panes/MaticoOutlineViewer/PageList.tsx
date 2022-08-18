import React from "react";
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
import {
    Page,
} from "@maticoapp/matico_types/spec";
import { usePage } from "Hooks/usePage";
import Delete from "@spectrum-icons/workflow/Delete";
import {
    useDroppable,
} from "@dnd-kit/core";
import { NewPaneDialog } from "../../EditorComponents/NewPaneDialog/NewPaneDialog";
import {HoverableRow, HoverableItem} from './Styled'
import { useDraggingContext } from './DraggingContext'
import {ContainerDropTarget} from './Styled'
import {PaneList} from './PaneList'
interface PageListProps {
    page: Page;
}

export const PageList: React.FC<PageListProps> = ({ page }) => {
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
    const showDropZone = !!activeItem;

    return (
        <div style={{ position: "relative", marginTop: "2em" }}>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
                depth={depth}
            >
                <HoverableRow>
                    <Flex direction="row" justifyContent="space-between">
                        <View>
                            <Button
                                variant="primary"
                                onPress={selectPage}
                                isQuiet
                            >
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
                {/* {showDropZone && <IconEl size="M" />} */}
            </ContainerDropTarget>
        </div>
    );
};