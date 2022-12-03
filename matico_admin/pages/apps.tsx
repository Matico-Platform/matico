import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import {
  Divider,
  View,
  Content,
  Heading,
  Header,
  Flex,
  Text,
} from "@adobe/react-spectrum";
import { useApps } from "../hooks/useApps";
import { Link as ALink, ActionButton } from "@adobe/react-spectrum";
import Link from "next/link";
import Edit from "@spectrum-icons/workflow/Edit";
import Preview from "@spectrum-icons/workflow/Preview";
import { App as AppSpec } from "@maticoapp/matico_types/spec";

import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { useState } from "react";
import { NewAppDialog } from "../components/NewAppDialog";
import { useRouter } from "next/router";

const Apps: NextPage<{ appsInitial: Array<any> }> = () => {
  const { apps, error, createApp } = useApps();
  const router = useRouter();

  const submit = (details: {
    name: string;
    description: string;
    public: boolean;
  }) => {
    const initalSpec = {
      panes: [],
      pages: [],
      datasets: [],
      datasetTransforms: [],
      theme: {
        primaryColor: { hex: "#FF0000" },
        secondaryColor: { hex: "#FF0000" },
        logoUrl: null,
      },
      metadata: {
        name: details.name,
        createdAt: new Date().toISOString(),
        description: details.description,
      },
    } as AppSpec;

    createApp({
      name: details.name,
      description: details.description,
      public: details.public,
      spec: initalSpec,
    });
  };

  return (
    <Layout hasSidebar={true}>
      <View backgroundColor="gray-200" padding="size-100" gridArea="sidebar">
        <Heading>Apps</Heading>
        <Content>
          <Text>
            These are your apps, they are full blown applications that you can
            build using a GUI
          </Text>
        </Content>
      </View>
      <View gridArea="content" padding="size-800">
        <Header>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading>Apps</Heading>

            <NewAppDialog
              onSubmit={(data) => {
                submit(data);
              }}
            />
          </Flex>
        </Header>
        <Divider size="S" />
        {apps && (
          <TableView
            aria-label="Example table with static contents"
            selectionMode="multiple"
            marginY="size-40"
          >
            <TableHeader>
              <Column>Name</Column>
              <Column>Access</Column>
              <Column align="center">Actions</Column>
            </TableHeader>
            <TableBody>
              {apps.map((app: any, index: number) => (
                <Row key={index}>
                  <Cell>
                    <ALink>
                      <Link href={`/apps/edit/${app.id}`}>{app.name}</Link>
                    </ALink>
                  </Cell>
                  <Cell>{app.public ? "Public" : "Private"}</Cell>
                  <Cell>
                    <ActionButton
                      isQuiet={true}
                      onPress={() => router.push(`/apps/${app.id}`)}
                    >
                      <Preview size="S" />
                    </ActionButton>
                    <ActionButton
                      isQuiet={true}
                      onPress={() => router.push(`/apps/edit/${app.id}`)}
                    >
                      <Edit size="S" />
                    </ActionButton>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>
    </Layout>
  );
};

export default Apps;
