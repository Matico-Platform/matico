import {
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Item,
  ListBox,
  TextField,
  Picker,
  View,
  Text,
  ActionButton,
  NumberField,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import React, { Key } from "react";

interface VariableEditorProps {
  parameters: Array<any>;
  onParametersChanged: (newParams: Array<any>) => void;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({
  parameters,
  onParametersChanged,
}) => {

  const updateParameterValue = (
    name: string,
    change: { [value: string]: any }
  ) => {
    const newParams = parameters.map((p) => 
        p.name === name ? { ...p, ...change } : p
    )
    onParametersChanged(
      newParams
    );
  };

  const removeVar= (name:string)=>{
    onParametersChanged(
      parameters.filter(p=>p.name!==name)
    )
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      height={"100%"}
      direction={"column"}
    >
      {!parameters || parameters?.length === 0 ? (
        <IllustratedMessage>
          <NotFound />
          <Content>Add variables here or add them to your query</Content>
        </IllustratedMessage>
      ) : (
        <>
          <Heading>Variables</Heading>
          <Flex flex={1} direction="column">
            {parameters.map((p) => (
              <Flex
                key={p.name}
                direction="row"
                justifyContent="space-between"
                gap={"size-200"}
                alignItems="end"
              >
                <Text>{p.name}</Text>
                <Picker
                  label="Variable Type"
                  selectedKey={p.type as Key}
                  width={"size-1600"}
                  onSelectionChange={(type) =>
                    updateParameterValue(p.name, { type: type as string })
                  }
                >
                  <Item key="Numerical">Numerical</Item>
                  <Item key="Text">Text</Item>
                </Picker>
                <NumberField
                  label="Default Value"
                  value={Object.values(p.default_value)[0] as number}
                  onChange={(default_value) =>
                    updateParameterValue(p.name, { default_value: {Numeric:default_value}})
                  }
                  step={0.01}
                  width={"size-900"}
                />
                <NumberField
                  label="Value"
                  value={p.value ?? Object.values(p.default_value)[0]}
                  onChange={(value) =>
                    updateParameterValue(p.name, { value})
                  }
                  formatOptions={{
                    minimumFractionDigits:3
                  }}
                  step={0.01}

                  width={"size-900"}
                />
                  <ActionButton onPress={()=>removeVar(p.name)}>Delete</ActionButton>
              </Flex>
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
};
