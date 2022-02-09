import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import {
  Button,
  Content,
  Flex,
  Grid,
  Heading,
  View,
  Well,
  Text
} from "@adobe/react-spectrum";

import { GetServerSideProps } from "next";
import { useApi } from "../../hooks/useApis";
import { SourceType} from '../../utils/api' 
import dynamic from "next/dynamic";
import { QueryEditorProps } from "../../components/QueryEditor";
import { VariableEditor } from "../../components/VariableEditor";
import { MapView } from "../../components/MapView";
import { useEffect, useState} from "react";
import { DataTable } from "../../components/DataTable";
import {useExtent} from "../../hooks/useExtent";

const parameterRegEx = /\$\{([A-Za-z0-9]*)\}/g;

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
  const [query, setQuery] = useState("test");
  const [lastRunKey, setLastRunKey] = useState(new Date().toISOString());
  const [localParameters, setLocalParameters] = useState<any[]>([]);
  const [values, setValues] = useState<{ [param: string]: any }>({});
  const [queryError, setQueryError] = useState<string | null>(null);
  const [visCol, setVisCol] = useState<string | null>(null);

  const {
    api,
    error: apiError,
    updateApi,
  } = useApi(apiId, { refreshInterval: 0 });


  const source = {
    id: api?.id,
    type: SourceType.API,
    parameters: localParameters,
  };

  const {extent, extentError} = useExtent(source)

  const valuesForQuery = localParameters.reduce((agg, val) => {
    return {
      ...agg,
      [val.name]: values[val.name] ?? Object.values(val.default_value)[0],
    };
  }, {});

  const urlParams: string = Object.keys(valuesForQuery)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(valuesForQuery[key])}`
    )
    .join("&");

  const mapUrl = api
    ? `http://localhost:8000/api/tiler/api/${api.id}/{z}/{x}/{y}?${urlParams}`
    : "";

  useEffect(() => {
    if (api) {
      setQuery(api.sql);
      setLocalParameters(api.parameters);
    }
  }, [api]);

  useEffect(() => {
    const variables = parseVariables(query);
    const newVariables: Array<any> = [];
    variables.forEach((variable) => {
      if (!localParameters.find((p) => p.name === variable)) {
        newVariables.push({
          type: "Numerical",
          name: variable,
          description: `The value of ${variable}`,
          default_value: { Numeric: 0 },
        });
      }
    });
    setLocalParameters([...localParameters, ...newVariables]);
  }, [query]);

  const updateAndRun = () => {
    setLastRunKey(new Date().toISOString());
    updateApi({ sql: query.replace(";", ""), parameters: localParameters });
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
        <Heading level={4}>Api URLS</Heading>
        <Well>
          <Heading>Data endpoint</Heading>
          <p>{`http://localhost:8000/api/apis/${api?.id}/run?${urlParams}`}</p>
        </Well>
        <Well>
          <Heading>Tile endpoint</Heading>
          <p>{mapUrl}</p>
        </Well>
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
              <View width={"40%"} height={"100%"}>
                <VariableEditor
                  parameters={localParameters}
                  onParametersChanged={(newParams) =>
                    setLocalParameters(newParams)
                  }
                  onValuesChanged={(newValues) => setValues(newValues)}
                  values={values}
                  editable={true}
                />
              </View>
            </Flex>
            <Flex gridArea="buttons" gap={"10px"} justifyContent={"end"}>
              {queryError && <Text>{queryError}</Text>}
              <Button variant={"negative"}>Clear</Button>
              <Button variant={"primary"} onPress={updateAndRun}>
                Run
              </Button>
            </Flex>
            <View gridArea="map">
              <MapView extent={extent?.extent} visCol={visCol} source={source} />
            </View>
            {api && (
              <DataTable
                source={source}
                filters={[]}
                onError={setQueryError}
                visCol={visCol}
                onVizualizeCol={setVisCol}
              />
            )}
          </Grid>
        )}
      </View>
    </Layout>
  );
};

export default Api;
