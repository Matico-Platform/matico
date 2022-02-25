import React, { useEffect } from "react";
import { Dashboard } from "@maticoapp/matico_spec";
import { Provider } from "react-redux";
import { store } from "Stores/MaticoStore";
import { VariableState } from "Stores/MaticoVariableSlice";
import {
  MaticoDataProvider,
  MaticoDataState,
} from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoAppPresenter } from "../MaticoAppPresenter/MaticoAppPresenter";
import { Grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes";
import { MaticoEditor } from "../MaticoEditor/MaticoEditor";
import { DatasetProvider } from "Datasets/DatasetProvider";
import {
  Grid,
  defaultTheme,
  darkTheme,
  Provider as SpectrumProvider,
  View,
} from "@adobe/react-spectrum";
import { GeoJSONProvider } from "DatasetsProviders/GeoJSONProvider";
import { CSVProvider } from "DatasetsProviders/CSVProvider";
import { COGProvider } from "DatasetsProviders/COGProvider";

interface MaticoAppInterface {
  spec?: Dashboard;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  onSpecChange?: (data: Dashboard) => void;
  basename?: string;
  editActive?: boolean;
  datasetProviders?: Array<DatasetProvider>;
}

const themeTweaks = {
  button: { default: undefined },
};

export const MaticoApp: React.FC<MaticoAppInterface> = ({
  spec,
  onStateChange,
  basename,
  onDataChange,
  onSpecChange,
  editActive = false,
  datasetProviders = [],
}) => {
  const columns = editActive
    ? {
        L: ["75%", "25%"],
        M: ["70%", "30%"],
        S: ["100%"],
        base: ["100%"],
      }
    : {
        L: ["100%", "0"],
        M: ["100%", "0"],
        S: ["100%"],
        base: ["100%"],
      };

  const rows = editActive
    ? {
        L: "100%",
        M: "100%",
        S: ["60%", "40%"],
        base: ["60%", "40%"],
      }
    : {
        L: "100%",
        M: "100%",
        S: ["100%", "0"],
        base: ["100%", "0"],
      };

  const areas = {
    L: ["viewer editor"],
    M: ["viewer editor"],
    S: ["viewer", "editor"],
    base: ["viewer", "editor"],
  };

  return (
    <Provider store={store}>
      <MaticoDataProvider onStateChange={onDataChange}>
        <Grommet
          theme={deepMerge(themeTweaks, grommet)}
          style={{ width: "100%", height: "100%" }}
        >
          <SpectrumProvider theme={darkTheme} width="100%" height="100%">
            <Grid {...{ columns, rows, areas }} height="100%" gap="0">
              <View gridArea="viewer" width="100%">
                <MaticoAppPresenter
                  spec={spec}
                  basename={basename}
                  onStateChange={onStateChange}
                />
              </View>
              <View gridArea="editor" width="100%">
                <MaticoEditor
                  datasetProviders={[
                    CSVProvider,
                    GeoJSONProvider,
                    COGProvider,
                    ...datasetProviders,
                  ]}
                  editActive={editActive}
                  onSpecChange={onSpecChange}
                />
              </View>
            </Grid>
          </SpectrumProvider>
        </Grommet>
      </MaticoDataProvider>
    </Provider>
  );
};
