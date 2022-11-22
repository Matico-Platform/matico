import { ActionButton, Flex, Grid, repeat } from "@adobe/react-spectrum";
import { App } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { AppCard } from "../../components/AppCard/AppCard";
import { TemplateSelector } from "../../components/TemplateSelector/TemplatesSelector";
import { useApps } from "../../hooks/useApps";
import { userFromSession } from "../../utils/db";
import { prisma } from "../../db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const session = await getSession(context);
  const user = await userFromSession(session, prisma);

  return {
    props: {
      ...context.params,
      user,
    },
  };
};

const UserPage: React.FC<{ appName: string; userId: string }> = ({
  appName,
  userId,
}) => {
  const { data: session } = useSession();

  const { apps } = useApps({ ownerId: session?.email as string });

  const createNewApp = () => {
    fetch("/api/apps", {
      method: "POST",
      body: JSON.stringify({
        name: "TestApp",
        description: "A Test app",
        public: false,
        template: "Blank",
      }),
      headers: {
        ContentType: "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => console.log("createa result is ", r));
  };

  return (
    <Flex gridArea="content" direction="column">
      <h1>Welcome {}</h1>
      {JSON.stringify(session, null, 2)}
      <TemplateSelector onSelectTemplate={createNewApp} />
      <Grid rows={["1fr", "1fr"]} columns={["1fr", "1fr", "1fr"]}>
        {apps?.map((a: App) => (
          <AppCard
            key={a.id}
            app={a}
            includeEdit={true}
            includeView={true}
            includeFork={true}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default UserPage;
