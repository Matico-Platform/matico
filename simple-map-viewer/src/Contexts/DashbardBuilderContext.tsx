import React, {
    createContext,
    useReducer,
    useEffect,
    useContext,
} from 'react';
import {
    Dashboard,
    getDashboard,
    BaseMap,
    updateDashboard,
    UpdateDashboardDTO,
    Layer,
    LayerStyle,
} from '../api';
import { useDebouncedEffect } from '../Hooks/useDebounceEffect';

enum ActionType {
    START_LOADING,
    LOADING_DONE,
    SAVING_STARTED,
    SAVING_DONE,
    SET_DASHBOARD,
    SET_ERROR,
    SET_BASEMAP,
    ADD_LAYER,
    SHOW_NEW_LAYER_MODAL,
    HIDE_NEW_LAYER_MODAL,
    UPDATE_LAYER_STYLE,
}

type SET_LOADING_STARTED = {
    type: ActionType.START_LOADING;
};

type UPDATE_LAYER_STYLE = {
    type: ActionType.UPDATE_LAYER_STYLE;
    payload: {
        name: string;
        style: LayerStyle;
    };
};

type SET_LOADING_DONE = {
    type: ActionType.LOADING_DONE;
};

type SHOW_NEW_LAYER_MODAL = {
    type: ActionType.SHOW_NEW_LAYER_MODAL;
};

type HIDE_NEW_LAYER_MODAL = {
    type: ActionType.HIDE_NEW_LAYER_MODAL;
};

type SET_SAVING_STARTED = {
    type: ActionType.SAVING_STARTED;
};

type SET_SAVING_DONE = {
    type: ActionType.SAVING_DONE;
};

type SET_ERROR = {
    type: ActionType.SET_ERROR;
    payload: string;
};

type SET_DASHBOARD = {
    type: ActionType.SET_DASHBOARD;
    payload: Dashboard;
};

type SET_BASEMAP = {
    type: ActionType.SET_BASEMAP;
    payload: BaseMap;
};
type ADD_LAYER = {
    type: ActionType.ADD_LAYER;
    payload: Layer;
};

type DashboardBuilderAction =
    | SET_LOADING_STARTED
    | SET_LOADING_DONE
    | SET_SAVING_STARTED
    | SET_SAVING_DONE
    | SET_ERROR
    | SET_DASHBOARD
    | SET_BASEMAP
    | SHOW_NEW_LAYER_MODAL
    | HIDE_NEW_LAYER_MODAL
    | UPDATE_LAYER_STYLE
    | ADD_LAYER;

interface DashboardBuilderState {
    dashboard: Dashboard | null;
    saving: boolean;
    loading: boolean;
    errors: string[];
    newLayerModalVisible: boolean;
}

const initalState: DashboardBuilderState = {
    dashboard: null,
    saving: false,
    loading: false,
    newLayerModalVisible: false,
    errors: [],
};

const DashboardBuilderContext = createContext<{
    state: DashboardBuilderState;
    dispatch: React.Dispatch<any>;
}>({
    state: initalState,
    dispatch: () => null,
});

const { Provider } = DashboardBuilderContext;

const addLayerToDash = (
    dashboard: Dashboard | null,
    layer: Layer,
) => {
    if (dashboard) {
        const newDash = { ...dashboard };
        newDash.map_style.layers = [
            ...newDash.map_style.layers,
            layer,
        ];
        return newDash;
    } else {
        return null;
    }
};

const updateLayerStyleOnDash = (
    dashboard: Dashboard | null,
    update: { name: string; style: LayerStyle },
) => {
    if (dashboard) {
        const newDash = { ...dashboard };
        const layers = newDash.map_style.layers;

        newDash.map_style.layers = layers.map((l) =>
            l.name == update.name
                ? ({
                      ...l,
                      style: update.style,
                  } as Layer)
                : l,
        );
        return newDash;
    } else {
        return null;
    }
};

const updateBaseMap = (
    dashboard: Dashboard | null,
    baseMap: BaseMap,
) => {
    if (dashboard) {
        const newDash = { ...dashboard };
        newDash.map_style.base_map = baseMap;
        return newDash;
    } else {
        return null;
    }
};

