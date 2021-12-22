import React, { useReducer, createContext, useEffect } from "react";
import { Dataset, DatasetState } from "../../Datasets/Dataset";
import { GeoJSONBuilder } from "../../Datasets/GeoJSONBuilder";
import { CSVBuilder } from "../../Datasets/CSVBuilder";
import { useMaticoSelector } from "../../Hooks/redux";

export enum MaticoDataActionType {
  REGISTER_DATASET,
  UPDATE_DATASET_STATE,
}

type RegisterDataset = {
  type: MaticoDataActionType.REGISTER_DATASET;
  payload: Dataset;
};

type UpdateDatasetState = {
  type: MaticoDataActionType.UPDATE_DATASET_STATE;
  payload: {
    datasetName: string;
    state: DatasetState;
  };
};

export type MaticoDataAction = RegisterDataset | UpdateDatasetState;

export interface MaticoDataState {
  datasets: Array<Dataset>;
  datasetStates: { [datasetName: string]: DatasetState };
}

const InitalState: MaticoDataState = {
  datasets: [],
  datasetStates: {},
};

export const MaticoDataContext = createContext<{
  state: MaticoDataState;
  dispatch: React.Dispatch<MaticoDataAction>;
  registerDataset: (dataset: Dataset) => void;
}>({
  state: InitalState,
  dispatch: () => null,
  registerDataset: () => null,
});

function reducer(
  state: MaticoDataState,
  action: MaticoDataAction
): MaticoDataState {
  const { type } = action;

  switch (type) {
    case MaticoDataActionType.REGISTER_DATASET:
      return { ...state, datasets: [...state.datasets, action.payload] };
    case MaticoDataActionType.UPDATE_DATASET_STATE:
      return {
        ...state,
        datasetStates: {
          ...state.datasetStates,
          [action.payload.datasetName]: action.payload.state,
        },
      };
    default:
      return state;
  }
}

//TODO properly type and handle different dataset types
export const MaticoDataProvider: React.FC<{
  onStateChange?: (state: MaticoDataState) => void;
}> = ({ children, onStateChange }) => {
  const [state, dispatch] = useReducer(reducer, InitalState);

  const datasets = useMaticoSelector(
    (state) => state.spec?.spec?.datasets || []
  );

  const registerDataset = (dataset: Dataset) => {
    if (state.datasets.find((d) => (d.name = dataset.name))) {
      return;
    }

    dispatch({
      type: MaticoDataActionType.REGISTER_DATASET,
      payload: dataset,
    });
  };

  useEffect(() => {
    datasets.forEach((dataset: any) => {
      if (
        Object.keys(state.datasetStates).find(
          (d) => d === (Object.values(dataset)[0] as Dataset).name
        )
      ) {
        return;
      }
      if (dataset.GeoJSON) {
        dispatch({
          type: MaticoDataActionType.UPDATE_DATASET_STATE,
          payload: {
            datasetName: dataset.GeoJSON.name,
            state: DatasetState.LOADING,
          },
        });
        GeoJSONBuilder(dataset.GeoJSON).then((dataset: Dataset) => {
          registerDataset(dataset);
          dispatch({
            type: MaticoDataActionType.UPDATE_DATASET_STATE,
            payload: { datasetName: dataset.name, state: DatasetState.READY },
          });
        });
      } else if (dataset.CSV) {
        dispatch({
          type: MaticoDataActionType.UPDATE_DATASET_STATE,
          payload: {
            datasetName: dataset.CSV.name,
            state: DatasetState.LOADING,
          },
        });
        CSVBuilder(dataset.CSV).then((dataset) => {
          registerDataset(dataset);
          dispatch({
            type: MaticoDataActionType.UPDATE_DATASET_STATE,
            payload: { datasetName: dataset.name, state: DatasetState.READY },
          });
        });
      }
    });
  }, [JSON.stringify(datasets)]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state]);

  return (
    <MaticoDataContext.Provider value={{ state, dispatch, registerDataset }}>
      {children}
    </MaticoDataContext.Provider>
  );
};
