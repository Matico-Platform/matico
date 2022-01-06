import React, { useCallback, useState } from "react";

import {
  Tabs,
  Item,
  TabList,
  TabPanels,
  Content,
  DialogTrigger,
  ActionButton,
  Dialog,
  ButtonGroup,
} from "@adobe/react-spectrum";
import {NewSyncDatasetForm} from "./NewSyncDatasetForm";
import {NewUploadDatasetForm} from "./NewUploadDatasetForm";

export interface NewDatasetModalProps {}

export const NewDatasetModal: React.FC<NewDatasetModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <ActionButton>New Dataset</ActionButton>
      <Dialog width="80vw" height="60vh">
        <Content>
          <Tabs height="100%">
            <TabList>
              <Item key="upload">Upload</Item>
              <Item key="sync">Sync</Item>
            </TabList>
            <TabPanels width="100%" height="100%">
              <Item key="upload">
                <NewUploadDatasetForm/>
              </Item>
              <Item key="sync">
                <NewSyncDatasetForm />
              </Item>
            </TabPanels>
          </Tabs>
        </Content>
        <ButtonGroup>
          <ActionButton onPress={() => setIsOpen(false)}>Cancel</ActionButton>
        </ButtonGroup>
      </Dialog>
    </DialogTrigger>
  );
};
