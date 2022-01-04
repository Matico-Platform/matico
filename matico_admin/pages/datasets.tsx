import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import { Divider, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useDatasets } from "../hooks/useDatasets";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const datasets = await fetch(`http://localhost:8000/api/datasets`).then(
      (resp) => resp.json()
    );
    return { props: { datasetsInitial: datasets } };
  } catch (e: any) {
    console.log(e);
    return { props: { datasetsInitial: [] } };
  }
};

const Home: NextPage<{ datasetsInitial: Array<any> }> = ({
  datasetsInitial,
}) => {
  const { data: datasets, error } = useDatasets();

  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View gridArea="content">
        <h3>Datasets</h3>
        <Divider size="S" />
        {datasets && (
          <TableView
            aria-label="Example table with static contents"
            selectionMode="multiple"
            marginY="size-40"
          >
            <TableHeader>
              <Column>Name</Column>
              <Column>Access</Column>
              <Column>Type</Column>
              <Column>Sync Frequency</Column>
              <Column>Sync Url</Column>
              <Column>Created At</Column>
              <Column>Updated At</Column>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset: any) => (
                <Row>
                  <Cell>
                    <ALink>
                      <Link href={`/datasets/${dataset.id}`} >{dataset.name}</Link>
                    </ALink>
                  </Cell>
                  <Cell>{dataset.public ? "Public" : "Private"}</Cell>
                  <Cell>{dataset.sync_dataset ? "Sync" : "Static"}</Cell>
                  <Cell>
                    {dataset.sync_dataset ? dataset.sync_frequency_seconds : ""}
                  </Cell>
                  <Cell>{dataset.sync_dataset ? dataset.sync_url : ""}</Cell>
                  <Cell>{dataset.created_at}</Cell>
                  <Cell>{dataset.updated_at}</Cell>
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

export default Home;