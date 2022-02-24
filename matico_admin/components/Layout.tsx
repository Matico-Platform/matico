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

  const areas = hasSidebar ? ["header  header", "sidebar content", "footer  footer"]
                           : ["header  header", "content content", "footer  footer"]
  return (
    <SSRProvider>
      <Provider theme={defaultTheme}>
        <Grid
          areas={areas}
          columns={["static-size-4600", "3fr"]}
          rows={["size-500", "auto", "size-300"]}
          height="100vh"
          justifyContent="stretch"
          width="100vw"
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
