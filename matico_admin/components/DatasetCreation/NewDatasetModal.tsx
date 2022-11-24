import React, { useCallback, useState } from "react";

import {
  Tabs,
  Item,
  TabList,
  TabPanels,
  Content,
  DialogTrigger,
  ActionButton,
  Button,
  Dialog,
  ButtonGroup,
} from "@adobe/react-spectrum";
import { NewSyncDatasetForm } from "./NewSyncDatasetForm";
import { NewUploadDatasetForm } from "./NewUploadDatasetForm";

export interface NewDatasetModalProps {}

export const NewDatasetModal: React.FC<NewDatasetModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: on-done notification in this component
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="cta">New Dataset</Button>
      <Dialog width="80vw" height="60vh">
        <Content>
          <Tabs height="100%">
            <TabList>
              <Item key="upload">Upload</Item>
              <Item key="sync">Sync</Item>
            </TabList>
            <TabPanels width="100%" height="100%">
              <Item key="upload">
                <NewUploadDatasetForm />
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
