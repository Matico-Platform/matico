import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import {
  Button,
  darkTheme,
  Provider,
  SSRProvider,
} from "@adobe/react-spectrum";
import { StandardLayout } from "../components/StandardLayout/StandardLayout";
import Head from "next/head";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import CookieConsent from "react-cookie-consent";

if (typeof window !== "undefined") {
  LogRocket.init("5fasmn/matico");
  setupLogRocketReact(LogRocket);
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SSRProvider>
        <Provider theme={darkTheme} colorScheme="dark">
          <Head>
            <link
              href="/fonts/fa.min.css"
              rel="stylesheet"
              key="font-awesome"
            />
          </Head>
          <Component {...pageProps} />
          <CookieConsent
            location="bottom"
            buttonText="Ok"
            cookieName="matico_boilerplate_cookie"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
          >
            Matico uses cookies to enhance our open source efforts and fix bugs.{" "}
            <span style={{ fontSize: "10px" }}>
              We use LogRocket for analytics. Read more about their{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://logrocket.com/privacy/#:~:text=How%20LogRocket%20Collects%20Cookies,when%20you%20visit%20other%20sites."
              >
                privacy policy
              </a>
            </span>
          </CookieConsent>
        </Provider>
      </SSRProvider>
    </SessionProvider>
  );
}

export default MyApp;
