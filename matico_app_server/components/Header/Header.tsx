import { ActionButton, Button, Flex, Text, View } from "@adobe/react-spectrum";
import { useSession } from "next-auth/react";
import { Login } from "../Login/Login";
import Add from "@spectrum-icons/workflow/Add";
import Link from "next/link";
import { useApps } from "../../hooks/useApps";
export const Header: React.FC<{
  createNewApp?: (template: string) => void;
}> = ({ createNewApp }) => {
  const { data: session } = useSession();

  return (
    <View
      paddingY="size-200"
      width="100%"
      maxWidth="90vw"
      marginX="auto"
      gridArea={"header"}
      minHeight="size-500"
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Flex direction="row" gap="size-150" alignItems="center">
          <img src="/logo.png" alt="Matico" width="32px" height="32px" />
          <Text
            UNSAFE_style={{
              fontSize: "2em",
              fontWeight: "bold",
            }}
          >
            Matico
          </Text>
          <View marginStart="size-450" marginTop="size-50"></View>
        </Flex>
        <Flex
          direction="row"
          gap="size-450"
          alignItems="center"
          justifySelf="flex-end"
        >
          {(!!session && !!createNewApp) && (
            <ActionButton
              isQuiet
              onPress={() => {
                createNewApp('BigMap')
              }}
              UNSAFE_style={{
                cursor: "pointer",
              }}
            >
              <Add />
              Start a New App
            </ActionButton>
          )}
          <Login />
          <Link
            href="https://matico.app"
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <a target={"_blank"} rel="noopener noreferrer">
              Docs
            </a>
          </Link>
          <Link
            href="https://github.com/matico-Platform/matico"
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <a target={"_blank"} rel="noopener noreferrer">
              Github
            </a>
          </Link>
        </Flex>
      </Flex>
    </View>
  );
};
