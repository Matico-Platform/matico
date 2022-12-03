import { Flex, ProgressCircle, View } from "@adobe/react-spectrum";
import { App } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { userFromSession } from "../../utils/db";
import { prisma } from "../../db";

const LoadingQuotes: { quote: string; author: string }[] = [
  {
    quote: "Patience is bitter, but its fruit is sweet.",
    author: "Aristotle",
  },
  {
    quote: "7/10 UX blogs recommend to use loading quotes.",
    author: "Me",
  },
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = await userFromSession(session, prisma);
  const params = context.query.params;

  const app = await prisma.app.findUnique({
    where: {
      id: params ? params[0] : undefined,
    },
    include: { owner: true },
  });

  await prisma.app.update({
    where: { id: app!.id },
    data: { noViews: { increment: 1 } },
  });

  if (!app) return { props: { app: null, error: "Failed to find app" } };

  if (app.owner.id !== user?.id && app.public === false)
    return { props: { app: null, error: "Unauthorized to view this app" } };

  return {
    props: {
      app: JSON.parse(JSON.stringify(app)),
    },
  };
};

interface AppPresentPageProps {
  app?: App;
  error?: string;
}

const AppPresentPage: React.FC<AppPresentPageProps> = ({ app, error }) => {
  const [loading, setLoading] = useState(true);
  const [randomQuote] = useState(
    LoadingQuotes[Math.floor(Math.random() * LoadingQuotes.length)]
  );
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then((matico: any) => {
        setLoading(false);
        return matico.MaticoApp;
      }),
    { ssr: false }
  );

  if (error) {
    return (
      <Flex height="100%" gridArea="content">
        <h2>{error}</h2>
      </Flex>
    );
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to top left, #282848, #793169)",
          animation: !loading ? "fadeout 1s forwards" : "none",
          textAlign: "center",
        }}
      >
        <Flex direction="column" alignItems={"center"} justifyContent="center">
          <ProgressCircle aria-label="Loading…" isIndeterminate />
          <p>
            <i>{randomQuote.quote}</i>
            <br />- {randomQuote.author}
          </p>
        </Flex>
      </div>
      <Flex width="100vw" height="100vh">
        {app && (
          <MaticoApp
            spec={app.spec}
            basename={`/apps/${app.id}`}
            editActive={false}
          />
        )}
      </Flex>
      <style>{`
        @keyframes fadeout {
          0% {
            opacity: 1;
            display:block;
          }
          99% {
            opacity: 0;
            display:block;
          }
          100% {
            opacity: 0;
            display:none;
          }
        }
      `}</style>
    </>
  );
};

export default AppPresentPage;
