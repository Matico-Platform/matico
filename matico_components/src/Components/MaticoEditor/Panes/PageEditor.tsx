import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Page } from "@maticoapp/matico_spec";
import {
  deleteSpecAtPath,
  duplicateSpecAtPath,
  removeSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@react-spectrum/icon';
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


const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix') //@ts-ignore
  .map((icon: string) => Icons[icon].iconName)
  .filter((f, i, arr) => f && !!f && f.length && arr.indexOf(f) === i)
  .map((name, id) => ({id, name}))

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
  editPath: string;
}
export const PageEditor: React.FC<PageEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const updatePage = (change: Page) => {
    dispatch(setSpecAtPath({ editPath: editPath, update: change }));
  };

  const updateContent = (content: string) =>
    dispatch(setSpecAtPath({ editPath: editPath, update: { content } }));

  const deletePage = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    console.log(editPath)
    dispatch(removeSpecAtPath({ editPath }));
  };

  const addNewSection = (name: string) => {
    dispatch(
      setSpecAtPath({
        editPath: editPath,
        update: {
          sections: [...page.sections, { ...PaneDefaults.Section, name }],
        },
      })
    );
  };

  const page = _.get(spec, editPath);
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
        <TextField
          label="icon"
          value={page.icon}
          onChange={(icon) => updatePage({ icon })}
        />
        {/* <ComboBox
          label="Icon"
          onSelectionChange={({name}) => icon && updatePage({ icon: name })}
          defaultItems={iconList}
          >
          {({name}) => <Item>
            <Icon slot="icon" marginTop="size-50" marginStart="size-50">
              <FontAwesomeIcon icon={name} size="xs" />
            </Icon>
            <Text marginStart="size-300">{name}</Text>
          </Item>}
        </ComboBox> */}
      </Well>
      <Well>
        <Heading>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text>Content</Text> <Switch>Simple</Switch>
          </Flex>
        </Heading>
        <ReactMde value={page.content} onChange={updateContent} />
      </Well>
      <Well>
        <Heading>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text>Sections</Text>
            <NewSectionModal onAddSection={addNewSection} />
          </Flex>
        </Heading>
        <Flex direction="column">
          {page.sections.map((section, index) => (
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <RowEntryMultiButton
                key={section.name}
                entryName={section.name}
                editPath={`${editPath}.sections.${index}`}
                editType="Section"
                />
            </Flex>
          ))}
        </Flex>
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
