import { Flex, TextField, Button } from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import React, { useState } from "react";

export const GeoJSONImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {
    const [options, setOptions] = useState({
        url: "",
        name: "",
        lat_col: "",
        lng_col: ""
    });

    const updateOptions = (update: { [option: string]: string }) => {
        setOptions({ ...options, ...update });
    };

    return (
        <Flex direction="column" gap="size-200">
            <TextField
                label="url"
                width="100%"
                value={options.url}
                onChange={(url) => updateOptions({ url })}
            />
            <TextField
                label="name"
                width="100%"
                value={options.name}
                onChange={(name) => updateOptions({ name })}
            />
            <Button
                variant="cta"
                onPress={() => onSubmit({ type: "geoJSON", ...options })}
            >
                Add Dataset
            </Button>
        </Flex>
    );
};

export const GeoJSONProvider: DatasetProvider = {
    name: "GeoJSON Dataset",
    description: "Import a GeoJSON from a public url",
    component: GeoJSONImporter,
    parameterEditor: () => <h1>Not Implemented</h1>
};
