import { Flex, TextField, Button, Picker, Item } from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import React, { useState } from "react";

export const URLImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {
    const [options, setOptions] = useState({
        url: "",
        name: "",
        latCol: "",
        lngCol: ""
    });

    const [format, setFormat] = useState<"geoJSON" | "csv" | "arrow">(
        "geoJSON"
    );

    const updateOptions = (update: { [option: string]: string }) => {
        setOptions({ ...options, ...update });
    };

    const submit = () => {
        if (format === "geoJSON" || format === "arrow") {
            onSubmit({ type: format, name: options.name, url: options.url });
        } else {
            onSubmit({ type: format, ...options });
        }
    };

    return (
        <Flex direction="column" gap="size-200">
            <Flex direction="row" alignItems="center" gap="size-200">
                <TextField
                    label="url"
                    width="100%"
                    value={options.url}
                    onChange={(url) => updateOptions({ url })}
                    flex={1}
                />
                <Picker
                    label="format"
                    selectedKey={format}
                    onSelectionChange={(format) => setFormat(format)}
                >
                    <Item key={"geoJSON"}>GeoJSON</Item>
                    <Item key={"csv"}>CSV</Item>
                    <Item key={"arrow"}>GeoParquet</Item>
                </Picker>
            </Flex>

            <TextField
                label="name"
                width="100%"
                value={options.name}
                onChange={(name) => updateOptions({ name })}
            />
            {format === "csv" && (
                <Flex direction="row" gap="size-200">
                    <TextField
                        width="100%"
                        label="latitude column"
                        value={options.latCol}
                        onChange={(latCol) => updateOptions({ latCol })}
                    />
                    <TextField
                        width="100%"
                        label="longitude column"
                        value={options.lngCol}
                        onChange={(lngCol) => updateOptions({ lngCol })}
                    />
                </Flex>
            )}
            <Button variant="cta" onPress={submit}>
                Add Dataset
            </Button>
        </Flex>
    );
};

export const URLProvider: DatasetProvider = {
    name: "Link",
    description: "Import a dataset from a public url",
    component: URLImporter,
    parameterEditor: () => <h1>Not Implemented</h1>
};
