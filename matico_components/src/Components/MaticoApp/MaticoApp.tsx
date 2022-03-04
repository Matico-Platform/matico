import React  from "react";
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
import { SocrataDatasetProvider} from "DatasetsProviders/SocrataProvider/SocrataProvider";

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
        XL: ["80%", "20%"],
        L: ["70%", "30%"],
        M: ["70%", "30%"],
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
          <Grid {...{ columns, rows, areas }} width="100%" height="100%" gap="0">
            <View gridArea="viewer" width="100%">
              <MaticoAppPresenter
                spec={spec}
                basename={basename}
                onStateChange={onStateChange}
              />
            </View>
            {editActive && (
              <View gridArea="editor" padding="size-200">
                <MaticoEditor
                  datasetProviders={[
                    CSVProvider,
                    GeoJSONProvider,
                    COGProvider,
                    SocrataDatasetProvider,
                    ...datasetProviders,
                  ]}
                  editActive={editActive}
                  onSpecChange={onSpecChange}
                />
              </View>
            )}
          </Grid>
        </SpectrumProvider>
      </MaticoDataProvider>
    </Provider>
  );
};
