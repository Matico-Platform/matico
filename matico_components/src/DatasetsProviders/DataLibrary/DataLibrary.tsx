import { Flex, TextField, Button, TabList, TabPanels, ComboBox, Item, Tabs, Text } from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import React, { useState } from "react";
import { ArrowDataset } from "@maticoapp/matico_types/spec";
import { LineChartPaneEditor } from "Components/MaticoEditor/Panes/LineChartPaneEditor";
import { Dataset } from "Datasets/Dataset";

type DataLibraryEntry = {
    id: string,
    name: string,
    description: string,
    datasets: any[]
}

const states = [
    { name: "Alabama", abbr: "AL" },
    { name: "Alaska", abbr: "AK" },
    { name: "Arizona", abbr: "AZ" },
    { name: "Arkansas", abbr: "AR" },
    { name: "California", abbr: "CA" },
    { name: "Colorado", abbr: "CO" },
    { name: "Connecticut", abbr: "CT" },
    { name: "Delaware", abbr: "DE" },
    { name: "District of Columbia", abbr: "DC" },
    { name: "Florida", abbr: "FL" },
    { name: "Georgia", abbr: "GA" },
    { name: "Guam", abbr: "GU" },
    { name: "Hawaii", abbr: "HI" },
    { name: "Idaho", abbr: "ID" },
    { name: "Illinois", abbr: "IL" },
    { name: "Indiana", abbr: "IN" },
    { name: "Iowa", abbr: "IA" },
    { name: "Kansas", abbr: "KS" },
    { name: "Kentucky", abbr: "KY" },
    { name: "Louisiana", abbr: "LA" },
    { name: "Maine", abbr: "ME" },
    { name: "Maryland", abbr: "MD" },
    { name: "Massachusetts", abbr: "MA" },
    { name: "Michigan", abbr: "MI" },
    { name: "Minnesota", abbr: "MN" },
    { name: "Mississippi", abbr: "MS" },
    { name: "Missouri", abbr: "MO" },
    { name: "Montana", abbr: "MT" },
    { name: "Nebraska", abbr: "NE" },
    { name: "Nevada", abbr: "NV" },
    { name: "New Hampshire", abbr: "NH" },
    { name: "New Jersey", abbr: "NJ" },
    { name: "New Mexico", abbr: "NM" },
    { name: "New York", abbr: "NY" },
    { name: "North Carolina", abbr: "NC" },
    { name: "North Dakota", abbr: "ND" },
    { name: "Ohio", abbr: "OH" },
    { name: "Oklahoma", abbr: "OK" },
    { name: "Oregon", abbr: "OR" },
    { name: "Pennsylvania", abbr: "PA" },
    { name: "Puerto Rico", abbr: "PR" },
    { name: "Rhode Island", abbr: "RI" },
    { name: "South Carolina", abbr: "SC" },
    { name: "South Dakota", abbr: "SD" },
    { name: "Tennessee", abbr: "TN" },
    { name: "Texas", abbr: "TX" },
    { name: "Utah", abbr: "UT" },
    { name: "Vermont", abbr: "VT" },
    { name: "Virginia", abbr: "VA" },
    { name: "Washington", abbr: "WA" },
    { name: "West Virginia", abbr: "WV" },
    { name: "Wisconsin", abbr: "WI" },
    { name: "Wyoming", abbr: "WY" },
  ];
  
  
const DataLibrary:DataLibraryEntry[] = [
    {
        "id": "covid",
        "name": "Covid Data",
        "description": "Covid Data sourced from the New York Times",
        //@ts-ignore
        "datasets": states.map(state => ({
            url: `https://matico.s3.us-east-2.amazonaws.com/covid/by_state/${state.abbr}.feather`,
            name: state.name,
            type: "arrow"
        }))
    },
    {
        "id": "census",
        "name": "Census Data",
        "description": "Census Data sourced from the US Census Bureau",
        "datasets": [
            {
                url: "https://uscovidatlas.org/geojson/county_nyt.geojson",
                name: "Census Counties (Combined Metro NYC)",
                type: "geoJSON"
            }
        ]
    }
]

export const DataLibraryImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {

    const [selectedDataset, setSelectedDataset] = useState<any>();
    const [searchValue, setSearchValue] = useState<string>('');
    console.log(selectedDataset)
    return (
        <Flex direction="column" gap="size-200">
            <Tabs>
                <TabList>
                    {DataLibrary.map((entry) => (
                        <Item key={entry.id}>{entry.name}</Item>
                    ))}
                </TabList>
                <TabPanels>
                    {DataLibrary.map((entry) => (
                    <Item key={entry.id}>
                        <Flex direction="column" gap="size-200">
                            <Text>{entry.name}</Text>
                            <Text>{entry.description}</Text>
                        <ComboBox label="Select a dataset" onInputChange={setSearchValue} inputValue={searchValue} onSelectionChange={(value:string) => setSelectedDataset(entry.datasets.find(f=>f.name === value))}>
                            {entry.datasets.map((dataset) => (
                                <Item key={dataset.name} textValue={dataset.name} >
                                    {dataset.name}
                                </Item>
                            ))}
                        </ComboBox>
                        </Flex>
                    </Item>))}
                </TabPanels>
            </Tabs>
            <Button
                variant="cta"
                onPress={() => onSubmit(selectedDataset)}
            >
                Submit
            </Button>
        </Flex>
    );
};

export const DataLibraryProvider: DatasetProvider = {
    name: "Data Library",
    description: "Load curated datasets in to Matico",
    component: DataLibraryImporter,
    parameterEditor: () => <h1>Not implemented</h1>
};
