import {
  Content,
  Form,
  Grid,
  Heading,
  IllustratedMessage,
  repeat,
  TextField,
  View,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
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
  const { feature, featureError, updateFeature } = useFeature(
    source,
    featureId,
    edit
  );

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
    <View>
      <Form>
        <Grid
          columns={repeat("auto-fit", "size-2400")}
          autoRows="size-800"
          gap="size-100"
        >
          {Object.keys(feature[0]).map((parameter: string) => (
            <TextField
              key={parameter}
              label={parameter}
              defaultValue={feature[0][parameter]}
            />
          ))}
        </Grid>
      </Form>
    </View>
  );
};
