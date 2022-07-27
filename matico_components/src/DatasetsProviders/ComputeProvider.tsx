import {
    Flex,
    TextField,
    Button,
    Text,
    Picker,
    Item,
    View,
    Well,
    Header, Content, ActionButton
} from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider,
    DatasetParameterComponent
} from "Datasets/DatasetProvider";
import { useAnalysis, populateDefaults } from "Hooks/useAnalysis";
import React, { useEffect, useState } from "react";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { Compute, useAvaliableCompute } from "Hooks/useAvaliableCompute";
import { ValueOrVariableInput } from "Components/MaticoEditor/Utils/ValueOrVariableInput";
import { SpecParameter,SpecParameterValue } from "@maticoapp/matico_types/spec";

export const ComputeParameterEditor: React.FC<DatasetParameterComponent> = ({
    spec,
    onChange
}) => {
    const { analysis, error, options } = useAnalysis(spec.url);
    const values = spec.params;

    const updateValues = (update: SpecParameter) => {
        console.log("update is ", update);
        onChange({
            ...spec,
            params: spec.params.map((p: SpecParameter) =>
                p.name === update.name ? update : p
            )
        });
    };

    return (
        <View>
            <ParameterGroup
                parameters={options}
                values={values}
                onChange={updateValues}
            />
        </View>
    );
};

const ParameterGroup: React.FC<{
    parameters: any;
    values: any;
    onChange: (update: SpecParameter) => void;
}> = ({ parameters, values, onChange }) => {
    if (!parameters || !values) return <></>;

    return (
        <>
            {Object.keys(parameters).map((key) => {
                let val = values.find((v: SpecParameter) => v.name === key)
                    .parameter.value;
                console.log(" input for ", key, parameters[key], val);
                return (
                    <ParameterInput
                        key={key}
                        name={key}
                        options={parameters[key]}
                        value={
                            values.find((v: SpecParameter) => v.name === key)
                                .parameter.value
                        }
                        onChange={onChange}
                        params={values}
                    />
                );
            })}
        </>
    );
};

const ParameterInput: React.FC<{
    name: string;
    options: any;
    value: any;
    onChange: (update: SpecParameter) => void;
    params: { [key: string]: any };
}> = ({ name, options, value, onChange, params }) => {
    console.log(name, options, value, onChange, params);

    const { type, displayDetails } = options;
    const { displayName, description } = displayDetails;
    const defaultVal = options.default;

    switch (type) {
        case "numericInt":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) =>
                        onChange({ name, parameter: { type, value: newVal } })
                    }
                />
            );

        case "numericFloat":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) =>
                        onChange({ name, parameter: { type, value: newVal } })
                    }
                />
            );
        case "text":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) =>
                        onChange({ name, parameter: { type, value: newVal } })
                    }
                />
            );
        case "table":
            return (
                <DatasetSelector
                    label={displayName}
                    description={description}
                    selectedDataset={value?.table}
                    onDatasetSelected={(dataset) =>
                        onChange({ name, parameter: { type, value: dataset } })
                    }
                />
            );
        case "column":
            return (
                <DatasetColumnSelector
                    label={displayName}
                    description={description}
                    selectedColumn={value}
                    datasetName={params[options.from_dataset]?.Table}
                    onColumnSelected={(column: Column) => {
                        onChange({
                            name,
                            parameter: { type, value: column.name }
                        });
                    }}
                />
            );

        case "repeatedOption":
          console.log("reapeated option value" ,value,options)
            return (
                <Well>
                    <Header> {displayName}</Header>
                    <Content>{description} </Content>
                    {value.map((instance: SpecParameterValue, index: number) => { 
                      console.log("instance is ", instance, value, options)
                      return (
                        <ParameterInput
                            name={""}
                            options={options.options}
                            value={instance.value}
                            onChange={(update) =>{
                                console.log("update is ", update)
                            
                                onChange({
                                    name,
                                    parameter: {
                                        type,
                                        value: value.map(
                                            (
                                                v: SpecParameterValue,
                                                v_index: number
                                            ) =>
                                                v_index === index ? update.parameter: v
                                        )
                                    }
                                })
                            }
                            }
                            params={params}
                            key={index}
                        />
                    )})}
                    <ActionButton
                        onPress={() => {
                            onChange({
                                name,
                                parameter: {
                                    type,
                                    value: [
                                        ...value,
                                        ...populateDefaults({
                                            [`${name}_${value.length + 1}`]:
                                                options.options
                                        }).map(p=>p.parameter)
                                    ]
                                }
                            });
                        }}
                    >
                        Add
                    </ActionButton>
                </Well>
            );
        case "optionGroup":
            console.log("Option group", options, value);
            return (
                <Well>
                    <Header> {displayName}</Header>
                    <Content>{description} </Content>
                    <ParameterGroup
                        parameters={options.options}
                        values={value}
                        onChange={(update) =>
                            onChange({
                                name,
                                parameter: {
                                    type,
                                    value: value.map((v: SpecParameter) =>
                                        v.name === update.name ? update : v
                                    )
                                }
                            })
                        }
                    />
                </Well>
            );

        default:
            return <Text>Field type {type} currently not supported</Text>;
    }
};

export const ComputeImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit,
    parameters = []
}) => {
    const [selectedCompute, setSelectedCompute] =
        useState<Compute | null>(null);

    const [spec, setSpec] = useState({
        name: "",
        url: null,
        params: parameters
    });


    const computes = useAvaliableCompute();

    const updateSpec = (update: Record<string, any>) => {
        console.log("updating spec with update", update);
        setSpec({ ...spec, ...update });
    };

    const { analysis, error, defaults } = useAnalysis(spec.url);

    useEffect(() => {
        if (defaults) {
            setSpec({ ...spec, params: [...defaults, ...parameters] });
        }
    }, [JSON.stringify(defaults)]);

    const computeOptions = analysis ? analysis.options() : {};
    const description = analysis ? analysis.description() : "";

    const setAnalysis = (key: string) => {
        const compute = computes.find((c) => c.name === key);
        const computeURL = compute
            ? `http://localhost:8000/compute${compute.path}`
            : null;
        setSpec({ url: computeURL, params: [], name: spec.name });
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
                        onChange={(name: string) => updateSpec({ name })}
                        label="Result Dataset Name"
                    />
                    <ComputeParameterEditor spec={spec} onChange={updateSpec} />
                    <p>{description}</p>
                    <Button
                        variant="cta"
                        onPress={() =>
                            onSubmit({
                                type: "wasmCompute",
                                ...spec
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
