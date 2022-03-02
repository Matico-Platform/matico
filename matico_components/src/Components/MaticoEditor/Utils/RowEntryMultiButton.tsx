import React from "react";
import {
  Content,
  Flex,
  ActionButton,
  ActionGroup,
  DialogTrigger,
  Dialog,
  Heading,
  View,
  Button,
  ActionGroup,
  Item,
  Text,
  Well,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import Delete from "@spectrum-icons/workflow/Delete";
import Copy from "@spectrum-icons/workflow/Copy";

interface RowEntryMultiButtonProps {
  entryName: string | React.ReactNode;
  index: number;
  setEdit: (index: number) => void;
  changeOrder?: (index: number, direction: "up" | "down") => void;
  deleteEntry?: (index: number) => void;
  duplicateEntry?: (index: number) => void;
}

export const RowEntryMultiButton: React.FC<RowEntryMultiButtonProps> = ({
  // TODO: arial labels
  index,
  entryName,
  setEdit,
  changeOrder,
  deleteEntry,
  duplicateEntry,
}) => (
  <Well>
    <Text>{entryName}</Text>
    <Flex direction="row" gap="size-100" marginTop="size-100" width="100%">
      <ActionGroup
        isQuiet
        buttonLabelBehavior="hide"
        density="compact"
        overflowMode="collapse"
        onAction={(action) => {
          switch (action) {
            case "delete":
              dispatch(
                deleteSpecAtPath({
                  editPath,
                })
              );
            case "edit":
              setEdit(index);
            case "duplicate":
              duplicateEntry(index);
            case "moveUp":
              changeOrder(index, "up");
            case "moveDown":
              changeOrder(index, "down");
            default:
              return;
          }
        }}
      >
        <Item key="edit">
          <Edit />
          <Text>Edit</Text>
        </Item>

        {duplicateEntry !== undefined && (
          <Item key="duplicate">
            <Copy />
            <Text>Duplicate</Text>
          </Item>
        )}
        {changeOrder !== undefined && (
          <Item key="moveUp">
            <ChevronUp />
            <Text>Bring to Front</Text>
          </Item>
        )}
        {changeOrder !== undefined && (
          <Item key="moveDown">
            <ChevronDown />
            <Text>Send to Back</Text>
          </Item>
        )}
      </ActionGroup>

      {deleteEntry !== undefined && (
      <View>
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
                    deleteEntry(index);
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
    )}
    </Flex>
  </Well>
);
