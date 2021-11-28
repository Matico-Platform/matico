import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  List,
  Select,
  Text,
  TextInput,
} from "grommet";
import { Section } from "matico_spec";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "../../Stores/MaticoSpecSlice";

export interface SectionEditorProps {
  editPath: string;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();

  const updateSection = (change: Section) => {
    dispatch(setSpecAtPath({ editPath: editPath, update: change }));
  };

  const deleteSection = () => {
    dispatch(setCurrentEditPath({ editPath: null, editType: null }));
    dispatch(deleteSpecAtPath({ editPath }));
  };

  const editPane= (index, paneType) => {
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.panes.${index}.${paneType}`,
        editType: paneType,
      })
    );
  };

  const section = _.get(spec, editPath);

  if (!section) {
    return (
      <Box>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box pad="medium">
      <Form value={section} onChange={(nextVal) => updateSection(nextVal)}>
        <FormField label="name" name="name" htmlFor={"name"}>
          <TextInput value={section.name} name="name" id="name" />
        </FormField>
        <FormField label="Layout" name='layout'>
          <Select options={["free"]} name='layout' />
        </FormField>
      </Form>
      <Heading level={4}>Panes</Heading>
      <List data={section.panes} >
        {(datum, index)=>{
          const [paneType, paneSpecs] = Object.entries(datum)[0]
          return (
          <Box direction="row" gap={"medium"} align="center">
            <Text>{paneType}</Text>
            {/* @ts-ignore */}
            <Text>{paneSpecs.name}</Text>
            <Button alignSelf="end" label="edit" onClick={()=>editPane(index,paneType)} />
          </Box>
          )}}
      </List>
      <Heading level={4}>Danger Zone</Heading>
      {confirmDelete ? (
        <Box direction="row">
          <Button primary label="DO IT!" onClick={deleteSection} />
          <Button
            secondary
            label="Nah I changed my mind"
            onClick={() => setConfirmDelete(false)}
          />
        </Box>
      ) : (
        <Button
          color="neutral-4"
          label="Delete section"
          onClick={() => setConfirmDelete(true)}
        />
      )}
    </Box>
  );
};
