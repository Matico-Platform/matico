import React from "react";
import {
  SSRProvider,
  Provider,
  defaultTheme,
  Button,
  Grid,
  View,
} from "@adobe/react-spectrum";
import { Nav } from "./Nav";
import { SWRConfig } from "swr";

export const Layout: React.FC = ({ children }) => {
  return (
    <SWRConfig value={{
      refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <SSRProvider>
        <Provider theme={defaultTheme}>
          <Grid
            areas={["header  header", "sidebar content", "footer  footer"]}
            columns={["1fr", "3fr"]}
            rows={["size-500", "auto", "size-1000"]}
            height="100vh"
            justifyContent="stretch"
            width="100vw"
            gap="size-100"
          >
            <Nav />
            {children}
          </Grid>
        </Provider>
      </SSRProvider>
    </SWRConfig>
  );
};
