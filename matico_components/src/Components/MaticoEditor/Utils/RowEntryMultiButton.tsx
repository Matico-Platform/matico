import React from "react";
import {
    Content,
    Flex,
    ActionButton,
    DialogTrigger,
    Dialog,
    Heading,
    View,
    Button,
    ActionGroup,
    Item,
    Text,
    Well,
    Divider,
    DialogContainer
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import Delete from "@spectrum-icons/workflow/Delete";
import Copy from "@spectrum-icons/workflow/Copy";
import Duplicate from "@spectrum-icons/workflow/Duplicate";
import Settings from "@spectrum-icons/workflow/Settings";
import { useSpecActions } from "Hooks/useSpecActions";

export interface RowEntryMultiButtonProps {
    entryName: string | React.ReactNode;
    editPath: string;
    editType: string;
    inset?: number;
    compact?: boolean;
}

export const RowEntryMultiButton: React.FC<RowEntryMultiButtonProps> = ({
    // TODO: arial labels
    entryName,
    editPath,
    editType,
    inset = 0,
    compact = false
}): any => {
    const { openEditor, remove, duplicate, move, reorder } = useSpecActions(
        editPath,
        editType
    );
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    return (
        <Flex
            width={`100%`}
            direction="row"
            gap="size-50"
            position={"relative"}
        >
            {inset > 0 && <Divider
                orientation="vertical"
                position="absolute"
                left={`${inset}em`}
                top={0}
                size="M"
                height="100%"
                UNSAFE_style={{
                    pointerEvents: "none"
                }}
            />}
            <Button
                onPress={() => openEditor()}
                variant="primary"
                isQuiet
                flex="1 1 auto"
                maxWidth={"calc(100% - 80px)"}
                UNSAFE_style={{
                    paddingLeft: `calc(${inset}em + 6px)`,
                    borderRadius: 0,
                    cursor: "pointer"
                }}
            >
                <Text
                    justifySelf={"flex-start"}
                    UNSAFE_style={{
                        textAlign: "left",
                    }}
                >
                    {entryName}
                </Text>
            </Button>
            <DialogTrigger
                isDismissable
                type="popover"
                mobileType="tray"
                containerPadding={1}
            >
                <ActionButton isQuiet>
                    <Delete />
                </ActionButton>
                {(close) => (
                    <Dialog>
                        <Heading>Are you sure you want to delete {entryName}?</Heading>
                        <Content marginTop="size-100">
                            <Button
                                variant="negative"
                                onPress={() => {
                                    remove();
                                    close();
                                }}
                            >
                                <Delete /> Delete
                            </Button>
                        </Content>
                    </Dialog>
                )}
            </DialogTrigger>
            <ActionGroup
                isQuiet
                buttonLabelBehavior="hide"
                overflowMode="collapse"
                flex="0 0 auto"
                maxWidth={40}
                width={40}
                onAction={(action) => {
                    switch (action) {
                        case "duplicate":
                            duplicate();
                            break;
                        case "moveUp":
                            reorder("forward");
                            break;
                        case "moveDown":
                            reorder("backward");
                            break;
                        default:
                            return;
                    }
                }}
            >
                <Item key="duplicate">
                    <Duplicate />
                    <Text>Duplicate</Text>
                </Item>
                <Item key="moveUp">
                    <ChevronUp />
                    <Text>Bring Forward</Text>
                </Item>
                <Item key="moveDown">
                    <ChevronDown />
                    <Text>Send Backward</Text>
                </Item>
            </ActionGroup>
        </Flex>
    );
};