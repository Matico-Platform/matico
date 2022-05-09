import {
    Flex,
    TextField,
    Button,
    Text,
    NumberField,
    Picker,
    Item
} from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import { useAnalysis } from "Hooks/useAnalysis";
import React, { useEffect, useState } from "react";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { Compute, useAvaliableCompute } from "Hooks/useAvaliableCompute";

const ParameterInput: React.FC<{
    name: string;
    options: any;
    value: any;
    onChange: (key: string, value: any) => void;
    params: { [key: string]: any };
}> = ({ name, options, value, onChange, params }) => {
    const [type, constraints] = Object.entries(options)[0];
    console.log("Options for name are ", name, constraints);
    const description = constraints.display_details.description;
    const label = constraints.display_details.display_name ?? name;

    switch (type) {
        case "NumericInt":
            return (
                <NumberField
                    width="100%"
                    value={value ? value.NumericInt : constraints.default}
                    description={description}
                    onChange={(v: number) => onChange(name, { NumericInt: v })}
                    label={label}
                    step={1}
                />
            );
        case "Text":
            return (
                <TextField
                    width="100%"
                    value={value ? value.Text : constraints.default}
                    onChange={(v: string) => onChange(name, { Text: v })}
                    description={description}
                    label={label}
                />
            );
        case "Table":
            return (
                <DatasetSelector
                    label={label}
                    description={description}
                    onDatasetSelected={(dataset) =>
                        onChange(name, { Table: dataset })
                    }
                />
            );
        case "Column":
            return (
                <DatasetColumnSelector
                    label={label}
                    description={description}
                    datasetName={params[constraints.from_dataset]?.Table}
                    onColumnSelected={(column: Column) => {
                        onChange(name, { Column: column.name });
                    }}
                />
            );
        default:
            return <Text>Field type {type} currently not supported</Text>;
    }
};

export const ComputeImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {
    const [selectedCompute, setSelectedCompute] =
        useState<Compute | null>(null);

    const [options, setOptions] = useState({
        name: "",
        params: {}
    });

    const computes = useAvaliableCompute();

    const updateComputeParams = (key: string, value: any) => {
        setOptions({ ...options, params: { ...options.params, [key]: value } });
    };

    const { analysis, error} = useAnalysis(
        selectedCompute
            ? `http://localhost:8000/compute${selectedCompute.path}`
            : null
    );

    const updateOptions = (update: { [option: string]: string }) => {
        setOptions({ ...options, ...update });
    };

    const computeOptions = analysis ? analysis.options() : {};
    const description = analysis ? analysis.description() : "";

    const setAnalysis= (key: string) =>{
      setSelectedCompute(computes.find((c) => c.name === key))
      setOptions({...options, params:{}})
    }


    return (
        <Flex direction="column" gap="size-200">
            {computes && (
                <Picker
                    width={"100%"}
                    items={computes}
                    selectedKey={selectedCompute?.name}
                    onSelectionChange={ setAnalysis}
                >
                    {(item) => <Item key={item.name}>{item.name}</Item>}
                </Picker>
            )}
            {analysis && (
                <>
                    <TextField
                        value={options.name}
                        onChange={(name: string) =>
                            setOptions({ ...options, name })
                        }
                        label="Result Dataset Name"
                    />
                    <p>{description}</p>
                    {Object.keys(computeOptions).map((key) => (
                        <ParameterInput
                            key={key}
                            name={key}
                            options={computeOptions[key]}
                            value={options.params[key]}
                            onChange={updateComputeParams}
                            params={options.params}
                        />
                    ))}

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
