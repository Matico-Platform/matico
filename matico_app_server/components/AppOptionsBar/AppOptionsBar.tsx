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
  Divider,
} from "@adobe/react-spectrum";
import Link from "next/link";
import { App } from "@prisma/client";
import { CollaboratorsEditor } from "../CollaboratorsEditor/CollaboratorsEditor";
import React from "react";

export interface AppOptionsBarInterface {
  app: App & { _count: { collaborators: number } };
  onPublicUpdate?: (isPublic: boolean) => void;
  children?: React.ReactNode;
}
export const AppOptionsBar: React.FC<AppOptionsBarInterface> = ({
  app,
  onPublicUpdate,
  children,
}) => {
  const togglePublic = () => {
    onPublicUpdate && onPublicUpdate(!app.public);
  };

  return (
    <View
      paddingX="size-300"
      paddingY="size-50"
      borderBottomColor={"static-white"}
      borderBottomWidth="thin"
    >
      <Flex width="100%" direction="row" alignItems="center">
        <View flex={1}>
          <Link href="/">
            <a style={{ fontWeight: "bold", color: "white" }}>
              <Text>Matico</Text>
            </a>
          </Link>
        </View>

        <Flex flex={1} justifyContent="center">
          <Text
            UNSAFE_style={{
              fontWeight: "bold",
              color: "var(--spectrum-alias-icon-color-selected-focus)",
            }}
          >
            {app.name}
          </Text>
        </Flex>
          {children}
          {!!onPublicUpdate && !!app && (
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
                <ActionButton>
                  Collaborators: {app._count.collaborators}
                </ActionButton>
                <Dialog>
                  <Heading>Manage Collaborators</Heading>
                  <Divider />
                  <Content>
                    <CollaboratorsEditor app={app} />
                  </Content>
                </Dialog>
              </DialogTrigger>

        </Flex>
          )}
      </Flex>
    </View>
  );
};
