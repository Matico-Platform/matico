import type { GetServerSideProps, NextPage } from "next";
import {
  Divider,
  Flex,
  Grid,
  View,
  ActionButton,
  Text,
  Heading,
  TextField,
  Content,
} from "@adobe/react-spectrum";
import { getSession } from "next-auth/react";
import { PrismaClient, App, User } from "@prisma/client";
import { AppCard } from "../components/AppCard/AppCard";
import { StandardLayout } from "../components/StandardLayout/StandardLayout";
import { useRouter } from "next/router";
import { useApps, UseAppsArgs } from "../hooks/useApps";
import { TemplateSelector } from "../components/TemplateSelector/TemplatesSelector";
import { userFromSession } from "../utils/db";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Header } from "../components/Header/Header";
import styled from "styled-components";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const session = await getSession(context);

  const user = await userFromSession(session, prisma);

  const recentApps = await prisma.app.findMany({
    where: {
      public: true,
    },
    include: { owner: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userApps = user
    ? await prisma.app.findMany({
        where: {
          ownerId: user.id,
        },
        include: { owner: true },
        orderBy: {
          createdAt: "desc",
        },
      })
    : null;

  console.log("user apps are ", userApps);

  return {
    props: {
      initalRecentApps: JSON.parse(JSON.stringify(recentApps)),
      initalUserApps: JSON.parse(JSON.stringify(userApps)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};

interface HomePageProps {
  initalRecentApps: Array<App>;
  user?: User;
  initalUserApps?: Array<App>;
}

const AppsTable = styled.table`
  margin: 2em 0;
  border-collapse: collapse;
  th {
    text-align: left;
  }
  td {
    border-bottom:1px solid white;
  }
`

const Home: React.FC<HomePageProps> = ({
  user,
  initalRecentApps,
  initalUserApps,
}) => {
  const router = useRouter();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const { notify, NotificationElement } = useNotifications();

  const { apps: recentApps } = useApps(
    { public: true, order: "updatedAt" },
    initalRecentApps
  );

  let userAppParams: UseAppsArgs = {
    ownerId: user?.id,
    order: "updatedAt",
  };

  if (userSearchTerm.length) {
    userAppParams.search = userSearchTerm;
  }

  const { apps: userApps, createAppFromTemplate } = useApps(
    userAppParams,
    initalUserApps
  );

  console.log("userApps ", userApps, initalUserApps);

  const createNewApp = (template: string) => {
    createAppFromTemplate(template).then((app) => {
      if (app?.error) {
        notify(app.error);
      } else {
        router.push(`/apps/edit/${app.id}`);
      }
    });
  };

  return (
    <Content minHeight={"100vh"}>
      <Header />
      <Flex direction="column" gridArea="content" maxWidth="90vw" marginX="auto">
        <TemplateSelector onSelectTemplate={createNewApp} recentApps={recentApps || initalRecentApps} />
        {userApps && (
          <Flex id="Your Apps" direction="column">
            <Heading>Your Apps</Heading>
            <TextField
              value={userSearchTerm}
              label="search"
              onChange={setUserSearchTerm}
            />
            <AppsTable>
              <tr>
                <th>App Name</th>
                <th>Author</th>
                <th>Last Modified</th>
                <th></th>
              </tr>
            {(userApps || initalUserApps).map((userApp: App) => (
              <AppCard
                key={userApp.id}
                app={userApp}
                includeEdit
                includeFork
                includeView
              />
            ))}
            </AppsTable>
          </Flex>
        )}
      </Flex>
    </Content>
    //   <Flex direction="column" gridArea="toc">
    //     <Header>Recent popular apps</Header>
    //     <Flex direction="column" flex={1}>
    //       {(recentApps ?? initalRecentApps).map((app: App) => (
    //         <AppCard key={app.id} app={app} />
    //       ))}
    //     </Flex>
    //   </Flex>
    //   <NotificationElement />
    // </StandardLayout>
  );
};

export default Home;
