import React, { useEffect } from "react";
import { Box, Tab, Tabs } from "grommet";
import { MaticoDatasetsViewer } from "./MaticoDatasetsViewer";
import { MaticoRawSpecEditor } from "./MaticoRawSpecEditor";
import { MaticoStateViewer } from "./MaticoStateViewer";
import { useMaticoDispatch } from "../../Hooks/redux";
import { setEditing } from "../../Stores/MaticoSpecSlice";

export const MaticoEditor: React.FC<{ editActive: boolean }> = ({
  editActive,
}) => {
  const dispatch = useMaticoDispatch();

  useEffect(() => {
    dispatch(setEditing(editActive));
  }, [editActive]);

  return (
    <Box fill>
      <Tabs flex>
        <Tab title="Spec">
          <MaticoRawSpecEditor />
        </Tab>
        <Tab title="State">
          <MaticoStateViewer />
        </Tab>
        <Tab title="Datasets">
          <MaticoDatasetsViewer />
        </Tab>
      </Tabs>
    </Box>
  );
};
