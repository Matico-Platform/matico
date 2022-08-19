import {
  Flex,
  Heading,
  Grid,
  ActionButton,
  View,
  Divider,
  Text,
} from "@adobe/react-spectrum";
import styled from "styled-components";
import { Icon } from "../Icons/Icon";

export interface TemplateSelectorInterface {
  onSelectTemplate: (template: string) => void;
}

const templates: { title: string; templateSlug: string }[] = [
  {
    title: "Blank",
    templateSlug: "Blank",
  },
  {
    title: "Big Map",
    templateSlug: "BigMap",
  },
  {
    title: "Map With Sidebar",
    templateSlug: "MapWithSidebar",
  },
];
const TemplateCard = styled.div`
  width: calc(25% - 1rem);
  background: red;
  display: inline-block;
  margin: 1rem;
  padding: 1rem;
  background: var(--spectrum-global-color-static-orange-600);
  font-weight: bold;
  transition: 250ms all;
  &:hover {
    background: var(--spectrum-global-color-static-orange-400);
  }
`;

export const TemplateSelector: React.FC<TemplateSelectorInterface> = ({
  onSelectTemplate,
}) => {
  return (
    <Flex id="templates" direction="column" gap="size-500" width="100%">
      <Heading>Get Started With a Template</Heading>
      <View>
        {templates.map((template, i) => (
          <TemplateCard>
            <ActionButton
              key={i}
              onPress={() => onSelectTemplate(template.templateSlug)}
              isQuiet
              width="100%"
              height="auto"
              margin="0"
            >
              <Flex
                direction="column"
                alignContent="center"
                alignItems="center"
                width="100%"
              >
                <Icon icon={template.templateSlug} size="5em" />
                <br />
                <p>{template.title}</p>
              </Flex>
            </ActionButton>
          </TemplateCard>
        ))}
      </View>
      <Divider size="S" />
    </Flex>
  );
};
