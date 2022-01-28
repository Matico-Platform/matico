import {
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Item,
  ListBox,
  View,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import React from "react";

interface VariableEditorProps {
  api: any;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({ api }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      height={"100%"}
    >
      {api.variables ? (
        <>
          <Heading>Variables</Heading>
          <ListBox>
            {api.variables.map((variable: any) => (
              <Item key={variable.name}>{variable.name}</Item>
            ))}
          </ListBox>
        </>
      ) : (
        <IllustratedMessage>
          <NotFound />
          <Content>Add variables here or add them to your query</Content>
        </IllustratedMessage>
      )}
    </Flex>
  );
};
