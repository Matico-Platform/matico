import {
  ActionButton,
  Button,
  Content,
  Dialog,
  Text,
  Flex,
  DialogTrigger,
  Heading,
  Switch,
  TextField,
  View,
} from "@adobe/react-spectrum";
import React, { useState } from "react";
import { NewAppArgs, Template } from "../TemplateSelector/TemplatesSelector";
import Image from "next/image";

export const NewMapModal: React.FC<{
  template: Template;
  onSelectTemplate: (args: NewAppArgs) => void;
}> = ({ template, onSelectTemplate }) => {
  const [name, setName] = useState("New App");
  const [description, setDescription] = useState("Amazing new geospatial app");
  const [isPublic, setIsPublic] = useState(false);

  const createApp = (close: () => void) => {
    onSelectTemplate({
      template: template.templateSlug,
      name,
      description,
      public: isPublic,
    });
    close();
  };

  return (
    <DialogTrigger isDismissable={true}>
      <ActionButton
        width={300}
        height={300}
        UNSAFE_style={{ backgroundColor: "transparent" }}
      >
        <Flex direction="column" alignItems="center" gap="size-200">
          <View flex={1}>
            <Image src={`/${template.image}`} width={300} height={221} />
          </View>
          <Text>{template.title}</Text>
        </Flex>
      </ActionButton>
      {(close) => (
        <Dialog>
          <Heading>Create new dataset</Heading>
          <Content>
            <Flex direction="column" gap="size-200">
              <TextField
                value={name}
                width={"100%"}
                onChange={(name) => setName(name)}
                label="App Name"
              />
              <TextField
                value={description}
                width={"100%"}
                onChange={(description) => setDescription(description)}
                label="App Description"
              />
              <Switch
                isSelected={isPublic}
                width={"100%"}
                onChange={() => setIsPublic(!isPublic)}
              >
                Public
              </Switch>
              <Button
                type="submit"
                variant="cta"
                width={"100%"}
                onPress={() => createApp(close)}
              >
                Create New App
              </Button>
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};
