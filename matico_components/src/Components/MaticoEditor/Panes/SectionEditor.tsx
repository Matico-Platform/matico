import React, { useState, useEffect } from "react";
import  _ from "lodash";
import { Add } from "grommet-icons";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  List,
  Select,
  Text,
  TextInput,
} from "grommet";
import { Edit } from "grommet-icons";
import { Section } from "@maticoapp/matico_spec";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { PaneDefaults } from "../PaneDefaults";

export interface SectionEditorProps {
  editPath: string;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ editPath }) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useMaticoDispatch();
  const section = _.get(spec, editPath);

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

  const addPane = (paneType: string) => {
    dispatch(
      setSpecAtPath({
        editPath: editPath,
        update: {
          panes: [...section.panes, { [paneType]: PaneDefaults[paneType] }],
        },
      })
    );
  };

  if (!section) {
    return (
      <Box background={"white"}>
        <Text color="status-error">Failed to find component</Text>
      </Box>
    );
  }
  return (
    <Box background={"white"} pad="medium">
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
              justify="start"
              fill="horizontal"
              margin="none"
            >
              <Box flex>
                <Text textAlign="start">
                  {/* @ts-ignore */}
                  {paneSpecs.name}
                </Text>
              </Box>
              <Text>{paneType}</Text>
              <Button
                plain={false}
                icon={<Edit color="status-warning" />}
                onClick={() => editPane(index, paneType)}
              />
            </Box>
          );
        }}
      </List>
      <Grid
        columns={{ count: 3, size: "auto" }}
        gap={"medium"}
        align="center"
        justify="center"
        fill="horizontal"
        margin="medium"
      >
        <Button
          plain={false}
          icon={<Add />}
          label={"Scatterplot"}
          onClick={() => addPane("Scatterplot")}
        />
        <Button
          plain={false}
          icon={<Add />}
          label={"PieChart"}
          onClick={() => addPane("PieChart")}
        />
        <Button
          plain={false}
          icon={<Add />}
          label={"Histogram"}
          onClick={() => addPane("Histogram")}
        />
        <Button
          plain={false}
          icon={<Add />}
          label={"Map"}
          onClick={() => addPane("Map")}
        />
        <Button
          plain={false}
          icon={<Add />}
          label={"Text"}
          onClick={() => addPane("Text")}
        />
      </Grid>
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
