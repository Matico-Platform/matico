import {
  Button,
  Content,
  Form,
  Grid,
  Header,
  Heading,
  IllustratedMessage,
  NumberField,
  repeat,
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { useEffect, useState } from "react";
import { useFeature } from "../hooks/useFeature";
import { Source } from "../utils/api";

interface FeatureEditorProps {
  source: Source | null;
  featureId: string | number | null;
  edit: boolean;
}

export const FeatureEditor: React.FC<FeatureEditorProps> = ({
  source,
  featureId,
  edit,
}) => {
  const { feature, featureError, updateFeature , mutateFeature} = useFeature(
    source,
    featureId,
    edit
  );

  const [featureUpdates, setFeatureUpdates] = useState(feature);

  useEffect(() => {
    setFeatureUpdates(feature ? feature[0] : null);
  }, [feature]);

  const discardChanges = ()=>{
    setFeatureUpdates(feature ? feature[0] : null);
  }

  const saveChanges  = ()=>{
    updateFeature(featureUpdates)
  }


  const fieldForParameter= (parameter:any)=>{
    switch (typeof(parameter)){
      case "string":
          return <TextField
                key={parameter}
                label={parameter}
                value={featureUpdates[parameter]}
                onChange={(value) =>
                  setFeatureUpdates({ ...featureUpdates, [parameter]: value })
                }
              />
      case "number":
          return <NumberField
                key={parameter}
                label={parameter}
                value={featureUpdates[parameter]}
                onChange={(value) =>
                  setFeatureUpdates({ ...featureUpdates, [parameter]: value })
                }
              />
            default:
              return null
      
    }
  }

  if (!featureId) {
    return (
      <IllustratedMessage>
        <NotFound />
        <Heading>No feature selected</Heading>
        <Content>
          Select a table row or click on map feature to view or edit
        </Content>
      </IllustratedMessage>
    );
  }

  if (!feature) {
    return (
      <IllustratedMessage>
        <NotFound />
        <Heading>Failed to find feature</Heading>
        <Content>
          Someone else may have deleted it or there may be something wrong with
          our server
        </Content>
      </IllustratedMessage>
    );
  }

  return (
    <Well width="100%" height="100%">
      <Header>Edit the selected features properties</Header>
      {featureUpdates && (
        <Form>
          <Grid
            columns={repeat("auto-fit", "size-2400")}
            autoRows="size-800"
            gap="size-100"
            alignItems="end"
          >
            {Object.keys(feature[0]).map((parameter: string) => fieldForParameter(parameter)).filter(d=>d)}
            {JSON.stringify(featureUpdates) !== JSON.stringify(feature[0]) && (
              <>
                <Button gridColumnStart={"-2"} variant="negative" onPress={discardChanges}>
                  Discard Changes
                </Button>
                <Button gridColumnStart={"-1"} variant="cta" onPress={saveChanges}>
                  Save Changes
                </Button>
              </>
            )}
          </Grid>
        </Form>
      )}
    </Well>
  );
};
