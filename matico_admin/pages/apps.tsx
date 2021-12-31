import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import { Divider, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useApps } from "../hooks/useApps";
import { Link as ALink } from "@adobe/react-spectrum";
import Link from "next/link";

import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";

const Apps: NextPage<{ appsInitial: Array<any> }> = () => {
  const { data: apps, error } = useApps();

  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View gridArea="content">
        <h3>apps</h3>
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
            </TableHeader>
            <TableBody>
              {apps.map((app: any) => (
                <Row>
                  <Cell>
                    <ALink>
                      <Link href={`/apps/${app.id}`} >{app.name}</Link>
                    </ALink>
                  </Cell>
                  <Cell>{app.public ? "Public" : "Private"}</Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  );
};

export default Apps;
