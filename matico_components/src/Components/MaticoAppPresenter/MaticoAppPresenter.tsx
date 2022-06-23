import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { MaticoDataState } from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { VariableState } from "../../Stores/MaticoVariableSlice";
import { MaticoNavBar } from "../MaticoNavBar/MaticoNavBar";
import { setSpec } from "../../Stores/MaticoSpecSlice";
import { useAppSpec } from "../../Hooks/useAppSpec";
import { useMaticoSelector, useMaticoDispatch } from "../../Hooks/redux";
import { Content, Grid, View } from "@adobe/react-spectrum";
import {App, Page} from '@maticoapp/matico_types/spec'

import _ from "lodash";
import {useRegisterDatasets} from "Hooks/useRegisterDatasets";

interface MaticoAppPresenterProps {
    spec?: App;
    basename?: string;
    onStateChange?: (state: VariableState) => void;
    onDataChange?: (data: MaticoDataState) => void;
    maxDimensions?: {
        height: number|null,
        width: number|null
    }
}

export const MaticoAppPresenter: React.FC<MaticoAppPresenterProps> = ({
    spec,
    basename,
    onStateChange,
    maxDimensions = {
        height: null,
        width: null
    }
}) => {
    const dispatch = useMaticoDispatch();

    const firstLoad = useRef(true);

    // If the external spec changes, we want to update here
    // This will also set up the inital spec
    useEffect(() => {
        if (firstLoad.current) {
            dispatch(setSpec(spec));
        } else {
            firstLoad.current = false;
        }
    }, []);

    // Register the datasets in the spec and keep in sync as changes are made
    useRegisterDatasets()

    const appSpec = useAppSpec();
    console.log("App spec ", appSpec)

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
                    areas={["nav main"]}
                    columns={[
                        "static-size-900",
                        "calc(100% - static-size-900)"
                    ]}
                    rows={["flex"]}
                    gridArea={"viewer"}
                    height="100%"
                    maxWidth={maxDimensions.width ? `${maxDimensions.width}px` : "100%"}
                    maxHeight={maxDimensions.height ? `${maxDimensions.height}px` : "100%"}
                    margin="0 auto"
                    width="100%"
                    
                >
                    <View gridArea="nav">
                        <MaticoNavBar />
                    </View>
                    <Content gridArea="main">
                        <Switch>
                            {appSpec.pages.map((page: Page, index: number) => (
                                <Route
                                    path={page.path ? page.path : page.name}
                                    key={page.path}
                                >
                                    <MaticoPage
                                        key={page.path}
                                        page={page}
                                        editPath={`pages.${index}`}
                                    />
                                </Route>
                            ))}
                        </Switch>
                    </Content>
                </Grid>
            )}
        </Router>
    );
};
