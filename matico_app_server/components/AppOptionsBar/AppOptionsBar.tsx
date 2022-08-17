import {
  View,
  Flex,
  Text,
  TooltipTrigger,
  Tooltip,
  DialogTrigger,
  ActionButton,
  Dialog,
  Content,
  Heading,
  Switch,
} from "@adobe/react-spectrum";
import { App } from "@prisma/client";

export interface AppOptionsBarInterface {
  app: App;
  onPublicUpdate: (isPublic: boolean) => void;
}
export const AppOptionsBar: React.FC<AppOptionsBarInterface> = ({
  app,
  onPublicUpdate,
}) => {
  const togglePublic = () => {
    onPublicUpdate(!app.public);
  };

  return (
    <View paddingX="size-300" paddingY="size-50">
      <Flex width="100%" direction="row" alignItems="center">
        <Text flex={1}>Matico</Text>
        <Flex flex={1} justifyContent="center">
          <Text>{app.name}</Text>
        </Flex>
        <Flex justifyContent="end" flex={1} direction="row" gap="size-200">
          <TooltipTrigger delay={0}>
            <Switch
              isEmphasized
              isSelected={app.public}
              onChange={() => togglePublic()}
            >
              {app.public ? "Public" : "Private"}
            </Switch>
            <Tooltip>{app.public ? "Make Private" : "Make Public"}</Tooltip>
          </TooltipTrigger>
          <DialogTrigger isDismissable={true}>
            <ActionButton>Colaborators</ActionButton>
            <Dialog>
              <Heading>Manage Colaborators</Heading>
              <Content>
                  <h1>Access your cloaboratrs</h1>
              </Content>
            </Dialog>
          </DialogTrigger>
        </Flex>
      </Flex>
    </View>
  );
};
