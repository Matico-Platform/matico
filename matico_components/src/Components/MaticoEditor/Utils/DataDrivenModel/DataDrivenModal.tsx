import React, { useEffect, useState } from "react";
import {
    DialogTrigger,
    Dialog,
    ActionButton,
    Content,
    Flex,
    View,
    Heading,
    TabPanels,
    Tabs,
    TabList,
    Item
} from "@adobe/react-spectrum";
import { DatasetColumnSelector } from "../DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { useMaticoSelector } from "Hooks/redux";
import _ from "lodash";
import { Mapping, MappingType } from "@maticoapp/matico_types/spec";
import { ContinuousDomain } from "./ContinuousDomainEditor";
import { DiscreteDomain } from "./DiscreteDomainEditor";

export interface DataDrivenModalProps<D, R> {
    spec: Mapping<D, R>;
    label: string;
    datasetName: string;
    rangeType: "color" | "value";
    onUpdateSpec: (spec: Mapping<D, R>) => void;
}

const baseSpecForCol = (
    datasetName: string,
    column: Column,
    mappingType: MappingType
) => {
    if (mappingType === "continuious") {
        return {
            variable: column.name,
            domain: {
                type: mappingType,
                values: {
                    metric: {
                        type: "quantile",
                        bins: 5
                    },
                    dataset: datasetName,
                    column: column.name
                }
            },
            range: { type: "continuious", values: "RedOr.5" }
        };
    } else {
        return {
            variable: column.name,
            domain: {
                type: mappingType,
                values: {
                    metric: {
                        type: "categories",
                        no_categories: 7
                    },
                    dataset: datasetName,
                    column: column.name
                }
            },
            range: { type: "continuious", values: "Pastel1.7" }
        };
    }
};

export function DataDrivenModal<D, R>({
    spec,
    datasetName,
    onUpdateSpec,
    rangeType,
    label
}: DataDrivenModalProps<D, R>) {
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[datasetName]
    );

    const column = dataset?.columns.find((col) => col.name === spec.variable);
    let [mappingType, setMappingType] = useState<MappingType>("continuious");

    useEffect(() => {
        onUpdateSpec(baseSpecForCol(datasetName, column, mappingType));
    }, [mappingType, datasetName, column]);

    return (
        <DialogTrigger isDismissable>
            <ActionButton>{label}</ActionButton>
            <Dialog>
                <Content>
                    <Flex direction="column">
                        <Heading>Data Driven Styling</Heading>
                        <View>
                            <DatasetColumnSelector
                                datasetName={datasetName}
                                selectedColumn={column.name}
                                onColumnSelected={(column) =>
                                    onUpdateSpec(
                                        baseSpecForCol(
                                            datasetName,
                                            column,
                                            mappingType
                                        )
                                    )
                                }
                            />
                            <Tabs
                                selectedKey={mappingType}
                                onSelectionChange={(type) =>
                                    setMappingType(type as MappingType)
                                }
                            >
                                <TabList>
                                    <Item key="continuious">Continuious</Item>
                                    <Item key="discrete">Discrete</Item>
                                </TabList>
                                <TabPanels>
                                    <Item key="continuious">
                                        <ContinuousDomain
                                            column={column}
                                            dataset={dataset}
                                            filters={[]}
                                            rangeType={rangeType}
                                            mapping={spec}
                                            onUpdateMapping={(newMapping) =>
                                                onUpdateSpec({
                                                    ...spec,
                                                    ...newMapping
                                                })
                                            }
                                        />
                                    </Item>
                                    <Item key="discrete">
                                        <DiscreteDomain
                                            column={column}
                                            dataset={dataset}
                                            filters={[]}
                                            rangeType={rangeType}
                                            mapping={spec}
                                            onUpdateMapping={(newMapping) =>
                                                onUpdateSpec({
                                                    ...spec,
                                                    ...newMapping
                                                })
                                            }
                                        />
                                    </Item>
                                </TabPanels>
                            </Tabs>
                        </View>
                    </Flex>
                </Content>
            </Dialog>
        </DialogTrigger>
    );
}
