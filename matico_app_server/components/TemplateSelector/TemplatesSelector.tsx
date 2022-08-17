import {
  Flex,
  Heading,
  Grid,
  ActionButton,
  View,
  Divider,
  Text
} from "@adobe/react-spectrum";

export interface TemplateSelectorInterface {
  onSelectTemplate: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorInterface> = ({
  onSelectTemplate,
}) => {
  return (
    <Flex id="templates" direction="column" gap="size-500" width="100%">
      <Heading>Get Started With a Template</Heading>
      <Grid
        rows={["1fr", "1fr"]}
        columns={["1fr", "1fr", "1fr"]}
        columnGap="size-500"
        flex={1}
        maxHeight="450px"
      >
        <ActionButton
          width="200px"
          height="200px"
          onPress={() => onSelectTemplate("Blank")}
        >
          <View>
            <Text>Blank</Text>
          </View>
        </ActionButton>
        <ActionButton
          width="200px"
          height="200px"
          onPress={() => onSelectTemplate("BigMap")}
        >
          <View>
            <Text>Big Map</Text>
          </View>
        </ActionButton>
        <ActionButton
          width="200px"
          height="200px"
          onPress={() => onSelectTemplate("MapWithSideBar")}
        >
          <View>
            <Text>Map With Sidebar</Text>
          </View>
        </ActionButton>
        <ActionButton
          width="200px"
          height="200px"
          onPress={() => onSelectTemplate("Scrollytelling")}
        >
          <View>
            <Text>Scrollytelling</Text>
          </View>
        </ActionButton>
      </Grid>
      <Divider size="S" />
    </Flex>
  );
};
