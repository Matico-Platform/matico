import React from "react";
import {
  SSRProvider,
  Provider,
  defaultTheme,
  Grid,
  Footer,
  Flex,
} from "@adobe/react-spectrum";
import { Nav } from "./Nav";
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

interface LayoutProps{
  hasSidebar?: boolean
}

// you can import these packages anywhere

// only initialize when in the browser
if (typeof window !== 'undefined') {
  LogRocket.init('5fasmn/matico');
  // plugins should also only be initialized when in the browser
  setupLogRocketReact(LogRocket);
}

export const Layout: React.FC<LayoutProps> = ({ children, hasSidebar }) => {

  const areas = {
    L: ["header  header", `${hasSidebar ? 'sidebar' : 'content'} content`, "footer  footer"],
    M: ["header  header", `${hasSidebar ? 'sidebar' : 'content'} content`, "footer  footer"],
    S: ["header  header", ...(hasSidebar ? ['sidebar sidebar', 'content content'] : ['content content']), "footer  footer"],
    base: ["header  header", ...(hasSidebar ? ['sidebar sidebar', 'content content'] : ['content content']), "footer  footer"]
  }

  const columns = {
    L: ["static-size-4600", "calc(100% - static-size-4600)"],
    M: ["static-size-3600", "calc(100% - static-size-3600)"],
    S: ["static-size-2600", "calc(100% - static-size-2600)"],
    base: ["static-size-2000", "calc(100% - static-size-2000)"]
  }

  const rows = {
    L: ["size-500", "auto", "size-300"],
    M: ["size-500", "auto", "size-300"],
    S: ["size-500", "size-2000", "auto", "size-300"],
    base: ["size-500", "size-2000", "auto", "size-300"]
  }

  return (
    <SSRProvider>
      <Provider theme={defaultTheme}>
        <Grid
          {...{ areas, columns, rows }}
          height="100vh"
          justifyContent="stretch"
          width="100%"
        >
          <Nav />
          {children}
          <Footer gridArea="footer">
            <Flex direction="row" alignItems="center" justifyContent="center">
              <small>
                &copy; Copyright {new Date().getFullYear()}, Matico, All Rights
                Reserved
              </small>
            </Flex>
          </Footer>
        </Grid>
      </Provider>
    </SSRProvider>
  );
};
