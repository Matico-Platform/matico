import React from "react";
import { Dashboard } from "matico_spec";
import * as Icons from "grommet-icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { Provider } from "react-redux";
import { store, VariableState } from "../../Stores/MaticoStore";
import { MaticoState } from "../../Stores/MaticoStore";

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
import {
  MaticoDataProvider,
  MaticoDataState,
} from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { useMaticoSelector } from "../../Hooks/redux";

interface MaticoAppInterface {
  spec: Dashboard;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  basename?: string;
}

const NamedButton: React.FC<{ name: string }> = ({ name }) => {
  const NamedIcon = Icons[name] ? Icons[name] : Icons.Document;
  return <NamedIcon />;
};

const StateReporter: React.FC<{
  onStateChange: (state: VariableState) => void;
}> = ({ onStateChange }) => {
  const state = useMaticoSelector((state) => state);
  onStateChange(state.variables);
  return <></>;
};

export const MaticoApp: React.FC<MaticoAppInterface> = ({
  spec,
  onStateChange,
  basename,
  onDataChange,
}) => {
  return (
    <Provider store={store}>
      {onStateChange && <StateReporter onStateChange={onStateChange} />}
      <MaticoDataProvider onStateChange={onDataChange} datasets={spec.datasets}>
        <Grommet style={{ width: "100%", height: "100%" }}>
          <Router basename={basename}>
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
                      <Link
                        key={page.name}
                        to={page.path ? page.path : `/${page.name}`}
                      >
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
                      key={page.path}
                    >
                      <MaticoPage key={page.path} page={page} />
                    </Route>
                  ))}
                </Switch>
              </Main>
            </Grid>
          </Router>
        </Grommet>
      </MaticoDataProvider>
    </Provider>
  );
};
