import { useState } from "react";
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
  Button,
} from "@adobe/react-spectrum";
import { getSession, useSession } from "next-auth/react";
import { App, User } from "@prisma/client";
import { AppCard } from "../components/AppCard/AppCard";
import { StandardLayout } from "../components/StandardLayout/StandardLayout";
import { useRouter } from "next/router";
import { useApps, UseAppsArgs } from "../hooks/useApps";
import { TemplateSelector } from "../components/TemplateSelector/TemplatesSelector";
import { userFromSession } from "../utils/db";
import { useNotifications } from "../hooks/useNotifications";
import { Header } from "../components/Header/Header";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

import { prisma } from "../db";
import { Login } from "../components/Login/Login";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  let user = null;
  if (session) {
    user = await userFromSession(session, prisma);
  }

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
      user: user ? JSON.parse(JSON.stringify(user)) : null,
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
    border-bottom: 1px solid white;
  }
`;

const TextStyles = styled.span`
  h1 {
    font-size: 9vw;
    line-height: 1;
    @media (max-width: 1440px) {
      font-size: 8rem;
    }
    @media (max-width: 1024px) {
      font-size: 6rem;
    }
    @media (max-width: 768px) {
      font-size: 4rem;
    }
    @media (max-width: 500px) {
      font-size: 3.5rem;
    }
  }
`;
// const HeroImgOuter = styled.div`
//   position: absolute;
//   max-width: 50vw;
//   max-height: 50vh;
//   top: 35%;
//   right: 0;
// `;

// const HeroImg = styled.div`
//   position: relative;
//   img {
//     width: 100%;

//     filter: contrast(2.16) grayscale(0.83) hue-rotate(237deg) invert(0.37)
//       saturate(0.62);
//   }

//   :after {
//     position: absolute;
//     content: "";
//     display: block;
//     top: 0;
//     left: 0;
//     height: 100%;
//     width: 100%;

//     background: linear-gradient(
//       to left,
//       rgba(0, 0, 0, 0.4) 0%,
//       rgba(255, 255, 255, 0.4) 100%
//     );

//     mix-blend-mode: multiply;
//   }
// `;
const Home: React.FC<HomePageProps> = ({
  user,
  initalRecentApps,
  initalUserApps,
}) => {
  const router = useRouter();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const { notify, NotificationElement } = useNotifications();
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const { apps: recentApps } = useApps(
    { public: true, order: "updatedAt" },
    initalRecentApps
  );
  const { data: session } = useSession();

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
    <Content
      minHeight={"100vh"}
      maxHeight={session ? undefined : "100vh"}
      UNSAFE_style={{
        width: "100%",
        height: "100%",
        background: session
          ? "linear-gradient(to top left, #793169, #282848)"
          : "linear-gradient(to top left, #282848, #793169)",
        transition: "250ms background",
        overflow: session ? undefined : "hidden",
      }}
    >
      <Header createNewApp={createNewApp} />
      {session ? (
        <>
          <Flex
            direction="column"
            gridArea="content"
            maxWidth="90vw"
            marginX="auto"
          >
            <TemplateSelector
              onSelectTemplate={createNewApp}
              recentApps={recentApps || initalRecentApps}
            />
            {userApps && (
              <Flex id="Your Apps" direction="column">
                <Heading>
                  <Flex
                    direction={"row"}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text>Your Apps</Text>
                    <TextField
                      labelPosition="side"
                      value={userSearchTerm}
                      label="search"
                      onChange={setUserSearchTerm}
                    />
                  </Flex>
                </Heading>
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
                      includeDelete
                    />
                  ))}
                </AppsTable>
              </Flex>
            )}
          </Flex>
        </>
      ) : (
        <>
          <Flex
            direction="column"
            gridArea="content"
            maxWidth="90vw"
            marginX="auto"
            height="100vh"
          >
            <TextStyles>
              <Heading level={1}>
                Your platform for geospatial data &amp; analysis.
              </Heading>
              <Flex
                direction={isMobile ? "column" : "row"}
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Heading level={2} UNSAFE_style={{paddingRight:'2em'}}>
                  Communicate insights. Manage data. All without a line of code.
                </Heading>
                <Flex
                  direction="row"
                  gap="size-450"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Login />
                  <Link
                    href="http://matico.app"
                    target={"_blank"}
                    rel="noopener noreferrer"
                  >
                      <a style={{color:'white'}}>Learn More</a>
                  </Link>
                </Flex>
              </Flex>
            </TextStyles>
          </Flex>
        </>
      )}
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
