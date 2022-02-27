import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Page } from "@maticoapp/matico_spec";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
import * as icons from "@fortawesome/free-solid-svg-icons";
import { PaneDefaults } from "../PaneDefaults";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";

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
    dispatch(deleteSpecAtPath({ editPath }));
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

  const duplicateSection= (index: number) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          sections: [
            ...page.sections.slice(0, index),
            //@ts-ignore
            { ...page.sections[index], name: `${page.sections[index].name}_copy` },
            ...page.sections.slice(index),
          ],
        },
      })
    );
  };

  const editSection = (index: number) => {
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.sections.${index}`,
        editType: "Section",
      })
    );
  };

  const deleteSection = (index: number) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          sections: [
            ...page.sections.slice(0, index),
            ...page.sections.slice(index + 1),
          ],
        },
      })
    );
  };

  const changeOrder = (index: number, direction: "up" | "down") => {
    if (
      (index === 0 && direction === "up") ||
      (index === page.sections.length - 1 && direction === "down")
    ) {
      return;
    }

    let sections = [...page.sections];
    const changedSection = sections.splice(index, 1)[0];
    sections.splice(
      direction === "up" ? index - 1 : index + 1,
      0,
      changedSection
    );

    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          sections,
        },
      })
    );
  };

  const page = _.get(spec, editPath);

  const iconOptions = Object.keys(icons)
    .slice(100, 200)
    .map((iconName: string) => ({ key: iconName, icon: icons[iconName] }))
    .filter((a) => a);

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
                index={index}
                key={index}
                entryName={<Text>{section.name}</Text>}
                setEdit={editSection}
                changeOrder={changeOrder}
                deleteEntry={deleteSection}
                duplicateEntry={duplicateSection}
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
