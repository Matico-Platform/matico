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

interface NewApiDialogProps {
  onSubmit: (newApiDetails: any) => void;
}

export const NewApiDialog: React.FC<NewApiDialogProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");

  const submitResult = (close: () => void) => {
    onSubmit({ name, description, public: isPublic });
    close();
  };

  return (
    <DialogTrigger>
      <Button variant="cta">New Api</Button>

      {(close) => (
        <Dialog>
          <Heading>Create New Api</Heading>
          <Divider />
          <Content>
            <Form>
              <TextField
                value={name}
                onChange={setName}
                label="Name"
                placeholder="Your awesome api name"
              />
              <TextArea
                value={description}
                onChange={setDescription}
                label="Description"
                placeholder="Describe your api here"
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
