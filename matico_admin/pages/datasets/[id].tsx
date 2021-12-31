import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { Divider, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useDataset } from "../../hooks/useDataset";
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
import { useDatasetColumns } from "../../hooks/useDatasetColumns";
import { useDatasetData } from "../../hooks/useDatasetData";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { datasetId: query.id } };
};

const Dataset: NextPage<{ datasetId: string }> = ({ datasetId }) => {
  const { data: dataset, error: datasetError } = useDataset(datasetId);
  const { data: columns, error: columnsError } = useDatasetColumns(datasetId);

  const { data, error: dataError } = useDatasetData(datasetId, 0);

  console.log("dataset ", dataset, "colums", columns, " data ", data);

  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View gridArea="content">
        {dataset && (
          <>
            <h3>{dataset.name}</h3>
            <Divider size="S" />
            {columns && data && (
              <TableView
                aria-label="Example table with static contents"
                selectionMode="multiple"
                marginY="size-40"
              >
                <TableHeader>
                  {columns.map((column: any) => (
                    <Column>{column.name}</Column>
                  ))}
                </TableHeader>
                <TableBody>
                  {data.data.map((datum: any) => (
                    <Row>
                      {columns.map((col: any) => (
                        <Cell>
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
          </>
        )}
      </View>
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  );
};

export default Dataset;
