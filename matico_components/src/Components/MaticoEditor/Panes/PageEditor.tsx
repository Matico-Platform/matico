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
} from "@adobe/react-spectrum";
import * as icons from "@fortawesome/free-solid-svg-icons";

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

  const editSection = (index: number) => {
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.sections.${index}`,
        editType: "Section",
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
        <ComboBox defaultItems={iconOptions} label="Icon">
          {(item) => (
            <Item key={item.key}>
              <FontAwesomeIcon icon={item.icon} />
              <Text>{item.key}</Text>
            </Item>
          )}
        </ComboBox>
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
            <Text>Sections</Text> <ActionButton>Add New</ActionButton>
          </Flex>
        </Heading>
        <Flex direction="column">
          {page.sections.map((section, index) => (
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <ActionButton onPress={() => editSection(index)} isQuiet>{section.name}</ActionButton>
            </Flex>
          ))}
        </Flex>
      </Well>

      <Well>
        <Heading>Danger Zone</Heading>
        <Flex direction='row' justifyContent='end' alignItems='center'>
          {confirmDelete ? (
            <ButtonGroup>
              <Button variant="cta" onPress={deletePage}>Confirm</Button>
              <Button variant="secondary" onPress={()=>setConfirmDelete(false)}>Cancel</Button>
            </ButtonGroup>
          ) : (
          <Button variant="cta" onPress={()=>setConfirmDelete(true)}>Remove Page</Button>
          )}
        </Flex>
      </Well>
    </Flex>
  );
};
