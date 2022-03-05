import React from "react";
import {
  Picker,
  Section,
  Item,
  ActionButton,
  Dialog,
  DialogTrigger,
  Content,
  Heading,
} from "@adobe/react-spectrum";
import { useMaticoSelector } from "Hooks/redux";

interface VariableSelectorProps {
  variable?: string;
  onSelectVariable: (variable: string) => void;
}
export const VariableSelector: React.FC<VariableSelectorProps> = ({
  variable,
  onSelectVariable,
}) => {
  const state = useMaticoSelector((state) => state.variables.autoVariables);

  console.log("State ", state);
  const mappedState = Object.keys(state).reduce((agg, variableName) => {
    const variable = state[variableName];
    if (variable.value) {
      agg.push({
        name: variableName,
        items: Object.keys(variable.value).map((attrName) => ({
          name: attrName,
          path: `${variableName}.${attrName}`,
        })),
      });
    }

    return agg;
  }, []);

  console.log("Mapped State ", mappedState);
  return (
    <DialogTrigger type="popover" isDismissable={true}>
      <ActionButton>
        {variable ? variable : "Select filter variable"}
      </ActionButton>
      {(close) => (
        <Dialog>
          <Content>
            <Heading>Variable</Heading>
            <Picker
              items={mappedState}
              onSelectionChange={onSelectVariable}
              selectedKey={variable}
              width="100%"
            >
              {(section) => (
                <Section
                  key={section.name}
                  items={section.items}
                  title={section.name}
                >
                  {(variable) => (
                    <Item key={variable.path}>{variable.name}</Item>
                  )}
                </Section>
              )}
            </Picker>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};
