import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { Divider, Heading, View } from "@adobe/react-spectrum";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useApp } from "../../hooks/useApps";

const Editor: NextPage = () => {
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );
  const router = useRouter();

  console.log("router is ", router)

  const params = router.query.params;
  const appId = params ? params[0] : "";

  const { app, updateApp } = useApp(appId);

  return (
    <Layout>
      <View backgroundColor="gray-200" padding="size-200" gridArea="sidebar">
        {app ? <Heading>{app.name}</Heading> : <Heading>Loading</Heading>}
        <Divider size="M" />
      </View>
      <View gridArea="content">
        {app && (
          <MaticoApp
            //@ts-ignore
            spec={app.spec}
            basename={`/apps/${appId}`}
            //@ts-ignore
            editActive={true}
            onSpecChange={(spec: any) => {
              console.log("UPDATEING");
              updateApp({...app,spec});
            }}
          />
        )}
      </View>
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  );
};

export default Editor;
