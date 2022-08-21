import {
  Flex,
  Heading,
  ActionButton,
  Divider,
} from "@adobe/react-spectrum";
import { App } from "@maticoapp/matico_spec";
import styled from "styled-components";
import { Icon } from "../Icons/Icon";

export interface TemplateSelectorInterface {
  onSelectTemplate: (template: string) => void;
  recentApps: App[];
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
  display: inline-block;
  margin: 1rem;
  padding: 0;
  /* background: var(--spectrum-global-color-static-orange-600); */
  font-weight: bold;
  transition: 250ms all;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid var(--spectrum-global-color-static-orange-400);
  }
`;
const TemplatesOuter = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px){
    flex-direction: column;
  }
`
const TemplatesContainer = styled.div`
  flex-grow:0;
  width:75%;
  @media (max-width: 768px){
    width:100%;
  }
`
const TemplatesPopulation = styled.div`
  flex-grow:0;
  width:25%;
  @media (max-width: 768px){
    width:100%;
  }
`
const InlineAppCard: React.FC<{app: App}> = ({app}) => {
  return <div>
    {app.name}
  </div>
}
export const TemplateSelector: React.FC<TemplateSelectorInterface> = ({
  onSelectTemplate,
  recentApps=[]
}) => {
  return (
    <Flex id="templates" direction="column" gap="size-500" width="100%">
      <Heading>Get Started With a Template</Heading>
      <TemplatesOuter>
      <TemplatesContainer>
        {templates.map((template, i) => (
          <TemplateCard key={template.templateSlug}>
            <ActionButton
              key={i}
              onPress={() => onSelectTemplate(template.templateSlug)}
              isQuiet
              width="100%"
              height="auto"
              margin="0"
              UNSAFE_style={{
                padding:'1em'
              }}
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
      </TemplatesContainer>
      <TemplatesPopulation>
        Or Maybe Some Popular Apps?
        <Flex direction="column" flex={1}>
          {recentApps.map((app: App, i: number) => (
            <InlineAppCard key={i} app={app} />
          ))}
        </Flex>
      </TemplatesPopulation>
      </TemplatesOuter>
      <Divider size="S" />
    </Flex>
  );
};
