import type { NextPage } from "next";
import { Layout } from "../components/Layout";

import {
  Flex,
  Heading,
  View,
  Text,
  ListBox,
  Item,
} from "@adobe/react-spectrum";
import { LoginSignupDialog } from "../components/LoginSignUpDialog";
import { useUser } from "../hooks/useUser";

const Home: NextPage = () => {
  const { user } = useUser();

  return (
    <Layout hasSidebar={false}>
      <Flex
        width="100%"
        height="100%"
        gridArea="content"
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={"size-400"}
      >
        <Heading level={1}>Welcome to Matico</Heading>
        <View width="50vw">
          <img alt="splash" src={"/main_bg.png"} width={"100%"} />
        </View>
        <Text>
          Matico is a tool to help you easily curate, share and analyse datasets
          and build apis and apps.
        </Text>

        {!user && (
          <>
            <LoginSignupDialog popover={false} />
          </>
        )}
      </Flex>
    </Layout>
  );
};

export default Home;
