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
import { NewUploadDatasetForm } from "./NewUploadDatasetForm";
import {Dataset} from "@prisma/client";

export interface NewDatasetModalProps {
  onSubmit: (dataset : Dataset & {dataUrl:string})=>void
}

export const NewDatasetModal: React.FC<NewDatasetModalProps> = ({onSubmit}) => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: on-done notification in this component
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="cta">New Dataset</Button>
      <Dialog width="80vw" height="60vh">
        <Content>
          <NewUploadDatasetForm onSubmit={(dataset)=> {
            setIsOpen(false)
            onSubmit(dataset)
          }}/>
        </Content>
        <ButtonGroup>
          <ActionButton onPress={() => setIsOpen(false)}>Cancel</ActionButton>
        </ButtonGroup>
      </Dialog>
    </DialogTrigger>
  );
};
