import React, { useEffect } from "react";
import { Divider, Flex, Text } from "@adobe/react-spectrum";
import { App } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { AppOptionsBar } from "../../components/AppOptionsBar/AppOptionsBar";
import { MaticoProvider } from "../../components/DatasetCreation/S3Provider";
import { useApp } from "../../hooks/useApp";
import { prisma } from "../../db";
import { Blank } from "../../templates/Blank";
import { Login } from "../../components/Login/Login";
import { useApps } from "../../hooks/useApps";
import { useRouter } from "next/router";

const AppDemoPage: React.FC = () => {
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );
  
  const [initialSpec, setInitialSpec] = React.useState<App | null>(null);
  const [spec, setSpec] = React.useState<App | null>(null);
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const { data: session } = useSession();
  const { createAppFromDemo } = useApps({});
  const router = useRouter();

  useEffect(() => {
    if(session?.id && spec){
      console.log('generating app', session, spec)
        createAppFromDemo(spec, `${session.name} - Matico Demo App`).then((app) => {
            if (app?.error) {
                console.log(app.error)
            } else {
              console.log('app generated', app)
              router.push(`/apps/edit/${app.id}`);
            }
          });
    }
  }, [session, spec]);

  const onUpdateSpec = (spec: App) => {
    if (spec) {
        const date = new Date()
        const hour = date.getHours()
        const minutes = date.getMinutes()

        localStorage.setItem("matico_app", JSON.stringify(spec));
        setLastSaved(`Stored locally at ${hour}:${minutes}`);
        setSpec(spec)
    }
  };

  useEffect(() => {
    const app = localStorage.getItem("matico_app");
    if (app) {
        setInitialSpec(JSON.parse(app));
    } else {
        setInitialSpec(Blank);
    }
  }, []);

  const editor = useMemo(() => {
    if (initialSpec) {
      return (
        <MaticoApp
          onSpecChange={(spec: any) => {
            onUpdateSpec(spec);
          }}
          spec={initialSpec}
          basename={`/apps/demo`}
          editActive={true}
          datasetProviders={[MaticoProvider]}
        />
      );
    } else {
      return (
        <Flex height="100%" gridArea="content">
          <h2>Loading...</h2>
        </Flex>
      );
    } 
  }, [initialSpec]);

  return (
    <Flex direction="column" height="100vh">
      <AppOptionsBar app={{
        name: "Demo Matico App"
      }}>
        <Flex direction="row" flex={1.5} gap="size-150" alignItems="center">
        <Text><b>Log in to save &amp; share.</b></Text>
        <Text>{lastSaved}</Text>
        <Login/>
        </Flex>
      </AppOptionsBar>
      <Divider size="S" />

      <Flex flex={1} maxHeight={"calc(100vh - 51px)"}>
        {editor}
      </Flex>
    </Flex>
  );
};

export default AppDemoPage;
