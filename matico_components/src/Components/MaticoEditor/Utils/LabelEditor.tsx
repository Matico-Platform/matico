import { Flex, Heading, TextField, Well } from "@adobe/react-spectrum";
import { Labels } from "@maticoapp/matico_types/spec";
import React from "react";

interface LabelEditorProps {
    labels: Labels;
    onUpdateLabels: (change: Partial<Labels>) => void;
}

export const LabelEditor: React.FC<LabelEditorProps> = ({
    labels,
    onUpdateLabels
}) => {
    return (
        <Well>
            <Heading>Labels</Heading>
            <Flex direction="column">
                <TextField
                    width="100%"
                    label="title"
                    value={labels?.title}
                    onChange={(title) => onUpdateLabels({ title })}
                />
                <TextField
                    width="100%"
                    label="Subtitle"
                    value={labels?.subTitle}
                    onChange={(subTitle) => onUpdateLabels({ subTitle })}
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
                    value={labels?.xLabel}
                    onChange={(xLabel) => onUpdateLabels({ xLabel })}
                />
                <TextField
                    width="100%"
                    label="Y Label"
                    value={labels?.yLabel}
                    onChange={(yLabel) => onUpdateLabels({ yLabel })}
                />
            </Flex>
        </Well>
    );
};
