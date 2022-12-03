import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { MaticoPage } from "../MaticoPage/MaticoPage";
import { MaticoDataState } from "../../Contexts/MaticoDataContext/MaticoDataContext";

import { VariableState } from "../../Stores/MaticoVariableSlice";
import { MaticoNavBar } from "../MaticoNavBar/MaticoNavBar";
import { setSpec } from "../../Stores/MaticoSpecSlice";
import { useMaticoSelector, useMaticoDispatch } from "../../Hooks/redux";
import { Content, Grid, View } from "@adobe/react-spectrum";
import { App, Page } from "@maticoapp/matico_types/spec";

import _ from "lodash";
import { useRegisterDatasets } from "Hooks/useRegisterDatasets";
import { useApp } from "Hooks/useApp";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useNormalizedSpecSelector } from "Hooks/useNormalizedSpecSelector";
import { handleDrag } from "Utils/dragAndResize/handleDrag";
import {
    Active,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { coordinateGetter } from "Components/MaticoEditor/EditorComponents/SortableDraggableList/multipleContainersKeyboardCoordinates";
import { layoutCollisionDetection } from "Components/MaticoEditor/Panes/MaticoOutlineViewer/CollisionDetection";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { DragEndEvent } from "@react-types/shared";
import { setActiveDragItem } from "Stores/editorSlice";

interface MaticoAppPresenterProps {
    spec?: App;
    basename?: string;
    onStateChange?: (state: VariableState) => void;
    onDataChange?: (data: MaticoDataState) => void;
    maxDimensions?: {
        height: number | null;
        width: number | null;
    };
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

    useNormalizeSpec();

    // Register the datasets in the spec and keep in sync as changes are made
    useRegisterDatasets();

    const pages = useNormalizedSpecSelector((spec) => spec?.pages);

    // const appState = useMaticoSelector((state) => state.variables);

    //  useEffect(() => {
    //      if (onStateChange) {
    //          onStateChange(appState);
    //      }
    //  }, [onStateChange, JSON.stringify(appState)]);

    const { reparentPane, changePaneIndex, updatePageIndex } = useApp();

    const handleDragStart = ({ active }: { active: Active }): void => {
        // dispatch(setActiveDragItem(active))
    };

    const handleDragEnd = (event: DragEndEvent) => {
        handleDrag(event, true, updatePageIndex, reparentPane, changePaneIndex);
    };

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter
        })
    );
    return (
        <>
            {pages && (
                <Grid
                    areas={["nav main"]}
                    columns={[
                        "static-size-900",
                        "calc(100% - static-size-900)"
                    ]}
                    rows={["flex"]}
                    gridArea={"viewer"}
                    height="100%"
                    maxWidth={
                        maxDimensions.width
                            ? `${maxDimensions.width}px`
                            : "100%"
                    }
                    maxHeight={
                        maxDimensions.height
                            ? `${maxDimensions.height}px`
                            : "100%"
                    }
                    margin="0 auto"
                    width="100%"
                >
                    <View gridArea="nav">
                        <MaticoNavBar />
                    </View>
                    <Content gridArea="main">
                        <Switch>
                            {pages.map(
                                (page: Page, index: number) =>
                                    !!page?.id && (
                                        <Route
                                            path={
                                                page.path
                                                    ? page.path
                                                    : page.name
                                            }
                                            key={page.path}
                                            exact={true}
                                        >
                                            <DndContext
                                                // @ts-ignore
                                                onDragStart={handleDragStart}
                                                onDragEnd={handleDragEnd}
                                                // onDragOver={handleDragOver}
                                                collisionDetection={
                                                    layoutCollisionDetection
                                                }
                                                sensors={sensors}
                                                modifiers={[
                                                    restrictToWindowEdges
                                                ]}
                                            >
                                                <MaticoPage
                                                    key={page.path}
                                                    pageId={page.id}
                                                />
                                            </DndContext>
                                        </Route>
                                    )
                            )}
                        </Switch>
                    </Content>
                </Grid>
            )}
            {/* </Router> */}
        </>
    );
};
