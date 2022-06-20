import { Flex, Heading, TextField, Text, Well } from "@adobe/react-spectrum";
import React from "react";

interface LabelEditorProps {
  labels: { [labelName: string]: string };
  onUpdateLabels: (change: { [labelName: string]: string }) => void;
}

export const LabelEditor: React.FC<LabelEditorProps> = ({
  labels,
  onUpdateLabels,
}) => {
  return (
    <Flex direction="column">
      <Text>Labels</Text>
      <TextField
        width="100%"
        label="title"
        value={labels?.title}
        onChange={(title) => onUpdateLabels({ title })}
      />
      <TextField
        width="100%"
        label="Subtitle"
        value={labels?.sub_title}
        onChange={(sub_title) => onUpdateLabels({ sub_title })}
      />
      <TextField
        width="100%"
        label="attribution"
        value={labels?.attribution}
        onChange={(attribution) => onUpdateLabels({ attribution })}
      />
      <TextField
        width="100%"
        label="X Label"
        value={labels?.x_label}
        onChange={(x_label) => onUpdateLabels({ x_label })}
      />
      <TextField
        width="100%"
        label="Y Label"
        value={labels?.y_label}
        onChange={(y_label) => onUpdateLabels({ y_label })}
      />
    </Flex>
  );
};
