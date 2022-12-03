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
import React from "react";
import { NewMapModal } from "../NewAppModal/NewAppModal";

export type NewAppArgs = {
  template: string;
  name: string;
  description: string;
  public: boolean;
};
export interface TemplateSelectorInterface {
  onSelectTemplate: (args: NewAppArgs) => void;
  recentApps: App[];
}

export type Template = { title: string; templateSlug: string; image: string };

const templates: Array<Template> = [
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

const InlineAppCard: React.FC<{
  app: App & { owner: any; id: string; noViews: number; noForks: number };
}> = ({ app }) => {
  return (
    <View
      borderBottomWidth="thin"
      borderBottomColor="static-white"
      marginY="size-100"
      paddingBottom="size-100"
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        UNSAFE_style={{ padding: 0 }}
      >
        <View>
          <Text>
            <b>{app.name}</b>
          </Text>
          <br />
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
  return (
    <Flex id="templates" direction="column" gap="size-500" width="100%">
      <Heading>Get Started With a Template</Heading>
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="row" justifyContent="space-around" gap="size-200">
          {templates.map((template, i) => (
            <NewMapModal
              template={template}
              onSelectTemplate={onSelectTemplate}
            />
          ))}
        </Flex>
        <Flex direction="column" gap="size-200">
          Or Maybe Some Popular Apps?
          <View maxHeight="25vh" overflow="none auto">
            <Flex direction="column" flex={1}>
              {recentApps.slice(0, 10).map((app: App, i: number) => (
                // @ts-ignore
                <InlineAppCard key={i} app={app} />
              ))}
            </Flex>
          </View>
        </Flex>
      </Flex>
      <Divider size="S" />
    </Flex>
  );
};
