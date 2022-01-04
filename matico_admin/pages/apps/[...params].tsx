import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { Divider, Heading, View, Text } from "@adobe/react-spectrum";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useApp } from "../../hooks/useApps";
import { Content } from "@adobe/react-spectrum";

const Viewer: NextPage = () => {
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

  const { app } = useApp(appId);

  if (!app) {
    return <Text>Loading...</Text>;
  }

  return (
    <div style={{width:"100vw", height:"100vh"}}>
      <MaticoApp
        //@ts-ignore
        spec={app.spec}
        basename={`/apps/${appId}`}
        //@ts-ignore
        editActive={false}
      />
    </div>
  );
};

export default Viewer;
