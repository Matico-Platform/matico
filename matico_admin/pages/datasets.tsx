import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import {
  Text,
  Content,
  Divider,
  Flex,
  Header,
  Heading,
  View,
} from "@adobe/react-spectrum";
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
import { NewDatasetModal } from "../components/DatasetCreation/NewDatasetModal";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const datasets = await fetch(`http://localhost:8000/api/datasets`).then(
//       (resp) => resp.json()
//     );
//     return { props: { datasetsInitial: datasets } };
//   } catch (e: any) {
//     console.log(e);
//     return { props: { datasetsInitial: [] } };
//   }
// };

const Home: NextPage<{ datasetsInitial: Array<any> }> = ({
  datasetsInitial,
}) => {
  const { data: datasets, error } = useDatasets();

  console.log("datasets are ", datasets)
  return (
    <Layout>
      <View backgroundColor="gray-200" padding="size-100" gridArea="sidebar">
        <Heading>Datasets</Heading>
        <Content>
          <Text>
            These are your datasets. From here you can, edit view and share your
            core data
          </Text>
        </Content>
      </View>

      <View gridArea="content" padding="size-1000">
        <Header>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading>Dataset</Heading>
            <NewDatasetModal />
          </Flex>
        </Header>
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
              {datasets.map((dataset: any, rowIndex: number) => (
                <Row key={rowIndex}>
                  <Cell>
                    <ALink>
                      <Link href={`/datasets/${dataset.id}`}>
                        {dataset.name}
                      </Link>
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
    </Layout>
  );
};

export default Home;
