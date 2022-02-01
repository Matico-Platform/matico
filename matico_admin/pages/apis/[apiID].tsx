import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import {
  Button,
  Cell,
  Column,
  Content,
  Divider,
  Flex,
  Grid,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  View,
  Text,
} from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useApi, useApiTableData } from "../../hooks/useApis";
import dynamic from "next/dynamic";
import { QueryEditorProps } from "../../components/QueryEditor";
import { VariableEditor } from "../../components/VariableEditor";
import { MapView } from "../../components/MapView";
import { useMemo, useEffect, useState, memo } from "react";

const parameterRegEx = /\{\{([A-Za-z0-9]*)\}\}/g;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { apiId: query.apiID } };
};

const QueryEditor = dynamic<QueryEditorProps>(
  () =>
    (import("../../components/QueryEditor") as any).then(
      (imp: any) => imp.QueryEditor
    ),
  { ssr: false }
);

const Api: NextPage<{ apiId: string }> = ({ apiId }) => {
  const {
    api,
    error: apiError,
    updateApi,
  } = useApi(apiId, { refreshInterval: 0 });
  const [query, setQuery] = useState("test");
  const [lastRunKey, setLastRunKey] = useState(new Date().toISOString());
  const [localParameters, setLocalParameters] = useState<any[]>([]);

  const {
    data: tableData,
    error,
    mutate: updateTableData,
  } = useApiTableData(api, { params: { limit: 15 }, refreshInterval: 0 });


  const Table = useMemo(() => {
    console.log("RUNNING MEMO ");
    const columns = 
      tableData
        ? Object.keys(tableData[0]).map((item) => ({ id: item, name: item }))
        : [];
    return (
      <TableView id={"table"} key={"table"} gridArea="table">
        <TableHeader columns={columns}>
          {(col) => (
            <Column key={col.id} width={200}>
              {col.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={tableData}>
          {(param: { [key: string]: any }) => (
            <Row key={JSON.stringify(param)}>
              {(columnKey) => (
                <Cell>
                  {typeof param[columnKey] === "object"
                    ? "Geometry"
                    : param[columnKey]}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </TableView>
    );
  }, [tableData]);

  console.log("Api query is ", api?.sql.replace(/\n/g," "))
  const mapUrl = api
    ? `http://localhost:8000/api/tiler/api/${api.id}/{z}/{x}/{y}`
    : "";

  useEffect(() => {
    if (api) {
      setQuery(api.sql);
      setLocalParameters(api.parameters);
    }
  }, [api]);

  useEffect(()=>{
    const variables = parseVariables(query)
    variables.forEach((variable)=>{
      if(!localParameters.find(p=>p.name === variable)){
        localParameters.push({
          type:'Numerical',
          name:variable,
          description:`The value of ${variable}`,
          default_value:0
        })
      }
    })
  },[query])

  const updateAndRun = () => {
    setLastRunKey(new Date().toISOString());
    updateApi({ sql: query.replace(";", "") });
    setTimeout(() => {
      updateTableData();
    });
  };

  const parseVariables = (query: string) => {
    return [...query.matchAll(parameterRegEx)].map((match) => {
      return match[1];
    });
  };

  return (
    <Layout hasSidebar={true}>
      <View
        backgroundColor="gray-200"
        padding="size-200"
        gridArea="sidebar"
        height="100%"
      >
        <Heading level={2}>{api ? api.name : "Loading..."}</Heading>
        <Content>{api && api.description}</Content>
      </View>
      <View gridArea="content" padding="size-200" width="100%" height="95%">
        {api && (
          <Grid
            width="100%"
            height="100%"
            rows={["60%", "35%", "5%"]}
            columns={["1fr", "1fr"]}
            gap="size-200"
            areas={["table map", "query query", "buttons buttons"]}
          >
            <Flex gap="20px" gridArea="query" height="100%">
              <QueryEditor
                key={"query_pane"}
                query={query}
                onQueryChange={setQuery}
              />
              <View width={"25%"} height={"100%"}>
                <VariableEditor parameters={[]} />
              </View>
            </Flex>
            <Flex gridArea="buttons" gap={"10px"} justifyContent={"end"}>
              {error && <Text>{error.toString()}</Text>}
              <Button variant={"negative"}>Clear</Button>
              <Button variant={"primary"} onPress={updateAndRun}>
                Run
              </Button>
            </Flex>
            <View gridArea="map">
              <MapView url={mapUrl} />
            </View>
            {tableData && Table}
          </Grid>
        )}
      </View>
    </Layout>
  );
};

export default Api;
