import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Text,
} from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import React, { useState } from "react";
import {useSWRConfig} from "swr";

export const DeleteAppDialog: React.FC<{ appId: string }> = ({ appId }) => {
  const [error, setError] = useState<string | null>(null);
  const {mutate } = useSWRConfig()
  const deleteDataset = () => {
    fetch(`/api/apps/${appId}`, { method: "DELETE" })
      .then(() => {
        mutate('/api/apps')
        close();
      })
      .catch((e) => {
        setError(e.error);
      });
  };
  return (
    <DialogTrigger>
      <ActionButton>
        <Delete /> Delete
      </ActionButton>
      {(close) => (
        <Dialog>
          <Content>
            <Text>Are you sure you want to delete this app?</Text>
            {error &&
              <Text>{error}</Text>
            }
          </Content>
            <ButtonGroup>
              <Button onPress={deleteDataset} variant={"primary"}>
                Yes
              </Button>
              <Button onPress={close} variant={"negative"}>
                Cancel
              </Button>
            </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
};
