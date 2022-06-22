import React, { useState } from "react";
import {
  Flex,
  View,
  TextField,
  Text,
  Well,
  Heading,
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
} from "@adobe/react-spectrum";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import {Page} from "@maticoapp/matico_types/spec";
import {useApp} from "Hooks/useApp";

interface AddPageModalProps {
  onAddPage: (pageName: string) => void;
  validatePageName?: (pageName: string) => boolean;
}

const AddPageModal: React.FC<AddPageModalProps> = ({
  onAddPage,
  validatePageName,
}) => {
  const [newPageName, setNewPageName] = useState("New Page");
  const [errorText, setErrorText] = useState<string | null>(null);

  const attemptToAddPage = (pageName: string, close: () => void) => {
    if (newPageName.length === 0) {
      setErrorText("Please provide a name");
    }
    if (validatePageName) {
      if (validatePageName(pageName)) {
        onAddPage(pageName);
        close();
      } else {
        setErrorText(
          "Another page with the same name exists, pick something else"
        );
      }
    } else {
      onAddPage(newPageName);
    }
  };

  return (
    <DialogTrigger type="popover" isDismissable>
      <ActionButton isQuiet>Add</ActionButton>
      {(close: any) => (
        <Dialog>
          <Heading>Select pane to add</Heading>
          <Content>
            <Flex direction="column" gap="size-150">
              <TextField
                label="New pane name"
                value={newPageName}
                onChange={setNewPageName}
                errorMessage={errorText}
                width="100%"
              />
              <ActionButton
                onPress={() => {
                  attemptToAddPage(newPageName, close);
                }}
              >
                Add Page
              </ActionButton>
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

interface AppEditorProps {}

export const AppEditor: React.FC<AppEditorProps> = () => {
  const {pages, addPage, removePage, setEditPage} = useApp();

  // console.log("Spec is ", spec);

  const addNewPage = (pageName: string) => {
    addPage(pageName, {'type':"free"})
  };

  const validatePageName = (name: string) => {
    if (pages.find((p:Page) => p.name === name)) {
      return false;
    }
    return true;
  };

  return (
    <Flex direction="column">
      <Well>
        <Heading>
          <Flex direction="row" justifyContent="space-between" alignItems="end">
            <Text>Pages</Text>
            <AddPageModal
              validatePageName={validatePageName}
              onAddPage={addNewPage}
            />
          </Flex>
        </Heading>
        <Flex marginBottom={"size-200"} direction="column">
          {pages.map((page:Page) => (
            <RowEntryMultiButton
              key={page.name}
              entryName={page.name}
              onRemove={() => removePage(page.id)}
              onLower={() => {} }
              onRaise={() => {} }
              onDuplicate={() => {} } 
              onSelect={ () => setEditPage(page.id) } 
            />
          ))}
        </Flex>
      </Well>
    </Flex>
  );
};
