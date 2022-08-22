import {
  ActionButton,
  Button,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
  Heading,
  Text,
  View,
} from "@adobe/react-spectrum";
import { useSession } from "next-auth/react";
import { Login } from "../Login/Login";
import Add from "@spectrum-icons/workflow/Add";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useApps } from "../../hooks/useApps";
import ShowMenu from "@spectrum-icons/workflow/ShowMenu";
import React from "react";

const MobileWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DialogTrigger type="tray" isDismissable>
      <ActionButton isQuiet>
        <ShowMenu size="L" />
      </ActionButton>
      <Dialog size="L" UNSAFE_style={{ height: "100vh" }}>
        <Heading>Matico</Heading>
        <Content>
          <Text>Your platform for geospatial data &amp; analysis.</Text>
          {children}
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};

export const Header: React.FC<{
  createNewApp?: (template: string) => void;
}> = ({ createNewApp }) => {
  const { data: session } = useSession();
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const Wrapper = isMobile ? MobileWrapper : React.Fragment;
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
        <Wrapper>
          <Flex
            direction={isMobile ? "column" : "row"}
            gap="size-450"
            alignItems="center"
            justifySelf="flex-end"
            UNSAFE_style={{}}
          >
            {!!session && !!createNewApp && (
              <ActionButton
                isQuiet
                onPress={() => {
                  createNewApp("BigMap");
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
              <a
                target={"_blank"}
                rel="noopener noreferrer"
                style={{ color: "white" }}
              >
                Docs
              </a>
            </Link>
            <Link
              href="https://github.com/matico-Platform/matico"
              target={"_blank"}
              rel="noopener noreferrer"
            >
              <a
                target={"_blank"}
                rel="noopener noreferrer"
                style={{ color: "white" }}
              >
                Github
              </a>
            </Link>
          </Flex>
        </Wrapper>
      </Flex>
    </View>
  );
};
