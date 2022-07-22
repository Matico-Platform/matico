import {
    Flex,
    TextField,
    Button,
    Text,
    Picker,
    Item,
    View,
    Well,
    Header,
    Content
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
import { ValueOrVariableInput } from "Components/MaticoEditor/Utils/ValueOrVariableInput";
import { SpecParameter } from "@maticoapp/matico_types/spec";

export const ComputeParameterEditor: React.FC<DatasetParameterComponent> = ({
    spec,
    onChange
}) => {
    const { analysis, error } = useAnalysis(spec.url);
    const parameters = analysis ? analysis.options() : {};
    const values = spec.params;

    return (
        <View>
          <ParameterGroup parameters={parameters}  values={values} onChange={onChange} />
        </View>
    );
};

const ParameterGroup: React.FC<{
  parameters: any,
  values: any,
  onChange: (update:any)=>void
}> = ({parameters, values, onChange})=>{
  return(
      <>
            {Object.keys(parameters).map((key) => (
                <ParameterInput
                    key={key}
                    name={key}
                    options={parameters[key]}
                    value={
                        values.find((v: SpecParameter) => v.name === key)
                            .parameter.value
                    }
                    onChange={(key, val) =>
                        onChange({[key]:val})}
                    params={values}
                />
            ))}
            </>
  )
}

const ParameterInput: React.FC<{
    name: string;
    options: any;
    value: any;
    onChange: (key: string, value: any) => void;
    params: { [key: string]: any };
}> = ({ name, options, value, onChange, params }) => {
    console.log(name, options, value, onChange, params);

    const { type, displayDetails } = options;
    const { displayName, description } = displayDetails;
    const defaultVal = options.default;

    console.log("display name is ", displayName);

    switch (type) {
        case "numericInt":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) => onChange(name, newVal)}
                />
            );

        case "numericFloat":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) => onChange(name, newVal)}
                />
            );
        case "text":
            return (
                <ValueOrVariableInput
                    value={value ? value : defaultVal}
                    label={displayName}
                    defaultValue={defaultVal}
                    onChange={(newVal) => onChange(name, newVal)}
                />
            );
        case "table":
            return (
                <DatasetSelector
                    label={displayName}
                    description={description}
                    selectedDataset={value?.table}
                    onDatasetSelected={(dataset) => onChange(name, dataset)}
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
                        onChange(name, column.name);
                    }}
                />
            );
        case "optionGroup":
            return (
                <Well>
                    <Header> {displayName}</Header>
                    <Content>{description} </Content>
                    <ParameterGroup parameters={options.options} values={value[name]} onChange={(update)=> console.log("update ",update)} />
                </Well>
            );
            return <Text>Filed type {type} currently not supported</Text>;

        case "repeatedOption":
            return <Text>Filed type {type} currently not supported</Text>;

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
