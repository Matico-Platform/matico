import { Ace } from "ace-builds";
import React from  'react'
import { Heading } from "grommet";

export const SectionHeading: React.FC = ({ children }) =>(
  <Heading fill={true} textAlign={"start"} level={3}>
    {children}
  </Heading>
);
export function json_error_to_annotation(error: string) {
  const rg = /(.*)at line (\d+) column (\d+)/;
  const parts = error.match(rg);
  if (parts) {
    return [
      {
        row: parseInt(parts[2]) - 1,
        column: parseInt(parts[3]) - 1,
        type: "error",
        text: parts[1],
      },
    ] as Ace.Annotation[];
  }
  return [] as Ace.Annotation[];
}
