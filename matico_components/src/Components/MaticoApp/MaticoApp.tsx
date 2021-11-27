import React from "react";
import { Dashboard } from "matico_spec";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { Provider } from "react-redux";
import { store, VariableState } from "../../Stores/MaticoStore";
import { MaticoState } from "../../Stores/MaticoStore";

import {
  Grommet,
  Box,
  Grid,
  Main,
} from "grommet";
import {
  MaticoDataProvider,
  MaticoDataState,
} from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { useMaticoSelector } from "../../Hooks/redux";
import { MaticoNavBar } from "../MaticoNavBar/MaticoNavBar";

interface MaticoAppInterface {
  spec: Dashboard;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  basename?: string;
}

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
                <MaticoNavBar pages={spec.pages} />
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
