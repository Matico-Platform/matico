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
  parameters: Array<any>;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({ parameters}) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      height={"100%"}
    >
      {parameters?.length>0 ?
        <IllustratedMessage>
          <NotFound />
          <Content>Add variables here or add them to your query</Content>
        </IllustratedMessage>
        :
        <>
          <Heading>Variables</Heading>
          <ListBox>
            {parameters.map((variable: any) => (
              <Item key={variable.name}>{variable.name}</Item>
            ))}
          </ListBox>
        </>
      }
    </Flex>
  );
};
