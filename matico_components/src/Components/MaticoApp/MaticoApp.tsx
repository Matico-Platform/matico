import React, { useEffect } from "react";
import { Dashboard } from "matico_spec";
import { Provider } from "react-redux";
import { store, VariableState } from "../../Stores/MaticoStore";

import {
  MaticoDataProvider,
  MaticoDataState,
} from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoAppPresenter } from "../MaticoAppPresenter/MaticoAppPresenter";
import { Grid, Grommet } from "grommet";
import {MaticoEditor} from "../MaticoEditor/MaticoEditor";

interface MaticoAppInterface {
  spec?: Dashboard;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  basename?: string;
  editActive?: boolean;
}

export const MaticoApp: React.FC<MaticoAppInterface> = ({
  spec,
  onStateChange,
  basename,
  onDataChange,
  editActive = false,
}) => {
  return (
    <Provider store={store}>
      <MaticoDataProvider onStateChange={onDataChange} datasets={spec.datasets}>
        <Grommet style={{ width: "100%", height: "100%" }}>
          <Grid
            fill
            columns={["large", "flex"]}
            rows={["flex"]}
            areas={[["editor", "viewer"]]}
          >
            <MaticoEditor editActive={editActive} />
            <MaticoAppPresenter
              spec={spec}
              basename={basename}
              onStateChange={onStateChange}
            />
          </Grid>
        </Grommet>
      </MaticoDataProvider>
    </Provider>
  );
};
