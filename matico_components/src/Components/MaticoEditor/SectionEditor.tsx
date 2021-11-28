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

  const editPane = (index, paneType) => {
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
      <Heading fill textAlign="start" level={3}>
        Details
      </Heading>
      <Form value={section} onChange={(nextVal) => updateSection(nextVal)}>
        <FormField label="name" name="name" htmlFor={"name"}>
          <TextInput value={section.name} name="name" id="name" />
        </FormField>
        <FormField label="Layout" name="layout">
          <Select options={["free"]} name="layout" />
        </FormField>
      </Form>

      <Heading fill textAlign="start" level={3}>
        Panes
      </Heading>
      <List data={section.panes}>
        {(datum, index) => {
          const [paneType, paneSpecs] = Object.entries(datum)[0];
          return (
            <Box
              direction="row"
              gap={"medium"}
              align="center"
              fill="horizontal"
              margin="none"
            >
              <Text>{paneType}</Text>
              {/* @ts-ignore */}
              <Text flex={1}>{paneSpecs.name}</Text>
              <Button
                label="edit"
                onClick={() => editPane(index, paneType)}
              />
            </Box>
          );
        }}
      </List>
      <Box
        direction="row"
        gap={"medium"}
        align="center"
        fill="horizontal"
        margin="medium"
      >
        <Button
          label={"Add Scatterplot"}
          onClick={() => console.log("Adding Scatterplot pane")}
        />
        <Button
          label={"Add Pi Chart"}
          onClick={() => console.log("Adding Scatterplot pane")}
        />
        <Button
          label={"Add Histogram"}
          onClick={() => console.log("Adding Scatterplot pane")}
        />
        <Button
          label={"Add Map"}
          onClick={() => console.log("Adding Scatterplot pane")}
        />
      </Box>
      <Heading fill={true} textAlign={"start"} level={3}>
        Danger Zone
      </Heading>
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
