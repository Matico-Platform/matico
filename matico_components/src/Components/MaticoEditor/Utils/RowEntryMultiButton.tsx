import React, {ReactComponentElement} from "react";
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
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import Delete from "@spectrum-icons/workflow/Delete";
import Duplicate from "@spectrum-icons/workflow/Duplicate";
import Settings from "@spectrum-icons/workflow/Settings";

export interface RowEntryMultiButtonProps {
    entryName: string | React.ReactNode,
    onRemove: ()=>void,
    onDuplicate: ()=>void,
    onRaise: ()=>void,
    onLower:()=>void,
    onSelect:()=>void,
    inset?: number;
    compact?: boolean;
}

export const RowEntryMultiButton: React.FC<RowEntryMultiButtonProps> = ({
    // TODO: arial labels
    entryName,
    inset = 0,
    compact = false,
    onSelect,
    onRemove,
    onLower,
    onRaise,
    onDuplicate
}) => {
   return (
        <View
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
                justifyContent={"space-between"}
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
                    marginStart={`-${inset/2}em`}
                    onAction={(action) => {
                        switch (action) {
                            case "delete":
                                onRemove();
                                break;
                            case "edit":
                                onSelect();
                                break;
                            case "duplicate":
                                onDuplicate();
                                break;
                            case "moveUp":
                                onRaise();
                                break;
                            case "moveDown":
                                onLower();
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
                                            onRemove();
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
