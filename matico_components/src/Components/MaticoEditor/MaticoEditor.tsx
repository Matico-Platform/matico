import React, { useEffect, useState } from "react";
import { MaticoRawSpecEditor } from "./Panes/MaticoRawSpecEditor";
import { MaticoStateViewer } from "./Panes/MaticoStateViewer";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { setEditing } from "../../Stores/MaticoSpecSlice";
import { Editors } from "./Editors";
import { DatasetsEditor } from "./Panes/DatasetsEditor";
import { BreadCrumbs } from "./Utils/BreadCrumbs";
import { Dashboard } from "@maticoapp/matico_spec";
import { DatasetProvider } from "Datasets/DatasetProvider";
import {
  Tabs,
  TabList,
  Item,
  TabPanels,
  View,
  Flex,
} from "@adobe/react-spectrum";
import { AppEditor } from "./Panes/AppEditor";

export interface MaticoEditorProps {
  editActive: boolean;
  onSpecChange?: (dashboard: Dashboard) => void;
  datasetProviders?: Array<DatasetProvider>;
}

export const MaticoEditor: React.FC<MaticoEditorProps> = ({
  editActive,
  onSpecChange,
  datasetProviders,
}) => {
  const dispatch = useMaticoDispatch();

  // eg
  // spec
  // pages.0.sections.0.panes.1.Map
  // Map
  const { spec, currentEditPath, currentEditType } = useMaticoSelector(
    (state) => state.spec
  );
  console.log("currentEditPath ", currentEditPath);
  const [tabKey, setTabKey] = useState<string>("Components");

  useEffect(() => {
    if (spec) {
      localStorage.setItem("code", JSON.stringify(spec));
    }
    if (onSpecChange) {
      onSpecChange(spec);
    }
  }, [JSON.stringify(spec)]);

  useEffect(() => {
    dispatch(setEditing(editActive));
  }, [editActive]);

  const EditPane = currentEditPath ? Editors[currentEditType] : AppEditor;
  console.log("edit pane ", EditPane);

  if (!editActive) return null;

  const height = {
    L: "95vh",
    M: "95vh",
    S: "35vh",
    base: "35vh",
  };

  return (
    <Tabs selectedKey={tabKey} onSelectionChange={setTabKey}>
      <TabList>
        <Item key="Components">Components</Item>
        <Item key="Datasets">Datasets</Item>
        <Item key="Specification">Specification</Item>
        <Item key="State">State</Item>
      </TabList>
      <View overflow={"hidden auto"} height={height}>
        <TabPanels>
          <Item key="Components">
            <Flex height="100%" width="100%" direction="column">
              <BreadCrumbs editPath={currentEditPath} />
              <View flex="1">
                <EditPane editPath={currentEditPath} />
              </View>
            </Flex>
          </Item>
          <Item key="Datasets">
            <DatasetsEditor datasetProviders={datasetProviders} />
          </Item>
          <Item key="Specification">
            <MaticoRawSpecEditor />
          </Item>
          <Item key="State">
            <MaticoStateViewer />
          </Item>
        </TabPanels>
      </View>
    </Tabs>
  );
};
