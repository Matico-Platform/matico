import {
    Flex,
    TextField,
    Button,
    Text,
    NumberField,
    Picker,
    Item,
    View
} from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider,
    DatasetParameterComponent
} from "Datasets/DatasetProvider";
import { useAnalysis } from "Hooks/useAnalysis";
import React, { useEffect, useState } from "react";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { Compute, useAvaliableCompute } from "Hooks/useAvaliableCompute";

export const ComputeParameterEditor: React.FC<DatasetParameterComponent> = ({
    spec,
    onChange
}) => {
    console.log("Parameter editor ", spec)

    const { analysis, error } = useAnalysis(spec.url);
    const parameters = analysis ? analysis.options() : {};
    const values = spec.params

    console.log("url ", spec.url, " values ", values);

    return (
        <View>
            {Object.keys(parameters).map((key) => (
                <ParameterInput
                    key={key}
                    name={key}
                    options={parameters[key]}
                    value={values[key]}
                    onChange={(key, val) =>
                        onChange({...spec, params:{  ...spec.params, [key]: val }})
                    }
                    params={values}
                />
            ))}
        </View>
    );
};

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
        case "NumericFloat":
            return (
                <NumberField
                    width="100%"
                    value={value ? value.NumericFloat: constraints.default}
                    description={description}
                    onChange={(v: number) => onChange(name, { NumericFloat: v })}
                    label={label}
                    step={0.1}
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
                    selectedDataset={value?.Table}
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
                    selectedColumn={value?.Column}
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
    onSubmit,
    parameters = {}
}) => {

    const [selectedCompute, setSelectedCompute] = useState<Compute|null>(null)

    const [spec, setSpec] = useState({
        name:"",
        url:null,
        params: parameters
    });

    const computes = useAvaliableCompute();

    const updateSpec = (update: Record<string,any>)=>{
      setSpec({...spec, ...update})
    }


    const { analysis, error } = useAnalysis(spec.url);
    console.log("analysis ", analysis, " spec ",spec.url)


    const computeOptions = analysis ? analysis.options() : {};
    const description = analysis ? analysis.description() : "";

    const setAnalysis = (key: string) => {
      
      const compute =  computes.find((c) => c.name === key)
      const computeURL = compute 
          ? `http://localhost:8000/compute${compute.path}`
          : null;
        setSpec({url: computeURL, params:{}, name: spec.name})
        setSelectedCompute(compute);
    };

    return (
        <Flex direction="column" gap="size-200">
            {computes && (
                <Picker
                    width={"100%"}
                    items={computes}
                    selectedKey={selectedCompute?.name}
                    onSelectionChange={setAnalysis}
                >
                    {(item) => <Item key={item.name}>{item.name}</Item>}
                </Picker>
            )}
            {analysis && (
                <>
                    <TextField
                        value={spec.name}
                        onChange={(name: string) =>
                            updateSpec({ name })
                        }
                        label="Result Dataset Name"
                    />
                    <ComputeParameterEditor
                        spec= {spec}
                        onChange={updateSpec}
                    />
                    <p>{description}</p>
                    <Button
                        variant="cta"
                        onPress={() =>
                            onSubmit({
                                WASMCompute:spec 
                            })
                        }
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
    component: ComputeImporter,
    parameterEditor: ComputeParameterEditor
};
