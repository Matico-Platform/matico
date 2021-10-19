import React from "react";
import { Dashboard } from "matico_spec";
import * as Icons from "grommet-icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { MaticoStateProvider, MaticoVariableState} from "../../Contexts/MaticoStateContext/MaticoStateContext";

import {
  Grommet,
  Box,
  Grid,
  Sidebar,
  Avatar,
  Button,
  Nav,
  Main,
} from "grommet";

interface MaticoAppInterface {
  spec: Dashboard;
  onStateChange?: (state:MaticoVariableState)=>void
}

const NamedButton: React.FC<{ name: string }> = ({ name }) => {
  const NamedIcon = Icons[name] ? Icons[name] : Icons.Document;
  return <NamedIcon />;
};

export const MaticoApp: React.FC<MaticoAppInterface> = ({ spec , onStateChange }) => {
  return (
    <MaticoStateProvider onStateChange={onStateChange}>
      <Grommet style={{ width: "100%", height: "100%" }}>
        <Router>
          <Grid
            columns={["xsmall", "flex"]}
            rows={["flex"]}
            fill={true}
            areas={[["nav", "main"]]}
          >
            <Box gridArea="nav" background="light-5">
              <Sidebar
                background="brand"
                round="small"
                header={
                  <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
                }
                footer={<Button icon={<Icons.Help />} hoverIndicator />}
              >
                <Nav gap="small">
                  {spec.pages.map((page) => (
                    <Link key={page.name} to={page.path ? page.path : `/${page.name}`}>
                      <Button
                        a11yTitle={page.name}
                        icon={<NamedButton name={page.icon} />}
                        hoverIndicator
                      />
                    </Link>
                  ))}
                </Nav>
              </Sidebar>
            </Box>
            <Main gridArea="main">
              <Switch>
                {spec.pages.map((page) => (
                  <Route
                    path={page.path ? page.path : `/${page.name}`}
                    exact={true}
                  >
                    <MaticoPage page={page} />
                  </Route>
                ))}
              </Switch>
            </Main>
          </Grid>
        </Router>
      </Grommet>
    </MaticoStateProvider>
  );
};
