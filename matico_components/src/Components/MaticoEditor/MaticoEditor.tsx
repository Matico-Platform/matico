import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "grommet";
import { MaticoDatasetsViewer } from "./MaticoDatasetsViewer";
import { MaticoRawSpecEditor } from "./MaticoRawSpecEditor";
import { MaticoStateViewer } from "./MaticoStateViewer";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { setEditing } from "../../Stores/MaticoSpecSlice";
import { Editors} from "./Editors";

export const MaticoEditor: React.FC<{ editActive: boolean }> = ({
  editActive,
}) => {
  const dispatch = useMaticoDispatch();
  const { spec, currentEditPath, currentEditType } = useMaticoSelector(
    (state) => state.spec
  );
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("code", JSON.stringify(spec));
  }, [JSON.stringify(spec)]);

  useEffect(() => {
    dispatch(setEditing(editActive));
  }, [editActive]);

  useEffect(() => {
    if(currentEditPath){
    setTabIndex(3);
    }
    else{
      setTabIndex(1)
    }
  }, [currentEditPath]);

  const EditPane = Editors[currentEditType]

  return (
    <Box fill>
      <Tabs activeIndex={tabIndex} onActive={setTabIndex} flex>
        <Tab title="Spec">
          <MaticoRawSpecEditor />
        </Tab>
        <Tab title="State">
          <MaticoStateViewer />
        </Tab>
        <Tab title="Datasets">
          <MaticoDatasetsViewer />
        </Tab>
        {currentEditPath && (
          <Tab title={`Edit ${currentEditType}`}>
            <EditPane editPath={currentEditPath} />
          </Tab>
        )}
      </Tabs>
    </Box>
  );
};
