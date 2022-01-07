import {
  DialogTrigger,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  TextField,
  TextArea,
  ButtonGroup,
  Button,
  Switch,
} from "@adobe/react-spectrum";
import { useState } from "react";

interface NewAppDialogProps {
  onSubmit: (newAppDetails: any) => void;
}

export const NewAppDialog: React.FC<NewAppDialogProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const submitResult = (close: () => void) => {
    onSubmit({ name, description, public: isPublic });
    close();
  };
  return (
    <DialogTrigger>
      <Button variant="cta">New App</Button>

      {(close) => (
        <Dialog>
          <Heading>Create New App</Heading>
          <Divider />
          <Content>
            <Form onSubmit={(stuff) => console.log("submitted stuff ", stuff)}>
              <TextField
                value={name}
                onChange={setName}
                label="Name"
                placeholder="Your awesome app name"
              />
              <TextArea
                value={description}
                onChange={setDescription}
                label="Description"
                placeholder="Describe your app here"
              />
              <Switch
                name="Public"
                isSelected={isPublic}
                onChange={setIsPublic}
              >
                Public
              </Switch>
            </Form>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button variant="cta" onPress={() => submitResult(close)}>
              Confirm
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
};
