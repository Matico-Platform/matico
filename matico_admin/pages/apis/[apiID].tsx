import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { Divider, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useAPI} from "../../hooks/useAPI";
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
  return { props: { apiId: query.apiID} };
};

const Api: NextPage<{ apiId: string }> = ({ apiId }) => {
  const { data: api, error: apiError } = useAPI(apiId);

  console.log("api ", api );
  console.log("GETTING APIS ")

  return (
    <Layout hasSidebar={true}>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View gridArea="content" padding="size-200">
        {api ? JSON.stringify(api,null,2) : ''}
      </View>
    </Layout>
  );
};

export default Api;
