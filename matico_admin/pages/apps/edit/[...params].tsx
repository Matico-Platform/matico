import type { NextPage } from "next";
import { Layout } from "../../../components/Layout";
import Link from "next/link"
import { Divider, Heading, View, Text, Header, Link as ALink, ActionButton } from "@adobe/react-spectrum";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useApp } from "../../../hooks/useApps";
import { Content } from "@adobe/react-spectrum";
import { MaticoServerDatasetProvider } from "../../../datasetProviders/MaticoServerDatasetProvider";
import {MaticoServerApiProvider} from "../../../datasetProviders/MaticoApiProvider";

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
  console.log("app is ",app)

  return (
    <Layout hasSidebar={false}>
      <View gridArea="content" id="appContent">
        {app && (
          <MaticoApp
            //@ts-ignore
            spec={app.spec}
            basename={`/apps/edit/${appId}/`}
            //@ts-ignore
            editActive={true}
            onSpecChange={(spec: any) => {
              updateApp({ ...app, spec });
            }}
            datasetProviders={[MaticoServerDatasetProvider, MaticoServerApiProvider]}
          />
        )}
      </View>
    </Layout>
  );
};

export default Editor;
