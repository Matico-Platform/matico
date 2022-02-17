import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import {
  Divider,
  Flex,
  Grid,
  Heading,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
  Text,
  Link,
  IllustratedMessage,
  Content,
  TooltipTrigger,
  Tooltip,
  Well,
  Picker,
  Header,
  ToggleButton,
} from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useDataset } from "../../hooks/useDatasets";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { useDatasetColumns } from "../../hooks/useDatasetColumns";
import { useDatasetData } from "../../hooks/useDatasetData";
import { MapView } from "../../components/MapView";
import TableEdit from "@spectrum-icons/workflow/TableEdit";
import SqlQuery from "@spectrum-icons/workflow/SQLQuery";
import { SyncHistory } from "../../components/SyncHistory";
import dynamic from "next/dynamic";
import { QueryEditorProps } from "../../components/QueryEditor";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { Source, SourceType } from "../../utils/api";
import { useExtent } from "../../hooks/useExtent";
import {FeatureEditor} from "../../components/FeatureEditor";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { datasetId: query.id } };
};

const Dataset: NextPage<{ datasetId: string }> = ({ datasetId }) => {
  const source: Source = {
    type: SourceType.Dataset,
    id: datasetId,
  };
  const { dataset,  datasetError, updateDataset } = useDataset(datasetId);
  const { columns, columnsError } = useDatasetColumns(source);

  const [selectedFeatureId, setSelectedFeatureId] =
    useState<string | number | null>(null);

  const [visCol, setVisCol] = useState<string | null>(null);
  const [query, setQuery] = useState<null | string>(null);

  useEffect(() => {
    if (query === null && dataset) {
      setQuery(`select * from ${dataset?.table_name}`);
    }
  }, [dataset, query]);

  const { extent, extentError } = useExtent(source);

  const QueryEditor = dynamic<QueryEditorProps>(
    () =>
      (import("../../components/QueryEditor") as any).then(
        (imp: any) => imp.QueryEditor
      ),
    { ssr: false }
  );

  const setIdColumn = (new_id_col:string)=>{
    updateDataset({id_col:new_id_col}) 
  }

  const setGeomColumn =(new_geom_col:string)=>{
    updateDataset({geom_col: new_geom_col})
  }

  const setPublic = (isPublic:boolean)=>{
    updateDataset({public: isPublic})
  }

  return (
    <Layout hasSidebar={true}>
      <View
        backgroundColor="gray-200"
        padding="size-200"
        gridArea="sidebar"
        height="100%"
      >
        <Heading marginBottom={"size-200"}>{dataset ? dataset.name : "Loading..."}</Heading>
        {dataset && (
          <Well>
            <Header marginBottom={"size-200"}>Description</Header>
            <Content>{dataset.description}</Content>
          </Well>
        )}
        {columns && (
          <Well>
            <Header marginBottom={"size-200"}>Column settings</Header>
            <Flex direction='column'>
            <Picker
              width="100%"
              selectedKey={dataset?.id_col}
              marginBottom={"size-200"}
              items={columns}
              label={"Id Column"}
              onSelectionChange={(key) => setIdColumn(key as string)}
            >
              {(item) => <Item key={item.name}>{item.name}</Item>}
            </Picker>
            <Picker
              width="100%"
              selectedKey={dataset?.geom_col}
              marginBottom={"size-200"}
              items={columns.filter((c) => c.col_type === "geometry")}
              label={"Geometry Column"}
              onSelectionChange={(key) => setGeomColumn(key as string)}
            >
              {(item) => <Item key={item.name}>{item.name}</Item>}
            </Picker>

            <ToggleButton isEmphasized isSelected={dataset.public} onChange={setPublic} >Public</ToggleButton>
          </Flex>
          </Well>
        )}

        {dataset && dataset.sync_dataset && (
          <Well>
            <Header marginBottom={"size-200"}>Sync Status</Header>
            <SyncHistory datasetId={datasetId} />
            <Text>
              Sycing form{" "}
              <Link>
                <a href={dataset.sync_url}>{dataset.sync_url}</a>
              </Link>
            </Text>
          </Well>
        )}
      </View>
      <View gridArea="content" padding="size-200" width="100%" height="100%">
        {dataset && (
          <>
            <Grid
              areas={["table map", "focus focus"]}
              columns={["1fr", "1fr"]}
              rows={["60%", "40%"]}
              width="100%"
              height="100%"
              gap="size-200"
            >
              {dataset && (
                <DataTable
                  source={source}
                  filters={[]}
                  visCol={visCol}
                  onVizualizeCol={setVisCol}
                  idCol={dataset?.id_col}
                  selection={selectedFeatureId}
                  onSelectionChange={setSelectedFeatureId}
                />
              )}
              <View gridArea="map">
                <MapView
                  visCol={visCol}
                  source={source}
                  extent={extent?.extent}
                  selectedFeatureId={selectedFeatureId}
                  idCol={dataset?.id_col}
                  onSelectFeature={setSelectedFeatureId}
                />
              </View>
              <Tabs
                gridArea="focus"
                orientation="vertical"
                width="100%"
                height="100%"
              >
                <TabList>
                  <Item key="query">
                    <TooltipTrigger delay={0}>
                      <SqlQuery />
                      <Tooltip>Query data</Tooltip>
                    </TooltipTrigger>
                  </Item>
                  <Item key="feature">
                    <TooltipTrigger delay={0}>
                      <TableEdit />
                      <Tooltip>Edit Features</Tooltip>
                    </TooltipTrigger>
                  </Item>
                </TabList>
                <TabPanels>
                  <Item key="query">
                    <QueryEditor
                      key={"query_pane"}
                      query={query}
                      onQueryChange={setQuery}
                    />
                  </Item>
                  <Item key="feature">
                    <FeatureEditor edit={true} featureId={selectedFeatureId} source={source}/>
                  </Item>
                </TabPanels>
              </Tabs>
            </Grid>
          </>
        )}
      </View>
    </Layout>
  );
};

export default Dataset;
