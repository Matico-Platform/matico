import { Grommet, Grid, Box, Main } from "grommet";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { MaticoDataState } from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { VariableState } from "../../Stores/MaticoVariableSlice";
import { MaticoNavBar } from "../MaticoNavBar/MaticoNavBar";
import { Dashboard } from "matico_spec";
import { setSpec } from "../../Stores/MaticoSpecSlice";
import { useAppSpec } from "../../Hooks/useAppSpec";
import { useMaticoSelector, useMaticoDispatch } from "../../Hooks/redux";

interface MaticoAppPresenterProps {
  spec?: Dashboard;
  basename?: string;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
}

export const MaticoAppPresenter: React.FC<MaticoAppPresenterProps> = ({
  spec,
  basename,
  onStateChange,
}) => {
  const dispatch = useMaticoDispatch();
  // If the external spec changes, we want to update here
  // This will also set up the inital spec
  useEffect(() => {
    dispatch(setSpec(spec));
  }, [JSON.stringify(spec)]);

  const appSpec = useAppSpec();

  const appState = useMaticoSelector((state) => state.variables);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(appState);
    }
  }, [onStateChange, JSON.stringify(appState)]);

  return (
    <Router basename={basename}>
      {appSpec && (
        <Grid
          columns={["xsmall", "flex"]}
          rows={["flex"]}
          fill={true}
          gridArea={"viewer"}
          areas={[["nav", "main"]]}
        >
          <Box gridArea="nav" background="light-5">
            <MaticoNavBar pages={appSpec.pages} />
          </Box>
          <Main gridArea="main">
            <Switch>
              {appSpec.pages.map((page,index) => (
                <Route
                  path={page.path ? page.path : `/${page.name}`}
                  exact={true}
                  key={page.path}
                >
                  <MaticoPage key={page.path} page={page} editPath={`pages.${index}`} />
                </Route>
              ))}
            </Switch>
          </Main>
        </Grid>
      )}
    </Router>
  );
};
