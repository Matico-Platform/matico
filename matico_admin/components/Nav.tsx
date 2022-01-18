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
import { ProfileDiaglog } from "./ProfileDialog";

export const Nav: React.FC = () => {
  const { user, logout } = useUser();
  const router = useRouter();

  const loggedInTabs = [
    { name: "/apps", id: "Apps" },
    { name: "/datasets", id: "Datasets" },
    { name: "/apis", id: "Apis" },
    { name: "/admin", id: "Admin" },
  ];

  const tabs = [{ name: "/", id: "Matico" }];

  return (
    <Flex
      gridArea="header"
      direction="row"
      justifyContent={"left"}
      gap="size-550"
      alignItems="center"
      marginX="size-550"
    >
      <Tabs
        isQuiet={true}
        selectedKey={router.route}
        items={user ? [...tabs, ...loggedInTabs] : tabs}
      >
        <TabList>
          {(item: any) => (
            <Item key={item.name}>
              <ALink>
                <Link href={item.name}>{item.id}</Link>
              </ALink>
            </Item>
          )}
        </TabList>
      </Tabs>

      <div style={{ flex: 1 }} />

      {user && (
        <View justifySelf="end">
          <ProfileDiaglog
            username={user.username}
            popover={true}
            onLogout={logout}
          />
        </View>
      )}
    </Flex>
  );
};
