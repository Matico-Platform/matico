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
    Well
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
    inset = "none",
    compact = false
}): any => {
    const { openEditor, remove, duplicate, move, reorder } = useSpecActions(
        editPath,
        editType
    );

    return (
        <View
            // UNSAFE_style={{
            //   padding: compact ? ".25em 1em" : "inherit",
            // }}
            paddingX="size-150"
            paddingY={compact ? "size-50" : "size-100"}
            marginTop="size-100"
            marginStart={`${inset}em`}
            width={`calc(100% - ${inset}em)`}
            backgroundColor="gray-100"
            borderColor="gray-400"
            borderWidth="thin"
            borderRadius="medium"
        >
            <Flex
                direction="row"
                margin="0"
                gap="size-50"
                width="100%"
                alignContent={"center"}
            >
                <View
                    maxWidth={"50%"}
                    overflow={"hidden"}
                    flexGrow={1}
                    justifySelf={"left"}
                    alignSelf="center"
                    UNSAFE_style={{textAlign: 'left'}}
                >
                    <Text justifySelf="left">{entryName}</Text>
                </View>
                <ActionGroup
                    isQuiet
                    buttonLabelBehavior="hide"
                    overflowMode="collapse"
                    justifySelf={"end"}
                    maxWidth="50%"
                    onAction={(action) => {
                        switch (action) {
                            case "delete":
                                remove();
                                break;
                            case "edit":
                                openEditor();
                                break;
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
                    <Item key="edit">
                        <Settings />
                        <Text>Edit</Text>
                    </Item>

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

                <View justifySelf={"end"}>
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
                                <Heading>Gone, forever?</Heading>
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
                </View>
            </Flex>
        </View>
    );
};
