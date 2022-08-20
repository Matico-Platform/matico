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
import Link from "next/link";
import { App, Collaborator } from "@prisma/client";
import {CollaboratorsEditor} from "../CollaboratorsEditor/CollaboratorsEditor";

export interface AppOptionsBarInterface {
  app: App & {_count: {Collaborators:number}};
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
    <View paddingX="size-300" paddingY="size-50" borderBottomColor={"static-white"} borderBottomWidth="thin">
      <Flex width="100%" direction="row" alignItems="center">
        <View flex={1}>
          <Link href="/">
            <a style={{fontWeight:'bold', color:"white"}}>
              <Text>Matico</Text>
            </a>
          </Link>
        </View>

        <Flex flex={1} justifyContent="center">
          <Text UNSAFE_style={{fontWeight:"bold", color:"var(--spectrum-alias-icon-color-selected-focus)"}}>{app.name}</Text>
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
            <ActionButton>Collaborators: {app._count.Collaborators}</ActionButton>
            <Dialog>
              <Heading>Manage Collaborators</Heading>
              <Content>
                <CollaboratorsEditor app={app} />
              </Content>
            </Dialog>
          </DialogTrigger>
        </Flex>
      </Flex>
    </View>
  );
};
