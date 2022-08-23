import {
  Flex,
  Heading,
  ActionButton,
  Divider,
  View,
  Text,
} from "@adobe/react-spectrum";
import { App } from "@maticoapp/matico_spec";
import styled from "styled-components";
import { Icon } from "../Icons/Icon";
import Image from "next/image";
import Branch2 from "@spectrum-icons/workflow/Branch2";
import Link from "next/link";
import Preview from "@spectrum-icons/workflow/Preview";

export interface TemplateSelectorInterface {
  onSelectTemplate: (template: string) => void;
  recentApps: App[];
}

const templates: { title: string; templateSlug: string; image: string }[] = [
  {
    title: "Blank",
    templateSlug: "Blank",
    image: "blank.png",
  },
  {
    title: "Big Map",
    templateSlug: "BigMap",
    image: "big_map.png",
  },
  {
    title: "Map With Sidebar",
    templateSlug: "MapWithSidebar",
    image: "map_sidebar.png",
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
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const TemplatesContainer = styled.div`
  flex-grow: 0;
  width: 75%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const TemplatesPopulation = styled.div`
  flex-grow: 0;
  width: 25%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InlineLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.25em;
  margin: 0.125em;
  max-height: 2em;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;
  cursor: pointer;
`;

const InlineAppCard: React.FC<{ app: App & {owner: any, id: string, noViews: number, noForks: number} }> = ({ app }) => {
  return (
    <View
      borderBottomWidth="thin"
      borderBottomColor="static-white"
      marginY="size-100"
      paddingBottom="size-100"
    >
      <Flex direction="row" alignItems="center" justifyContent="space-around" UNSAFE_style={{padding:0}}>
        <View>
          <Text>
            <b>{app.name}</b>
          </Text>
          <br/>
          <Text>{app.owner.name}</Text>
        </View>
        <Flex>
          <Link href={`/apps/${app.id}`}>
            <InlineLink>
              <Preview size="S" />
              <p>{app.noViews}</p>
            </InlineLink>
          </Link>
          <Link href={`/apps/${app.id}`}>
            <InlineLink>
              <Branch2 size="S" />
              <p>{app.noForks}</p>
            </InlineLink>
          </Link>
        </Flex>
      </Flex>
    </View>
  );
};
export const TemplateSelector: React.FC<TemplateSelectorInterface> = ({
  onSelectTemplate,
  recentApps = [],
}) => {
  console.log(recentApps);
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
                  padding: "1em",
                }}
              >
                <Flex
                  direction="column"
                  alignContent="center"
                  alignItems="center"
                  width="100%"
                >
                  <Image src={`/${template.image}`} width={400} height={295} />
                  <br />
                  <p>{template.title}</p>
                </Flex>
              </ActionButton>
            </TemplateCard>
          ))}
        </TemplatesContainer>
        <TemplatesPopulation>
          Or Maybe Some Popular Apps?
          <View
            maxHeight="25vh"
            overflow="none auto"
          >
          <Flex direction="column" flex={1}>
            {recentApps.slice(0,10).map((app: App, i: number) => (
              // @ts-ignore
              <InlineAppCard key={i} app={app} />
            ))}
          </Flex>
          </View>
        </TemplatesPopulation>
      </TemplatesOuter>
      <Divider size="S" />
    </Flex>
  );
};
