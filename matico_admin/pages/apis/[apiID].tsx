import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { Button, Cell, Column, Content, Divider, Flex, Grid, Heading, Row, TableBody, TableHeader, TableView, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useApi, useApiTableData } from "../../hooks/useApis";
import dynamic from "next/dynamic";
import {QueryEditorProps} from "../../components/QueryEditor"
import {VariableEditor} from "../../components/VariableEditor";
import {MapView} from '../../components/MapView'
import {useMemo, useEffect, useState} from "react";

const parameterRegEx= /\{\{([A-Za-z0-9]*)\}\}/g

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
  const { api, error: apiError, updateApi } = useApi(apiId, {refreshInterval:0});
  const [query, setQuery] = useState("test")
  const [parameters, setParameters] = useState<any[]>([{"type":"numerical", "name": "test", "default_value": 2}])

  const {data: tableData, error} = useApiTableData(api,{params:{limit:20}, refreshInterval:0})
  
  const columns = tableData ? Object.keys(tableData[0]).map((item)=> ({id:item, name:item})) : []
  const mapUrl = api ? `http://localhost:8000/api/tiler/{z}/{x}/{y}?q=${api.sql}` : ''

  useEffect(()=>{
    if(api){
      setQuery(api.sql)
      setParameters(api.parameters)
    }
  },[JSON.stringify(api)])


  useEffect(()=>{
    const variables = parseVariables(query)
  },[query])


  const updateAndRun = ()=>{
    updateApi({sql:query})
  }

  
  const parseVariables = (query: string)=>{
    return [...query.matchAll(parameterRegEx)].map( (match)=>{
      return match[1]
    }) 
  }

  // console.log("local api", localApi)
  // const Editor = useMemo(()=>  
  //             <QueryEditor
  //               key={"query_pane"}
  //               query={localApi ? localApi.sql : ""}
  //               onQueryChange={(query)=> updateQuery(query)}
  //             />, [JSON.stringify(localApi), updateQuery]);

  return (
    <Layout hasSidebar={true}>
      <View 
        backgroundColor="gray-200"
        padding="size-200"
        gridArea="sidebar"
        height="100%"
     >
        <Heading level={2}>{api ? api.name : "Loading..."}</Heading>
        <Content>{ api && api.description}</Content>
      </View>
      <View gridArea="content" padding="size-200">
        {api && (
          <Grid width="100%" height="100%" 
          rows={["1fr",  "1fr", "auto"]}
          columns={["1fr", "1fr"]}
          gap="size-200"
          areas={["table map", "query query","buttons buttons"]}
        >
            <Flex gap="20px" gridArea="query">
              <QueryEditor
                key={"query_pane"}
                query={query}
                onQueryChange={setQuery} />
                <View width={"25%"}>
              <VariableEditor api={api} />
            </View>
            </Flex>
            <Flex gridArea="buttons" gap={"10px"} justifyContent={"end"}>
              <Button variant={"negative"}>
                Clear
              </Button>
              <Button variant={"primary"} onPress={updateAndRun}>
                Run
              </Button>
            </Flex>
            <View gridArea='map'>
              <MapView url={mapUrl} />
            </View>
            <View gridArea='table'>
              {tableData &&
              <TableView key={tableData.length}>
                <TableHeader columns={columns}>
                  {(col)=> <Column key={col.id} >{col.name}</Column>}
                </TableHeader>
                <TableBody items={tableData}>
                  { (param: {[key: string]: any})=>(
                    <Row key={JSON.stringify(param)}>
                        {columnKey => <Cell>{typeof(param[columnKey]) === 'object' ? "Geometry" : param[columnKey]}</Cell>}
                    </Row>
                  )}
                </TableBody>
              </TableView>
              }
            </View>
          </Grid>
        )}
      </View>
    </Layout>
  );
};

export default Api;
