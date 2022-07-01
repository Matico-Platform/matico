import {
  Button,
  Content,
  Flex,
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
import { useDatasetColumns } from "../hooks/useDatasetColumns";
import { useFeature } from "../hooks/useFeature";
import { Source } from "../utils/api";
import {Column} from "@maticoapp/matico_types/api"

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
  const { feature, featureError, updateFeature, mutateFeature } = useFeature(
    source,
    featureId,
    edit
  );

  const [featureUpdates, setFeatureUpdates] = useState({});
  const { columns } = useDatasetColumns(source);

  const discardChanges = () => {
    setFeatureUpdates({});
  };

  const saveChanges = () => {
    updateFeature(featureUpdates);
  };

  useEffect(() => {
    setFeatureUpdates({});
  }, [feature]);

  const fieldForParameter = (column: Column) => {
    const combinedParameters = { ...feature[0], ...featureUpdates };

    if (
      column.colType.includes("INT") ||
      column.colType.includes("FLOAT") ||
      column.colType.includes("NUMERIC")
    ) {
      return (
        <NumberField
          width="size-2400"
          key={column.name}
          label={column.name}
          value={combinedParameters[column.name]}
          onChange={(value) =>
            setFeatureUpdates({ ...featureUpdates, [column.name]: value })
          }
        />
      );
    } else if (column.colType === "VARCHAR") {
      return (
        <TextField
          width="size-2400"
          key={column.name}
          label={column.name}
          value={combinedParameters[column.name]}
          onChange={(value) =>
            setFeatureUpdates({ ...featureUpdates, [column.name]: value })
          }
        />
      );
    }
    return null;
  };

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
      <Flex direction="column" width="100%" height="100%">
        <Header>Edit the selected features properties</Header>
        {columns && feature && (
            <Form width="100%" height="100%">
              <View height="100%" maxHeight="350px" overflow='auto'>
              <Grid
                columns={repeat("auto-fit", "size-2400")}
                autoRows="size-800"
                gap="size-100"
                alignItems="end"
                justifyContent="space-evenly"
              >
                {columns
                  .map((column: any) => fieldForParameter(column))
                  .filter((d) => d)}
                {Object.keys(featureUpdates).length > 0 && (
                  <>
                    <Button
                      gridColumnStart={"-3"}
                      variant="negative"
                      onPress={discardChanges}
                    >
                      Discard Changes
                    </Button>
                    <Button
                      gridColumnStart={"-2"}
                      variant="cta"
                      onPress={saveChanges}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Grid>
            </View>
            </Form>
        )}
      </Flex>
    </Well>
  );
};
