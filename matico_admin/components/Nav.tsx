import React from "react";
import { useRouter } from "next/router";
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
  Button,
} from "@adobe/react-spectrum";
import { Link as ALink } from "@adobe/react-spectrum";
import { LoginSignupDialog } from "./LoginSignUpDialog";
import Link from "next/link";
import { useUser } from "../hooks/useUser";

export const Nav: React.FC = () => {
  const { user, signout } = useUser();
  const router = useRouter()
  return (
    <Flex
      gridArea="header"
      direction="row"
      justifyContent={"left"}
      gap="size-550"
      alignItems="center"
      marginX="size-550"
    >
      <Tabs isQuiet={true} selectedKey={router.route}>
        <TabList>
          <Item key="/apps">
          <ALink>
            <Link href="/apps">Apps</Link>
          </ALink>
        </Item>
        <Item key = "/datasets">
          <ALink>
            <Link href="/datasets">Datasets</Link>
          </ALink>
        </Item>
        <Item key="/apis">
          <ALink>
            <Link href="/apis">Apis</Link>
          </ALink>
        </Item>
        <Item key="/admin">
          <ALink>
            <Link href="/admin">Admin</Link>
          </ALink>
        </Item>
      </TabList>
    </Tabs>

      <div style={{flex:1}} />

      <View justifySelf="end">
        {user ? (
          <MenuTrigger>
            <ActionButton>{user.username}</ActionButton>
            <Menu minWidth="size-2400">
              <Item>Profile</Item>
              <Item>
                <Button variant="primary" isQuiet onPress={signout}>Logout</Button>
              </Item>
            </Menu>
          </MenuTrigger>
        ) : (
          <LoginSignupDialog />
        )}
      </View>
    </Flex>
  );
};
