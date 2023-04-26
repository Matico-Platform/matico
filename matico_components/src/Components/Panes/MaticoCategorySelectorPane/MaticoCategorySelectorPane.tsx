import React, { useEffect, useState } from "react";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "@maticoapp/matico_types/spec";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    Grid,
    Heading,
    repeat,
    SearchField,
    View
} from "@adobe/react-spectrum";
import { useErrorsFor } from "Hooks/useErrors";
import { MaticoErrorType } from "Stores/MaticoErrorSlice";
import { LoadingSpinner } from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";
import { v4 as uuid } from "uuid";
import { MissingParamsPlaceholder } from "../MissingParamsPlaceholder/MissingParamsPlaceholder";

export interface MaticoCateogrySelectorInterface extends MaticoPaneInterface {
    dataset: { name: string; filters: Array<Filter> };
    column: string;
    id: string;
}

const backgroundColor = "#fff";

export const MaticoCategorySelector: React.FC<
    MaticoCateogrySelectorInterface
> = ({ dataset, column = "", id, name }) => {
    const [selectedValues, setSelectedValues] = useAutoVariable({
        variable: {
            id: id + "_category_selection",
            paneId: id,
            name: `${column}_category_selection`,
            value: {
                type: "category",
                value: {
                    oneOf: [],
                    notOneOf: []
                }
            }
        },
        bind: true
    });
    const [search, setSearch] = useState<string | null>(null);
    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[dataset.name]
    );

    const datasetReady = foundDataset && foundDataset.state === "READY";
    const uniqueRequest = {
        datasetName: dataset.name,
        column: column,
        metric: "categoryCounts"
    };
    const uniqueValueRequest = useRequestColumnStat(uniqueRequest);

    const filteredOptions = uniqueValueRequest?.result?.filter((c: any) =>
        search && search.length ? c.name.includes(search) : true
    );

    const selectAll = () => {
        setSelectedValues({
            type: "category",
            value: {
                oneOf: uniqueValueRequest?.result
                    ?.map((v: any) => v.name)
                    .filter((f) => f !== null || f !== undefined),
                notOneOf: []
            }
        });
    };

    const selectNone = () => {
        setSelectedValues({
            type: "category",
            value: { oneOf: [], notOneOf: [] }
        });
    };

    return (
        <View
            width="100%"
            height="100%"
            position="relative"
            backgroundColor={"gray-200"}
            overflow="hidden"
        >
            {datasetReady ? (
                <View
                    width={"100%"}
                    height={"100%"}
                    paddingX="size-200"
                    UNSAFE_style={{ boxSizing: "border-box" }}
                >
                    <Flex direction="column" width="100%" height="100%">
                        <Flex
                            direction="row"
                            justifyContent={"space-between"}
                            alignItems="center"
                        >
                            <Heading flex={1}>{name}</Heading>
                            <SearchField
                                value={search}
                                onChange={(search) => setSearch(search)}
                            />
                        </Flex>
                        {uniqueValueRequest && (
                            <>
                                <View
                                    flex={1}
                                    overflow={{ y: "auto" }}
                                    id="container"
                                >
                                    <CheckboxGroup
                                        label={column}
                                        value={selectedValues.value.oneOf}
                                        onChange={(keys) => {
                                            setSelectedValues({
                                                type: "category",
                                                value: {
                                                    oneOf: keys,
                                                    notOneOf: []
                                                }
                                            });
                                        }}
                                        flex={1}
                                    >
                                        <Grid
                                            columns={repeat(
                                                "auto-fit",
                                                "size-2000"
                                            )}
                                            justifyContent="space-around"
                                            gap="size-100"
                                            width="100%"
                                            height="100%"
                                        >
                                            {filteredOptions.map((c: any) => (
                                                <Checkbox
                                                    key={c.name}
                                                    value={c.name}
                                                >
                                                    {JSON.stringify(c.name)} (
                                                    {c.count})
                                                </Checkbox>
                                            ))}
                                        </Grid>
                                    </CheckboxGroup>
                                </View>
                                <Flex direction="row">
                                    <Button
                                        variant="secondary"
                                        onPress={selectAll}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onPress={selectNone}
                                    >
                                        Select None
                                    </Button>
                                </Flex>
                            </>
                        )}
                    </Flex>
                </View>
            ) : (
                <LoadingSpinner />
            )}
        </View>
    );
};
