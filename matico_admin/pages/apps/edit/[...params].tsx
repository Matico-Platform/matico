import type { NextPage } from "next";
import { Layout } from "../../../components/Layout";
import Link from "next/link"
import { Divider, Heading, View, Text, Header, Link as ALink, ActionButton } from "@adobe/react-spectrum";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useApp } from "../../../hooks/useApps";
import { Content } from "@adobe/react-spectrum";
import { MaticoServerDatasetProvider } from "../../../datasetProviders/MaticoServerDatasetProvider";

const Editor: NextPage = () => {
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );
  const router = useRouter();
  const params = router.query.params;
  const appId = params ? params[0] : "";

  const { app, updateApp } = useApp(appId);



  return (
    <Layout>
      <View backgroundColor="gray-200" padding="size-200" gridArea="sidebar">
        {app ? (
          <>
            <Heading>{app.name}</Heading>
            <Divider size="M" />
            <Content>
              <Text>{app ? app.description : ""}</Text>
              <Divider size='M'/>
              <Heading>Links</Heading>
              <ALink><Link href={`/apps/${appId}`}>App Link</Link></ALink>
            </Content>
          </>
        ) : (
          <Heading>Loading</Heading>
        )}
      </View>
      <View gridArea="content" id="appContent">
        {app && (
          <MaticoApp
            //@ts-ignore
            spec={app.spec}
            basename={`/apps/edit/${appId}/`}
            //@ts-ignore
            editActive={true}
            onSpecChange={(spec: any) => {
              console.log("UPDATEING");
              updateApp({ ...app, spec });
            }}
            datasetProviders={[MaticoServerDatasetProvider]}
          />
        )}
      </View>
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  );
};

export default Editor;