import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Page } from "@maticoapp/matico_spec";
import {
  updatePage,
  deletePage,
  setCurrentEditElement,
} from "Stores/MaticoSpecSlice";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import {
  ComboBox,
  Heading,
  Flex,
  Item,
  TextField,
  Well,
  View,
  Button,
  ButtonGroup,
  Switch,
  Text,
  ActionButton,
  DialogTrigger,
  Dialog,
  Content,
} from "@adobe/react-spectrum";
import { PaneDefaults } from "../PaneDefaults";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { useIconList } from "Hooks/useIconList";
import {usePage} from "Hooks/usePage";

const NewSectionModal: React.FC<{
  onAddSection: (name: string) => void;
}> = ({ onAddSection }) => {
  const [name, setName] = useState("New Section");
  return (
    <DialogTrigger type="popover" isDismissable>
      <ActionButton>Add New</ActionButton>
      {(close) => (
        <Dialog>
          <Content>
            <Heading>New Section</Heading>
            <Flex direction="column" gap={"size-200"}>
              <TextField width={"100%"} value={name} onChange={setName} />
              <ActionButton
                width={"100%"}
                onPress={() => {
                  onAddSection(name);
                  close();
                }}
              >
                Add
              </ActionButton>
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

export interface PageEditorProps {
  id: string;
}
export const PageEditor: React.FC<PageEditorProps> = ({ id }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {page,updatePage}= usePage(id)

  const {
    iconList,
    filterText,
    setFilterText,
    loadMoreIcons
  } = useIconList();

  if (!page) {
    return (
      <View>
        <Text>Something went wrong. We could not find that page</Text>
      </View>
    );
  }
  return (
    <Flex width="100%" height="100%" direction="column">
      <Well>
        <Heading>Page Details</Heading>
        <TextField
          label="Name"
          value={page.name}
          onChange={(name: string) => updatePage({ name })}
        />
        <TextField
          label="path"
          value={page.path}
          onChange={(path: string) => updatePage({ path })}
        />
        <ComboBox
          label="Icon"
          selectedKey={page.icon}
          onSelectionChange={(icon: string) => updatePage({icon})}          
          items={iconList}
          inputValue={filterText}
          onInputChange={setFilterText}
          onLoadMore={loadMoreIcons}
          >
          {({id, name}) => <Item>
            <Text><i className={id} style={{marginRight: '1em'}}/>{name}</Text>
          </Item>}
        </ComboBox>
      </Well>
      <Well>
        <Heading>Danger Zone</Heading>
        <Flex direction="row" justifyContent="end" alignItems="center">
          {confirmDelete ? (
            <ButtonGroup>
              <Button variant="cta" onPress={deletePage}>
                Confirm
              </Button>
              <Button
                variant="secondary"
                onPress={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </ButtonGroup>
          ) : (
            <Button variant="cta" onPress={() => setConfirmDelete(true)}>
              Remove Page
            </Button>
          )}
        </Flex>
      </Well>
    </Flex>
  );
};
