import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  List,
  Text,
  TextInput,
} from "grommet";
import { Edit } from "grommet-icons";
import { Page } from "matico_spec";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import MDEditor from "@uiw/react-md-editor";
import { SectionHeading } from "../Utils/Utils";

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

  const editSection = (index) => {
    console.log("SECTION is ", index);
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.sections.${index}`,
        editType: "Section",
      })
    );
  };

  const page = _.get(spec, editPath);

  if (!page) {
    return (
      <Box background={"white"}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box background={"white"} pad="medium">
      <Form value={page} onChange={(nextVal) => updatePage(nextVal)}>
        <SectionHeading>Settings</SectionHeading>
        <FormField label="name" name="name" htmlFor={"name"}>
          <TextInput value={page.name} name="name" id="name" />
        </FormField>
        <FormField label="path" name="path" htmlFor="path">
          <TextInput value={page.path} name="path" id={"path"} />
        </FormField>
        <FormField label="icon" name="icon" htmlFor="icon">
          <TextInput value={page.icon} id={"icon"} name="icon" />
        </FormField>
      </Form>
      <SectionHeading>Content</SectionHeading>
      <MDEditor preview="edit" value={page.content} onChange={updateContent} />
      <SectionHeading>Sections</SectionHeading>
      <List data={page.sections} pad="medium">
        {(datum, index) => (
          <Box direction="row" align="center" justify="between">
            <Text>{datum.name}</Text>
            <Button
              icon={<Edit color={"status-warning"} />}
              onClick={() => editSection(index)}
            />
          </Box>
        )}
      </List>
      <SectionHeading>Danger Zone</SectionHeading>
      {confirmDelete ? (
        <Box direction="row">
          <Button primary label="DO IT!" onClick={deletePage} />
          <Button
            secondary
            label="Nah I changed my mind"
            onClick={() => setConfirmDelete(false)}
          />
        </Box>
      ) : (
        <Button
          color="neutral-4"
          label="Delete Page"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
