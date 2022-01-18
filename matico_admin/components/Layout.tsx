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

export const Layout: React.FC = ({ children }) => {
  return (
    <SSRProvider>
      <Provider theme={defaultTheme}>
        <Grid
          areas={["header  header", "sidebar content", "footer  footer"]}
          columns={["1fr", "3fr"]}
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
