import {
    Flex,
    TextField,
    Button,
    Text,
    NumberField
} from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import { useAnalysis } from "Hooks/useAnalysis";
import React, { useEffect, useState } from "react";

const ParameterInput: React.FC<{
    name: string;
    options: any;
    value: any;
    onChange: (key: string, value: any) => void;
}> = ({ name, options, value, onChange }) => {
    const [type, constraints] = Object.entries(options)[0];

    console.log("Options for name are ", name, constraints )

    switch (type) {
        case "NumericInt":
            return (
                <NumberField
                    value={value ? value.NumericInt : constraints.default }
                    onChange={(v: number) => onChange(name, {NumericInt:v})}
                    label={name}
                    step={1}
                />
            );
        case "Text":
            return (
                <TextField
                    value={value ? value.Text : constraints.default}
                    onChange={(v: string) => onChange(name, {Text:v})}
                    label={name}
                />
            );
        default:
            return <Text>Field type {type} currently not supported</Text>;
    }
};

export const ComputeImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {
    const [options, setOptions] = useState({
        url: "http://localhost:8000/compute/dot_density_analysis/matico_dot_density_analysis.js",
        name: "",
        params: {}
    });

    const updateComputeParams = (key: string, value: any) => {
        setOptions({ ...options, params: { ...options.params, [key]: value } });
    };

    const { analysis, error, load } = useAnalysis(options.url);

    const updateOptions = (update: { [option: string]: string }) => {
        setOptions({ ...options, ...update });
    };

    const getComputeOptions = () => {
        console.log("getting options");
    };

    const computeOptions = analysis ? analysis.options() : {};

    return (
        <Flex direction="column" gap="size-200">
            <TextField
                width="100%"
                label="compute url"
                value={options.url}
                onChange={(url) => updateOptions({ url })}
            />
            {!analysis && (
                <Button variant="cta" onPress={load}>
                    Load
                </Button>
            )}
            {analysis && (
                <>
                    {Object.keys(computeOptions).map((key) => (
                        <ParameterInput
                            key={key}
                            name={key}
                            options={computeOptions[key]}
                            value={options.params[key]}
                            onChange={updateComputeParams}
                        />
                    ))}
                    <TextField value={options.name} onChange={(name:string)=>setOptions({...options,name })} label="Dataset Name"/>

                    <Button
                        variant="cta"
                        onPress={() => onSubmit({ WASMCompute: options })}
                    >
                        Submit
                    </Button>
                </>
            )}
        </Flex>
    );
};

export const ComputeProvider: DatasetProvider = {
    name: "Compute Dataset",
    description: "Run a computation on one or more datasets",
    component: ComputeImporter
};
