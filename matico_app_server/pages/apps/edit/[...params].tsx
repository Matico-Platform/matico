import { Divider, Flex } from "@adobe/react-spectrum";
import { App } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { AppOptionsBar } from "../../../components/AppOptionsBar/AppOptionsBar";
import { MaticoProvider } from "../../../components/DatasetCreation/S3Provider";
import { useApp } from "../../../hooks/useApp";
import { prisma } from "../../../db";
import {userFromSession} from "../../../utils/db";

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context)
  const user = await userFromSession(session, prisma)

  console.log("User in edit is ", user)
  const params = context.query.params;

  const app = await prisma.app.findUnique({
    where: {
      id: params ? params[0] : undefined,
    },
    include: {
      owner: true,
      _count: { select: { collaborators: true } },
    },
  });


  console.log("App in edit is ", app)
  if (!app) return { props: { app: null, error: "Failed to find app" } };

  // if (app.owner.id !== user?.id)
  //   return { props: { app: null, error: "Unauthorized to view this app" } };

  return {
    props: {
      initialApp: JSON.parse(JSON.stringify(app)),
      user: JSON.parse(JSON.stringify(user)),
      session: JSON.parse(JSON.stringify(session))
    },
  };
};

interface AppPresentPageProps {
  initialApp?: App;
  user: any,
  session:any
  error?: string;
}

const AppPresentPage: React.FC<AppPresentPageProps> = ({
  initialApp,
  error,
  user,
  session
}) => {

  console.log("app ", initialApp,user, session)

  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then(
        (matico: any) => matico.MaticoApp
      ),
    { ssr: false }
  );

  const { app, updateApp, setPublic } = useApp(initialApp?.id, initialApp);

  const onUpdateSpec = (spec: App) => {
    if (!spec) {
      return;
    }

    const update = {
      name: spec.name,
      description: spec.description,
      spec: spec,
    };

    updateApp(update).catch((e) => {
      console.log("Failed to udpate app", e.error);
    });
  };

  const editor = useMemo(() => {
    if (initialApp) {
      return (
        <MaticoApp
          onSpecChange={(spec: any) => {
            onUpdateSpec(spec);
          }}
          spec={initialApp.spec}
          basename={`/apps/edit/${initialApp.id}`}
          editActive={true}
          datasetProviders={[MaticoProvider]}
        />
      );
    } else if (error) {
      return (
        <Flex height="100%" gridArea="content">
          <h2>{error}</h2>
        </Flex>
      );
    } else {
      return (
        <Flex height="100%" gridArea="content">
          <h2>Something really weird went wrong</h2>
        </Flex>
      );
    }
  }, [initialApp]);

  return (
    <Flex direction="column" height="100vh">
      <AppOptionsBar app={app} onPublicUpdate={setPublic} />
      <Divider size="S" />

      <Flex flex={1} maxHeight={"calc(100vh - 51px)"}>{editor}</Flex>
    </Flex>
  );
};

export default AppPresentPage;
