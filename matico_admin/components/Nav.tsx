import React from "react";
import {
  Text,
  Flex,
  View,
  Menu,
  Tabs,
  ActionButton,
  MenuTrigger,
  Item,
  TabPanels,
  TabList,
} from "@adobe/react-spectrum";
import { Link as ALink } from "@adobe/react-spectrum";
import Link from "next/link";
import { useUser } from "../hooks/useUser";

export const Nav: React.FC = () => {
  const { user, login, signup, loginError, signout, signupError } = useUser();

  const attemptLogin = () => {
    login("stuart.lynn@gmail.com", "password");
  };

  return (
    <Flex
      gridArea="header"
      direction="row"
      justifyContent={"left"}
      gap="size-550"
      alignItems="center"
      marginX="size-550"
    >
      <ALink>
        <Link href="/apps">Apps</Link>
      </ALink>
      <ALink>
        <Link href="/datasets">Datasets</Link>
      </ALink>
      <ALink>
        <Link href="/apis">Apis</Link>
      </ALink>
      <ALink>
        <Link href="/admin">Admin</Link>
      </ALink>

      <View justifySelf="right">
        {user ? (
          <MenuTrigger>
            <ActionButton>{user.username}</ActionButton>
            <Menu minWidth='size-2400'>
              <Item >
                <ActionButton>Profile</ActionButton>
              </Item>
              <Item >
                <ActionButton onPress={signout}>Logout</ActionButton>
              </Item>
            </Menu>
          </MenuTrigger>
        ) : (
          <MenuTrigger>
            <ActionButton>Login / Signup</ActionButton>
            <Menu>
              <Item>
                <Tabs>
                  <TabList>
                    <Item key="login">Login</Item>
                    <Item key="signup">Signup</Item>
                  </TabList>
                  <TabPanels>
                    <Item key="login">
                      <ActionButton onPress={attemptLogin}>Login</ActionButton>
                    </Item>
                    <Item key="signup">
                      <ActionButton>signup</ActionButton>
                    </Item>
                  </TabPanels>
                </Tabs>
              </Item>
            </Menu>
          </MenuTrigger>
        )}
      </View>
    </Flex>
  );
};
