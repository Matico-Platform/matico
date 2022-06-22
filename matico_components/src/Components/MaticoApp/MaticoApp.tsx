import React, {useState} from "react";
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
  Flex,
  Button,
  ButtonGroup,
  ActionGroup,
  Item,
  Divider,
} from "@adobe/react-spectrum";
import { GeoJSONProvider } from "DatasetsProviders/GeoJSONProvider";
import { CSVProvider } from "DatasetsProviders/CSVProvider";
import { COGProvider } from "DatasetsProviders/COGProvider";
import {App} from "@maticoapp/matico_types/spec"

import { SocrataDatasetProvider} from "DatasetsProviders/SocrataProvider/SocrataProvider";
import { ComputeProvider } from "DatasetsProviders/ComputeProvider"

import "@fortawesome/fontawesome-free/css/all.min.css";
import Visibility from '@spectrum-icons/workflow/Visibility';
import VisibilityOff from '@spectrum-icons/workflow/VisibilityOff';
import DeviceDesktop from '@spectrum-icons/workflow/DeviceDesktop';
import DeviceTablet from '@spectrum-icons/workflow/DeviceTablet';
import DevicePhone from '@spectrum-icons/workflow/DevicePhone';
import { NavigatorBar } from "Components/MaticoEditor/EditorComponents/NavigatorBar";

interface ResponsiveScreeenLimits {
  height: null | number;
  width: null | number;
}

const RESPONSIVE_SCREEN_LIMITS = {
  desktop: {
    width: null,
    height: null
  },
  tablet: {
    height: 1024,
    width: 768
  },
  mobile: {
    width: 400,
    height: 700
  }
} as {
  [key: string]: ResponsiveScreeenLimits;
}

interface MaticoAppInterface {
  spec?: App;
  onStateChange?: (state: VariableState) => void;
  onDataChange?: (data: MaticoDataState) => void;
  onSpecChange?: (data: App) => void;
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
  const [responsiveViewportLimit, setResponsiveViewportLimit] = useState<string>('desktop');
  const [manualShowEditor, setManualShowEditor] = useState<boolean>(true);
  // secondary state to show and hide sidebars
  const showEditor = editActive && manualShowEditor

  const columns = showEditor
    ? {
      XL: ['4em', "calc(100% - 29em)", "25em"],
      L: ['4em', "calc(100% - 29em)", "25em"],
      M: ['4em', "calc(100% - 19em)", "15em"],
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

  const rows = showEditor
    ? {
      XL: "100%",
      L: "100%",
      M: "100%",
      S: ['2em', "calc(60% - 2em)", "40%"],
      base: ['2em', "calc(60% - 2em)", "40%"],
    }
    : {
      XL: "100%",
      L: "100%",
      M: "100%",
      S: "100%",
      base: "100%",
    };

  const areas = showEditor
    ? {
      XL: ["navigator viewer editor"],
      L: ["navigator viewer editor"],
      M: ["navigator viewer editor"],
      S: ['navigator', "viewer", "editor"],
      base: ['navigator', "viewer", "editor"],
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

            {showEditor && <View gridArea="navigator">
              <NavigatorBar 
                datasetProviders={[
                    CSVProvider,
                    GeoJSONProvider,
                    COGProvider,
                    // @ts-ignore
                    SocrataDatasetProvider,
                    ComputeProvider,
                    ...datasetProviders,
                  ]}
              />
            </View>}
            <View gridArea="viewer" width="100%" overflow="hidden">
              <Flex
                width="100%"
                height="100%"
                direction="column"
              >
                {editActive && <Flex
                  direction="row"
                  justifyContent="center"
                  margin="size-100"
                >
                  {/* @ts-ignore */}
                  <ActionGroup onAction={setResponsiveViewportLimit}>
                    <Item key='desktop'>
                      <DeviceDesktop size="S" />
                    </Item>
                    <Item key='tablet'>
                      <DeviceTablet size="S" />
                    </Item>
                    <Item key='mobile'>
                      <DevicePhone size="S" />
                    </Item>
                  </ActionGroup>
                  <Divider orientation="vertical" height="100%" size="M" marginStart="size-200" />
                  <Button
                    variant="secondary"
                    isQuiet
                    onPress={() => setManualShowEditor(prev => !prev)}
                  >
                    {manualShowEditor ? <>
                      <Visibility size="S" marginEnd="size-100" />
                      Hide Editor
                    </> : <>
                      <VisibilityOff size="S" marginEnd="size-100" />
                      Show Editor
                    </>
                    }
                  </Button>
                </Flex>}
                <MaticoAppPresenter
                  spec={spec}
                  basename={basename}
                  onStateChange={onStateChange}
                  maxDimensions={RESPONSIVE_SCREEN_LIMITS[responsiveViewportLimit]}
                />
              </Flex>
            </View>
            {showEditor && (
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
                  editActive={showEditor}
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
