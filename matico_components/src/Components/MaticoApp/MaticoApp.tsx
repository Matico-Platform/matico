import React from "react";
import { Dashboard } from "@maticoapp/matico_spec";
import { Provider } from "react-redux";
import { store } from "Stores/MaticoStore";
import { VariableState } from "Stores/MaticoVariableSlice";
import {
  MaticoDataProvider,
  MaticoDataState,
} from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoAppPresenter } from "../MaticoAppPresenter/MaticoAppPresenter";
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
import { SocrataDatasetProvider } from "DatasetsProviders/SocrataProvider/SocrataProvider";
import { ComputeProvider } from "DatasetsProviders/ComputeProvider";

import "@fortawesome/fontawesome-free/css/all.min.css";
import styled from "styled-components";

const GlobalSpectrumOverrides = styled.span`
  button span {
    text-align: inherit !important;
  }
`

interface MaticoAppInterface {
  spec?: Dashboard;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  onSpecChange?: (data: Dashboard) => void;
  basename?: string;
  editActive?: boolean;
  datasetProviders?: Array<DatasetProvider>;
}

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
      XL: ["calc(100% - 25em)", "25em"],
      L: ["calc(100% - 25em)", "25em"],
      M: ["calc(100% - 15em)", "15em"],
      S: ["100%"],
      base: ["100%"],
    }
    : {
      XL: ["100%"],
      L: ["100%"],
      M: ["100%"],
      S: ["100%"],
      base: ["100%"],
    };

  const rows = editActive
    ? {
      XL: "100%",
      L: "100%",
      M: "100%",
      S: ["60%", "40%"],
      base: ["60%", "40%"],
    }
    : {
      XL: "100%",
      L: "100%",
      M: "100%",
      S: "100%",
      base: "100%",
    };

  const areas = editActive
    ? {
      XL: ["viewer editor"],
      L: ["viewer editor"],
      M: ["viewer editor"],
      S: ["viewer", "editor"],
      base: ["viewer", "editor"],
    }
    : {
      XL: ["viewer"],
      L: ["viewer"],
      M: ["viewer"],
      S: ["viewer"],
      base: ["viewer"],
    };

  return (
    <Provider store={store}>
      <MaticoDataProvider onStateChange={onDataChange}>
        <SpectrumProvider theme={darkTheme} width="100%" height="100%">
          <GlobalSpectrumOverrides>
            <Grid {...{ columns, rows, areas }} width="100%" height="100%" gap="0">
              <View gridArea="viewer" width="100%" overflow="hidden">
                <MaticoAppPresenter
                  spec={spec}
                  basename={basename}
                  onStateChange={onStateChange}
                />
              </View>
              {editActive && (
                <View gridArea="editor">
                  <MaticoEditor
                    datasetProviders={[
                      CSVProvider,
                      GeoJSONProvider,
                      COGProvider,
                      // @ts-ignore
                      SocrataDatasetProvider,
                      ComputeProvider,
                      ...datasetProviders,
                    ]}
                    editActive={editActive}
                    onSpecChange={onSpecChange}
                  />
                </View>
              )}
            </Grid>
          </GlobalSpectrumOverrides>
        </SpectrumProvider>
      </MaticoDataProvider>
    </Provider>
  );
};