function reducer(
    state: DashboardBuilderState,
    action: DashboardBuilderAction,
) {
    console.info('Running action ', action);
    switch (action.type) {
        case ActionType.ADD_LAYER:
            return {
                ...state,
                dashboard: addLayerToDash(
                    state.dashboard,
                    action.payload,
                ),
            };
        case ActionType.START_LOADING:
            return { ...state, loading: true };
        case ActionType.LOADING_DONE:
            return { ...state, loading: false };
        case ActionType.SAVING_STARTED:
            return { ...state, saving: true };
        case ActionType.SAVING_DONE:
            return { ...state, saving: false };
        case ActionType.SET_ERROR:
            return {
                ...state,
                errors: [...state.errors, action.payload],
            };
        case ActionType.SET_DASHBOARD:
            return { ...state, dashboard: action.payload };
        case ActionType.SET_BASEMAP:
            return {
                ...state,
                dashboard: updateBaseMap(
                    state.dashboard,
                    action.payload,
                ),
            };
        case ActionType.SHOW_NEW_LAYER_MODAL:
            return { ...state, newLayerModalVisible: true };
        case ActionType.HIDE_NEW_LAYER_MODAL:
            return { ...state, newLayerModalVisible: false };
        case ActionType.UPDATE_LAYER_STYLE:
            return {
                ...state,
                dashboard: updateLayerStyleOnDash(
                    state.dashboard,
                    action.payload,
                ),
            };
        default:
            return state;
    }
}

export const useDashboard = () => {
    const { state, dispatch } = useContext(DashboardBuilderContext);

    const updateBaseMap = (baseMap: BaseMap) => {
        dispatch({
            type: ActionType.SET_BASEMAP,
            payload: baseMap,
        });
    };
    const showNewLayerModal = () => {
        dispatch({
            type: ActionType.SHOW_NEW_LAYER_MODAL,
        });
    };
    const hideNewLayerModal = () => {
        dispatch({
            type: ActionType.HIDE_NEW_LAYER_MODAL,
        });
    };
    const updateLayerStyle = (name: string, update: LayerStyle) => {
        dispatch({
            type: ActionType.UPDATE_LAYER_STYLE,
            payload: {
                name,
                style: update,
            },
        });
    };
    const addLayer = (layer: Layer) => {
        dispatch({
            type: ActionType.ADD_LAYER,
            payload: layer,
        });
    };

    return {
        ...state,
        dispatch,
        updateBaseMap,
        addLayer,
        showNewLayerModal,
        hideNewLayerModal,
        updateLayerStyle,
    };
};

export const DashboardBuilderProvider: React.FC<{
    dashboard_id: string | null;
}> = ({ children, dashboard_id }) => {
    const [state, dispatch] = useReducer(reducer, initalState);
    const { dashboard } = state;

    useEffect(() => {
        console.log('State update', state);
    }, [state]);

    const updateDash = (dashboard: Dashboard | null) => {
        if (dashboard) {
            dispatch({
                type: ActionType.SAVING_STARTED,
            });
            const update: UpdateDashboardDTO = {
                map_style: dashboard.map_style,
                name: dashboard.name,
                description: dashboard.description,
                public: dashboard.public,
            };

            updateDashboard(dashboard.id, update)
                // .then((result) => {
                //     dispatch({
                //         type: ActionType.SET_DASHBOARD,
                //         payload: result.data,
                //     });
                // })
                .catch((e) => {
                    dispatch({
                        type: ActionType.SET_ERROR,
                        payload: e.toString(),
                    });
                })
                .finally(() => {
                    dispatch({
                        type: ActionType.SAVING_DONE,
                    });
                });
        }
    };

    useDebouncedEffect(() => updateDash(dashboard), 1000, [
        dashboard,
    ]);

    useEffect(() => {
        if (dashboard_id) {
            dispatch({
                type: ActionType.START_LOADING,
            });

            getDashboard(dashboard_id)
                .then((dashboardResp) => {
                    dispatch({
                        type: ActionType.SET_DASHBOARD,
                        payload: dashboardResp.data,
                    });
                })
                .catch((e) => {
                    dispatch({
                        type: ActionType.SET_ERROR,
                        payload: e.toString(),
                    });
                })
                .finally(() => {
                    dispatch({
                        type: ActionType.LOADING_DONE,
                    });
                });
        }
    }, [dashboard_id]);

    return (
        <Provider value={{ state, dispatch }}>{children}</Provider>
    );
};
