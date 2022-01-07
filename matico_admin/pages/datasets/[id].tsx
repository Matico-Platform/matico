import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import {
  Divider,
  Grid,
  Item,
  TabList,
  TabPanels,
  Tabs,
  TextArea,
  View,
} from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useDataset } from "../../hooks/useDataset";
import { Link as ALink } from "@adobe/react-spectrum";
import { MaticoMapPane } from "@maticoapp/matico_components";
import Link from "next/link";

import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { useDatasetColumns } from "../../hooks/useDatasetColumns";
import { useDatasetData } from "../../hooks/useDatasetData";
import { MapView } from "../../components/MapView";
import TableEdit from "@spectrum-icons/workflow/TableEdit";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { datasetId: query.id } };
};

const Dataset: NextPage<{ datasetId: string }> = ({ datasetId }) => {
  const { data: dataset, error: datasetError } = useDataset(datasetId);
  const { data: columns, error: columnsError } = useDatasetColumns(datasetId);

  const { data, error: dataError } = useDatasetData(datasetId, 0, 30);

  return (
    <Layout>
      <View backgroundColor="gray-200" padding="size-200" gridArea="sidebar">
        <h3>{dataset ? dataset.name : "Loading..."}</h3>
      </View>
      <View gridArea="content" padding="size-800">
        {dataset && (
          <>
            <Grid
              areas={["table map", "focus focus"]}
              columns={["1fr", "1fr"]}
              rows={["60%", "40%"]}
              width="100%"
              height="100%"
              gap="size-400"
            >
              {columns && data && (
                <TableView
                  aria-label="Example table with static contents"
                  selectionMode="multiple"
                  marginY="size-40"
                  gridArea="table"
                >
                  <TableHeader>
                    {columns.map((column: any, index:number) => (
                      <Column key={index}>{column.name}</Column>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {data.data.map((datum: any) => (
                      <Row >
                        {columns.map((col: any) => (
                          <Cell >
                            {col.col_type === "geometry"
                              ? "geometry"
                              : datum[col.name]}
                          </Cell>
                        ))}
                      </Row>
                    ))}
                  </TableBody>
                </TableView>
              )}
              <View gridArea="map">
                <MapView datasetId={datasetId} />
              </View>
              <View gridArea="focus">
                <Tabs orientation="vertical" width="100%" height="100%">
                  <TabList>
                    <Item key="query">Query</Item>
                    <Item key="feature">
                      <TableEdit />
                    </Item>
                  </TabList>
                  <TabPanels>
                    <Item key="query">
                      <TextArea width="100%" height="100%" />
                    </Item>
                    <Item key="feature">Feature</Item>
                  </TabPanels>
                </Tabs>
              </View>
            </Grid>
          </>
        )}
      </View>
    </Layout>
  );
};

export default Dataset;
