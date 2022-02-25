import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import {
  Divider,
  View,
  Content,
  Heading,
  Header,
  Flex,
  Text
} from "@adobe/react-spectrum";
import { useApis } from "../hooks/useApis";
import { Link as ALink, ActionButton } from "@adobe/react-spectrum";
import Link from "next/link";
import Edit from "@spectrum-icons/workflow/Edit";
import Preview from "@spectrum-icons/workflow/Preview";

import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { useState } from "react";
import { NewApiDialog } from "../components/NewApiDialog";

const ApisPage: NextPage<{ apisInitial: Array<any> }> = () => {
  const { apis, error, createApi } = useApis();

  const submit = (details:any) => {
    createApi(details);
  };

  return (
    <Layout hasSidebar={true}>
      <View backgroundColor="gray-200" padding="size-100" gridArea="sidebar">
        <Heading>Apis</Heading>
        <Content>
          <Text>
            APIs allow you to build sophisticated query based APIs on top of your datasets
          </Text>
        </Content>
      </View>
      <Flex gridArea="content" margin="size-1000" direction='column'>
        <Header>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading>Apis</Heading>

            <NewApiDialog
              onSubmit={(data) => {
                submit(data);
              }}
            />
          </Flex>
        </Header>
        <Divider size="S" />
        {apis && (
          <TableView
            width='100%'
            aria-label="Example table with static contents"
            selectionMode="multiple"
            marginY="size-40"
            max-height="70vh"
          >
            <TableHeader>
              <Column>Name</Column>
              <Column>Access</Column>
              <Column align="center">View Api</Column>
              <Column align="center">Edit Api</Column>
            </TableHeader>
            <TableBody>
              {apis.map((api: any, index:number) => (
                <Row key={index}>
                  <Cell>
                    <ALink>
                      <Link href={`/apis/${api.id}`}>{api.name}</Link>
                    </ALink>
                  </Cell>
                  <Cell>{api.public ? "Public" : "Private"}</Cell>
                  <Cell>
                    <ALink>
                      <Link href={`/apis/${api.id}`}>
                        <Preview size="S" />
                      </Link>
                    </ALink>
                  </Cell>
                  <Cell>
                    <ALink>
                      <Link href={`/apis/edit/${api.id}`}>
                        <Edit size="S" />
                      </Link>
                    </ALink>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </Flex>
    </Layout>
  );
};

export default ApisPage;
