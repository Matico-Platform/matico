import React, { useState} from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { Section } from "@maticoapp/matico_spec";
import {
  deleteSpecAtPath,
  setCurrentEditPath,
  setSpecAtPath,
} from "Stores/MaticoSpecSlice";
import { PaneDefaults } from "../PaneDefaults";
import {
  Heading,
  Flex,
  Item,
  TextField,
  Well,
  View,
  Text,
  ActionButton,
  Picker,
  DialogTrigger,
  Dialog,
  Content,
  Header,
  repeat,
  Grid,
} from "@adobe/react-spectrum";

import HistogramIcon from "@spectrum-icons/workflow/Histogram";
import TextIcon from "@spectrum-icons/workflow/Text";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";
import MapIcon from "@spectrum-icons/workflow/MapView";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";
import traverse from "traverse";

export interface SectionEditorProps {
  editPath: string;
}

const IconForPaneType = (PaneType: string) => {
  switch (PaneType) {
    case "Histogram":
      return <HistogramIcon />;
    case "PieChart":
      return <PieChartIcon />;
    case "Text":
      return <TextIcon />;
    case "Map":
      return <MapIcon />;
    case "Scatterplot":
      return <ScatterIcon />;
  }
};

const AvaliablePanes = [
  {
    sectionTitle: "Visualizations",
    panes: [
      { name: "Map", label: "Map" },
      { name: "Histogram", label: "Histogram" },
      { name: "PieChart", label: "Pie Chart" },
      { name: "Text", label: "Text" },
      { name: "Scatterplot", label: "Scatter Plot" },
    ],
  },
];

interface NewPaneDialogProps {
  validatePaneName?: (name: string) => boolean;
  onAddPane: (name: string, paneType: String) => void;
}
const NewPaneDialog: React.FC<NewPaneDialogProps> = ({
  validatePaneName,
  onAddPane,
}) => {
  const [newPaneName, setNewPaneName] = useState("New Pane");
  const [errorText, setErrorText] = useState<string | null>(null);

  const attemptToAddPane = (paneType: string, close: () => void) => {
    if (newPaneName.length === 0) {
      setErrorText("Please provide a name");
    }
    if (validatePaneName) {
      if (validatePaneName(newPaneName)) {
        onAddPane(newPaneName, paneType);
        close();
      } else {
        setErrorText(
          "Another pane with the same name exists, pick something else"
        );
      }
    }
  };

  return (
    <DialogTrigger type="popover" isDismissable>
      <ActionButton isQuiet>Add</ActionButton>
      {(close: any) => (
        <Dialog>
          <Heading>Select pane to add</Heading>
          <Content>
            {AvaliablePanes.map((section) => (
              <>
                <Header marginY="size-100">{section.sectionTitle}</Header>
                <TextField
                  label="New pane name"
                  value={newPaneName}
                  onChange={setNewPaneName}
                  errorMessage={errorText}
                ></TextField>
                <Grid
                  columns={repeat(2, "1fr")}
                  columnGap={"size-50"}
                  rowGap={"size-50"}
                  autoRows="fit-content"
                  marginBottom="size-200"
                >
                  {section.panes.map((pane) => (
                    <ActionButton
                      onPress={() => {
                        attemptToAddPane(pane.name, close);
                      }}
                    >
                      {IconForPaneType(pane.name)}
                      <Text>{pane.label}</Text>
                    </ActionButton>
                  ))}
                </Grid>
              </>
            ))}
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

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

  const editPane = (index: number, paneType: string) => {
    dispatch(
      setCurrentEditPath({
        editPath: `${editPath}.panes.${index}.${paneType}`,
        editType: paneType,
      })
    );
  };

  const addPane = (paneName: string, paneType: string) => {
    dispatch(
      setSpecAtPath({
        editPath: editPath,
        update: {
          panes: [
            ...section.panes,
            { [paneType]: { ...PaneDefaults[paneType], name: paneName } },
          ],
        },
      })
    );
  };

  const validateName = (name: string) => {
    const existingNames = section.panes.map(
      (pane) => Object.values(pane)[0].name
    );
    return !existingNames.includes(name);
  };

  if (!section) {
    return <View>Failed to find section in specification</View>;
  }
  return (
    <Flex width="100%" height="100%" direction="column">
      <Well>
        <Heading>Details</Heading>
        <TextField
          label="Name"
          value={section.name}
          onChange={(name) => updateSection({ name })}
        />
        <Picker label="Layout">
          <Item key="Free">Free</Item>
        </Picker>
      </Well>
      <Well>
        <Heading>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text>Panes</Text>

            <NewPaneDialog
              onAddPane={addPane}
              validatePaneName={validateName}
            />
          </Flex>
        </Heading>
        <Flex gap={"size-125"} direction="column">
          {section.panes.map((pane, index) => {
            let [paneType, paneSpecs] = Object.entries(pane)[0];
            return (
              <ActionButton
                onPress={() => editPane(index, paneType)}
                key={paneSpecs.name}
                width="100%"
              >
                {IconForPaneType(paneType)}
                <Text>{paneSpecs.name}</Text>
              </ActionButton>
            );
          })}
        </Flex>
      </Well>
    </Flex>
  );
};
